<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NotificationPreference extends Model
{
    protected $fillable = [
        'user_id',
        'email_enabled',
        'push_enabled',
        'task_assigned',
        'task_completed',
        'meeting_reminders',
        'mentions',
        'weekly_digest',
    ];

    protected function casts(): array
    {
        return [
            'email_enabled' => 'boolean',
            'push_enabled' => 'boolean',
            'task_assigned' => 'boolean',
            'task_completed' => 'boolean',
            'meeting_reminders' => 'boolean',
            'mentions' => 'boolean',
            'weekly_digest' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public static function defaultsFor(User $user): self
    {
        return static::query()->firstOrCreate(
            ['user_id' => $user->id],
            [
                'email_enabled' => true,
                'push_enabled' => true,
                'task_assigned' => true,
                'task_completed' => true,
                'meeting_reminders' => true,
                'mentions' => true,
                'weekly_digest' => true,
            ]
        );
    }

    public function allows(string $preferenceKey): bool
    {
        return (bool) ($this->{$preferenceKey} ?? false);
    }
}
