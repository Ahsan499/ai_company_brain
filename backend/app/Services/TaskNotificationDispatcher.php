<?php

namespace App\Services;

use App\Enums\TaskStatus;
use App\Models\NotificationPreference;
use App\Models\Task;
use App\Models\User;
use App\Notifications\TaskAssignedNotification;
use App\Notifications\TaskCompletedNotification;
use Illuminate\Support\Facades\Notification;

class TaskNotificationDispatcher
{
    public function notifyAssigneeIfNeeded(?Task $task, ?int $previousAssigneeId = null): void
    {
        if (! $task || ! $task->assignee_id) {
            return;
        }

        if ($previousAssigneeId !== null && (int) $previousAssigneeId === (int) $task->assignee_id) {
            return;
        }

        $assignee = User::query()->find($task->assignee_id);
        if (! $assignee) {
            return;
        }

        // Skip self-assign on create (noise).
        if ($previousAssigneeId === null
            && $task->created_by
            && (int) $task->created_by === (int) $assignee->id) {
            return;
        }

        if (! NotificationPreference::defaultsFor($assignee)->allows('task_assigned')) {
            return;
        }

        $assignee->notify((new TaskAssignedNotification($task))->afterCommit());
    }

    public function notifyCompletedIfNeeded(Task $task, string $previousStatus, string $newStatus, ?User $actor = null): void
    {
        $wasDone = $this->isDoneStatus($previousStatus);
        $isDone = $this->isDoneStatus($newStatus);

        if ($wasDone || ! $isDone) {
            return;
        }

        $task->loadMissing(['project.members', 'creator', 'assignee']);

        $recipients = collect();

        if ($task->creator && (! $actor || (int) $task->creator->id !== (int) $actor->id)) {
            $recipients->push($task->creator);
        }

        $leads = $task->project?->members
            ->filter(fn (User $m) => strcasecmp((string) $m->pivot->role_in_project, 'Project Lead') === 0)
            ->reject(fn (User $m) => $actor && (int) $m->id === (int) $actor->id)
            ?? collect();

        $recipients = $recipients
            ->merge($leads)
            ->unique('id')
            ->reject(fn (User $u) => $task->assignee_id && (int) $u->id === (int) $task->assignee_id)
            ->filter(fn (User $u) => NotificationPreference::defaultsFor($u)->allows('task_completed'));

        if ($recipients->isEmpty()) {
            return;
        }

        Notification::send($recipients, (new TaskCompletedNotification($task))->afterCommit());
    }

    protected function isDoneStatus(string|TaskStatus $status): bool
    {
        $value = $status instanceof TaskStatus ? $status->value : (string) $status;

        return in_array(strtolower($value), ['done', 'completed'], true);
    }
}
