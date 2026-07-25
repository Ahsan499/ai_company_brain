<?php

namespace App\Services;

use App\Http\Resources\Notification\NotificationResource;
use App\Models\Notification;

class NotificationService
{
    /**
     * Display all notifications.
     */
    public function index()
    {
        $notifications = Notification::with([
            'organization',
            'user',
        ])->latest()->paginate(10);

        return NotificationResource::collection($notifications);
    }

    /**
     * Store notification.
     */
    public function store(array $data)
    {
        $notification = Notification::create($data);

        $notification->load([
            'organization',
            'user',
        ]);

        return new NotificationResource($notification);
    }

    /**
     * Show notification.
     */
    public function show(int $id)
    {
        $notification = Notification::with([
            'organization',
            'user',
        ])->findOrFail($id);

        return new NotificationResource($notification);
    }

    /**
     * Update notification.
     */
    public function update(int $id, array $data)
    {
        $notification = Notification::findOrFail($id);

        $notification->update($data);

        $notification->load([
            'organization',
            'user',
        ]);

        return new NotificationResource($notification);
    }

    /**
     * Delete notification.
     */
    public function destroy(int $id): bool
    {
        $notification = Notification::findOrFail($id);

        return $notification->delete();
    }

    /**
     * Mark a notification as read.
     */
    public function markAsRead(int $id)
    {
        $notification = Notification::findOrFail($id);

        $notification->update([
            'is_read' => true,
            'read_at' => now(),
        ]);

        $notification->load([
            'organization',
            'user',
        ]);

        return new NotificationResource($notification);
    }

    /**
     * Mark all notifications as read for a user.
     */
    public function markAllAsRead(int $userId): int
    {
        return Notification::where('user_id', $userId)
            ->where('is_read', false)
            ->update([
                'is_read' => true,
                'read_at' => now(),
            ]);
    }

    /**
     * Get unread notifications count.
     */
    public function unreadCount(int $userId): int
    {
        return Notification::where('user_id', $userId)
            ->where('is_read', false)
            ->count();
    }
}