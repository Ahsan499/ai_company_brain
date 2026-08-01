<?php

namespace App\Notifications;

use App\Models\Task;
use App\Notifications\Concerns\ChecksNotificationPreferences;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TaskAssignedNotification extends Notification implements ShouldQueue
{
    use ChecksNotificationPreferences, Queueable;

    public function __construct(public Task $task) {}

    protected function preferenceKey(): string
    {
        return 'task_assigned';
    }

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $this->task->loadMissing(['project', 'creator']);

        $projectName = $this->task->project?->name ?? 'Untitled project';
        $assignedBy = $this->task->creator?->name ?? 'A teammate';
        $due = $this->task->due_date
            ? $this->task->due_date->format('M j, Y')
            : 'No due date';
        $url = rtrim((string) config('services.frontend.url', config('app.url')), '/')
            .'/dashboard/tasks/'.$this->task->id;

        return (new MailMessage)
            ->subject('Task assigned: '.$this->task->title)
            ->greeting('Hello '.$notifiable->name.',')
            ->line('You have been assigned a new task.')
            ->line('**Task:** '.$this->task->title)
            ->line('**Project:** '.$projectName)
            ->line('**Assigned by:** '.$assignedBy)
            ->line('**Due date:** '.$due)
            ->action('View task', $url)
            ->line('You can manage notification preferences in Settings.');
    }

    public function toArray(object $notifiable): array
    {
        $this->task->loadMissing(['project', 'creator']);

        return [
            'category' => 'task',
            'event' => 'task_assigned',
            'title' => 'Task assigned: '.$this->task->title,
            'description' => sprintf(
                '%s assigned you a task on %s.',
                $this->task->creator?->name ?? 'Someone',
                $this->task->project?->name ?? 'a project'
            ),
            'task_id' => $this->task->id,
            'project_id' => $this->task->project_id,
            'url' => '/dashboard/tasks/'.$this->task->id,
            'avatar' => $this->task->creator?->initials ?? 'SY',
        ];
    }
}
