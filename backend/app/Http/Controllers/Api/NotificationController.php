<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Notifications\DatabaseNotification;

class NotificationController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $perPage = min(max((int) $request->integer('per_page', 20), 1), 100);

        $paginator = $request->user()
            ->notifications()
            ->paginate($perPage);

        $items = collect($paginator->items())->map(fn (DatabaseNotification $n) => $this->transform($n));

        return response()->json([
            'success' => true,
            'message' => 'Notifications retrieved successfully.',
            'data' => $items->values(),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
                'from' => $paginator->firstItem(),
                'to' => $paginator->lastItem(),
            ],
        ]);
    }

    public function unreadCount(Request $request): JsonResponse
    {
        return $this->successResponse(
            ['unread_count' => $request->user()->unreadNotifications()->count()],
            'Unread notification count retrieved successfully.'
        );
    }

    public function markAsRead(Request $request, string $id): JsonResponse
    {
        $notification = $request->user()
            ->notifications()
            ->where('id', $id)
            ->firstOrFail();

        $notification->markAsRead();

        return $this->successResponse(
            $this->transform($notification->fresh()),
            'Notification marked as read.'
        );
    }

    public function markAllAsRead(Request $request): JsonResponse
    {
        $request->user()->unreadNotifications->markAsRead();

        return $this->successResponse(
            ['updated' => true],
            'All notifications marked as read.'
        );
    }

    protected function transform(DatabaseNotification $notification): array
    {
        $data = is_array($notification->data) ? $notification->data : [];

        return [
            'id' => $notification->id,
            'type' => class_basename($notification->type),
            'category' => $data['category'] ?? 'system',
            'event' => $data['event'] ?? null,
            'title' => $data['title'] ?? 'Notification',
            'description' => $data['description'] ?? '',
            'url' => $data['url'] ?? null,
            'avatar' => $data['avatar'] ?? 'SY',
            'unread' => $notification->read_at === null,
            'read_at' => $notification->read_at,
            'created_at' => $notification->created_at,
            'data' => $data,
        ];
    }
}
