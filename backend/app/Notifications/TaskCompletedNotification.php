<?php

namespace App\Notifications;

use App\Models\Task;
use App\Notifications\Concerns\ChecksNotificationPreferences;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TaskCompletedNotification extends Notification implements ShouldQueue
{
    use ChecksNotificationPreferences, Queueable;

    public function __construct(public Task $task) {}

    protected function preferenceKey(): string
    {
        return 'task_completed';
    }

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $this->task->loadMissing(['project', 'assignee']);

        $projectName = $this->task->project?->name ?? 'Untitled project';
        $completedBy = $this->task->assignee?->name ?? 'A teammate';
        $url = rtrim((string) config('services.frontend.url', config('app.url')), '/')
            .'/dashboard/tasks/'.$this->task->id;

        return (new MailMessage)
            ->subject('Task completed: '.$this->task->title)
            ->greeting('Hello '.$notifiable->name.',')
            ->line('A task you follow has been marked done.')
            ->line('**Task:** '.$this->task->title)
            ->line('**Project:** '.$projectName)
            ->line('**Completed by:** '.$completedBy)
            ->action('View task', $url);
    }

    public function toArray(object $notifiable): array
    {
        $this->task->loadMissing(['project', 'assignee']);

        return [
            'category' => 'task',
            'event' => 'task_completed',
            'title' => 'Task completed: '.$this->task->title,
            'description' => sprintf(
                '%s marked “%s” done on %s.',
                $this->task->assignee?->name ?? 'Someone',
                $this->task->title,
                $this->task->project?->name ?? 'a project'
            ),
            'task_id' => $this->task->id,
            'project_id' => $this->task->project_id,
            'url' => '/dashboard/tasks/'.$this->task->id,
            'avatar' => $this->task->assignee?->initials ?? 'SY',
        ];
    }
}
