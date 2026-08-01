<?php

namespace App\Notifications;

use App\Models\Meeting;
use App\Notifications\Concerns\ChecksNotificationPreferences;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class MeetingReminderNotification extends Notification implements ShouldQueue
{
    use ChecksNotificationPreferences, Queueable;

    public function __construct(public Meeting $meeting) {}

    protected function preferenceKey(): string
    {
        return 'meeting_reminders';
    }

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $starts = $this->formatStart();
        $url = rtrim((string) config('services.frontend.url', config('app.url')), '/')
            .'/dashboard/meetings/'.$this->meeting->id;

        $mail = (new MailMessage)
            ->subject('Meeting reminder: '.$this->meeting->title)
            ->greeting('Hello '.$notifiable->name.',')
            ->line('Your meeting starts in about 15 minutes.')
            ->line('**Meeting:** '.$this->meeting->title)
            ->line('**When:** '.$starts);

        if ($this->meeting->join_url) {
            $mail->action('Join meeting', $this->meeting->join_url);
        } else {
            $mail->action('View meeting', $url);
        }

        return $mail;
    }

    public function toArray(object $notifiable): array
    {
        return [
            'category' => 'meeting',
            'event' => 'meeting_reminder',
            'title' => 'Upcoming: '.$this->meeting->title,
            'description' => 'Starts at '.$this->formatStart()
                .($this->meeting->join_url ? ' · Join link available' : ''),
            'meeting_id' => $this->meeting->id,
            'url' => '/dashboard/meetings/'.$this->meeting->id,
            'join_url' => $this->meeting->join_url,
            'avatar' => 'SY',
        ];
    }

    protected function formatStart(): string
    {
        $date = $this->meeting->date?->format('M j, Y') ?? '';
        $time = $this->meeting->start_time
            ? substr((string) $this->meeting->start_time, 0, 5)
            : '';

        return trim($date.' '.$time) ?: 'soon';
    }
}
