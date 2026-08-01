<?php

namespace App\Notifications\Concerns;

use App\Models\NotificationPreference;
use App\Models\User;

trait ChecksNotificationPreferences
{
    abstract protected function preferenceKey(): string;

    public function shouldSend(object $notifiable, string $channel): bool
    {
        if (! $notifiable instanceof User) {
            return false;
        }

        $prefs = NotificationPreference::defaultsFor($notifiable);

        if (! $prefs->allows($this->preferenceKey())) {
            return false;
        }

        if ($channel === 'mail' && ! $prefs->email_enabled) {
            return false;
        }

        return true;
    }
}
