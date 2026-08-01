<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\NotificationPreference;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationPreferenceController extends Controller
{
    use ApiResponse;

    public function show(Request $request): JsonResponse
    {
        $prefs = NotificationPreference::defaultsFor($request->user());

        return $this->successResponse(
            $this->transform($prefs),
            'Notification preferences retrieved successfully.'
        );
    }

    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email_enabled' => ['sometimes', 'boolean'],
            'push_enabled' => ['sometimes', 'boolean'],
            'task_assigned' => ['sometimes', 'boolean'],
            'task_completed' => ['sometimes', 'boolean'],
            'meeting_reminders' => ['sometimes', 'boolean'],
            'mentions' => ['sometimes', 'boolean'],
            'weekly_digest' => ['sometimes', 'boolean'],
            // Frontend camelCase aliases
            'emailEnabled' => ['sometimes', 'boolean'],
            'pushEnabled' => ['sometimes', 'boolean'],
            'taskAssigned' => ['sometimes', 'boolean'],
            'taskCompleted' => ['sometimes', 'boolean'],
            'meetingReminders' => ['sometimes', 'boolean'],
            'weeklyDigest' => ['sometimes', 'boolean'],
            'email' => ['sometimes', 'boolean'],
            'push' => ['sometimes', 'boolean'],
        ]);

        $map = [
            'email' => 'email_enabled',
            'emailEnabled' => 'email_enabled',
            'push' => 'push_enabled',
            'pushEnabled' => 'push_enabled',
            'taskAssigned' => 'task_assigned',
            'taskCompleted' => 'task_completed',
            'meetingReminders' => 'meeting_reminders',
            'weeklyDigest' => 'weekly_digest',
        ];

        $payload = [];
        foreach ($validated as $key => $value) {
            $column = $map[$key] ?? $key;
            if (in_array($column, [
                'email_enabled',
                'push_enabled',
                'task_assigned',
                'task_completed',
                'meeting_reminders',
                'mentions',
                'weekly_digest',
            ], true)) {
                $payload[$column] = (bool) $value;
            }
        }

        $prefs = NotificationPreference::defaultsFor($request->user());
        $prefs->fill($payload)->save();

        return $this->successResponse(
            $this->transform($prefs->fresh()),
            'Notification preferences updated successfully.'
        );
    }

    protected function transform(NotificationPreference $prefs): array
    {
        return [
            'email_enabled' => $prefs->email_enabled,
            'push_enabled' => $prefs->push_enabled,
            'task_assigned' => $prefs->task_assigned,
            'task_completed' => $prefs->task_completed,
            'meeting_reminders' => $prefs->meeting_reminders,
            'mentions' => $prefs->mentions,
            'weekly_digest' => $prefs->weekly_digest,
            // camelCase for frontend settings toggles
            'email' => $prefs->email_enabled,
            'push' => $prefs->push_enabled,
            'taskAssigned' => $prefs->task_assigned,
            'taskCompleted' => $prefs->task_completed,
            'meetingReminders' => $prefs->meeting_reminders,
            'weeklyDigest' => $prefs->weekly_digest,
        ];
    }
}
