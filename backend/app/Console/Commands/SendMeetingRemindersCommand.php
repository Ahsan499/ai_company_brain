<?php

namespace App\Console\Commands;

use App\Models\Meeting;
use App\Notifications\MeetingReminderNotification;
use Carbon\Carbon;
use Illuminate\Console\Command;

class SendMeetingRemindersCommand extends Command
{
    protected $signature = 'notifications:meeting-reminders';

    protected $description = 'Send reminders for meetings starting in about 15 minutes';

    public function handle(): int
    {
        $now = Carbon::now();
        $windowStart = $now->copy()->addMinutes(10);
        $windowEnd = $now->copy()->addMinutes(20);

        $meetings = Meeting::query()
            ->with(['attendees', 'organizer'])
            ->whereNull('reminder_sent_at')
            ->whereDate('date', $now->toDateString())
            ->get()
            ->filter(function (Meeting $meeting) use ($windowStart, $windowEnd) {
                $startsAt = $this->meetingStartsAt($meeting);
                if (! $startsAt) {
                    return false;
                }

                return $startsAt->betweenIncluded($windowStart, $windowEnd);
            });

        $sent = 0;

        foreach ($meetings as $meeting) {
            $recipients = collect($meeting->attendees);
            if ($meeting->organizer) {
                $recipients->push($meeting->organizer);
            }
            $recipients = $recipients->unique('id');

            foreach ($recipients as $user) {
                $user->notify(new MeetingReminderNotification($meeting));
                $sent++;
            }

            $meeting->forceFill(['reminder_sent_at' => now()])->save();
        }

        $this->info("Queued reminders for {$meetings->count()} meeting(s) ({$sent} recipient notification(s)).");

        return self::SUCCESS;
    }

    protected function meetingStartsAt(Meeting $meeting): ?Carbon
    {
        if (! $meeting->date || ! $meeting->start_time) {
            return null;
        }

        $time = (string) $meeting->start_time;
        // MySQL time may come as H:i:s
        $dateStr = $meeting->date->format('Y-m-d');

        try {
            return Carbon::parse($dateStr.' '.$time);
        } catch (\Throwable) {
            return null;
        }
    }
}
