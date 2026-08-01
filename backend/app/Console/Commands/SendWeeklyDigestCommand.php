<?php

namespace App\Console\Commands;

use App\Enums\UserStatus;
use App\Models\NotificationPreference;
use App\Models\User;
use App\Notifications\WeeklyDigestNotification;
use App\Services\WeeklyDigestCompiler;
use Illuminate\Console\Command;

class SendWeeklyDigestCommand extends Command
{
    protected $signature = 'notifications:weekly-digest';

    protected $description = 'Send weekly digest emails/notifications to users with the preference enabled';

    public function handle(WeeklyDigestCompiler $compiler): int
    {
        $users = User::query()
            ->where('status', UserStatus::Active->value)
            ->get()
            ->filter(function (User $user) {
                return NotificationPreference::defaultsFor($user)->weekly_digest;
            });

        $count = 0;
        foreach ($users as $user) {
            $summary = $compiler->compile($user);
            $user->notify(new WeeklyDigestNotification($user, $summary));
            $count++;
        }

        $this->info("Queued weekly digests for {$count} user(s).");

        return self::SUCCESS;
    }
}
