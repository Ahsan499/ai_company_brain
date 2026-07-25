<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Notification\StoreNotificationRequest;
use App\Http\Requests\Notification\UpdateNotificationRequest;
use App\Services\NotificationService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class NotificationController extends Controller
{
    use ApiResponse;

    protected NotificationService $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    public function index(): JsonResponse
    {
        return $this->successResponse(
            $this->notificationService->index(),
            'Notifications retrieved successfully.'
        );
    }

    public function store(StoreNotificationRequest $request): JsonResponse
    {
        return $this->successResponse(
            $this->notificationService->store($request->validated()),
            'Notification created successfully.',
            201
        );
    }

    public function show(int $id): JsonResponse
    {
        return $this->successResponse(
            $this->notificationService->show($id),
            'Notification retrieved successfully.'
        );
    }

    public function update(UpdateNotificationRequest $request, int $id): JsonResponse
    {
        return $this->successResponse(
            $this->notificationService->update($id, $request->validated()),
            'Notification updated successfully.'
        );
    }

    public function destroy(int $id): JsonResponse
    {
        $this->notificationService->destroy($id);

        return $this->successResponse(
            [],
            'Notification deleted successfully.'
        );
    }

    /**
     * Mark one notification as read.
     */
    public function markAsRead(int $id): JsonResponse
    {
        return $this->successResponse(
            $this->notificationService->markAsRead($id),
            'Notification marked as read.'
        );
    }

    /**
     * Mark all notifications as read.
     */
    public function markAllAsRead(int $userId): JsonResponse
    {
        $count = $this->notificationService->markAllAsRead($userId);

        return $this->successResponse(
            ['updated' => $count],
            'All notifications marked as read.'
        );
    }

    /**
     * Get unread notifications count.
     */
    public function unreadCount(int $userId): JsonResponse
    {
        return $this->successResponse(
            [
                'unread_count' => $this->notificationService->unreadCount($userId)
            ],
            'Unread notification count retrieved successfully.'
        );
    }
}