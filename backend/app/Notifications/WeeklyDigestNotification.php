<?php

namespace App\Notifications;

use App\Models\User;
use App\Notifications\Concerns\ChecksNotificationPreferences;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class WeeklyDigestNotification extends Notification implements ShouldQueue
{
    use ChecksNotificationPreferences, Queueable;

    /**
     * @param  array{tasks_completed:int,upcoming_meetings:int,hours_logged:float,week_start:string,week_end:string}  $summary
     */
    public function __construct(public User $digestUser, public array $summary) {}

    protected function preferenceKey(): string
    {
        return 'weekly_digest';
    }

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $hours = number_format((float) ($this->summary['hours_logged'] ?? 0), 1);
        $url = rtrim((string) config('services.frontend.url', config('app.url')), '/')
            .'/dashboard/reports';

        return (new MailMessage)
            ->subject('Your weekly digest')
            ->greeting('Hello '.$notifiable->name.',')
            ->line(sprintf(
                'Here’s your week (%s – %s):',
                $this->summary['week_start'] ?? '',
                $this->summary['week_end'] ?? ''
            ))
            ->line('**Tasks completed:** '.(int) ($this->summary['tasks_completed'] ?? 0))
            ->line('**Upcoming meetings:** '.(int) ($this->summary['upcoming_meetings'] ?? 0))
            ->line('**Hours logged:** '.$hours)
            ->action('Open reports', $url);
    }

    public function toArray(object $notifiable): array
    {
        $hours = number_format((float) ($this->summary['hours_logged'] ?? 0), 1);

        return [
            'category' => 'system',
            'event' => 'weekly_digest',
            'title' => 'Your weekly digest',
            'description' => sprintf(
                '%d tasks done · %d upcoming meetings · %s hours logged',
                (int) ($this->summary['tasks_completed'] ?? 0),
                (int) ($this->summary['upcoming_meetings'] ?? 0),
                $hours
            ),
            'summary' => $this->summary,
            'url' => '/dashboard/reports',
            'avatar' => 'SY',
        ];
    }
}
