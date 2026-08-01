<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Task\StoreSubtaskRequest;
use App\Http\Requests\Task\StoreTaskCommentRequest;
use App\Http\Requests\Task\StoreTaskRequest;
use App\Http\Requests\Task\UpdateSubtaskRequest;
use App\Http\Requests\Task\UpdateTaskRequest;
use App\Http\Requests\Task\UpdateTaskStatusRequest;
use App\Http\Resources\File\FileResource;
use App\Http\Resources\Task\SubtaskResource;
use App\Http\Resources\Task\TaskCommentResource;
use App\Http\Resources\Task\TaskResource;
use App\Models\Subtask;
use App\Models\Task;
use App\Models\TaskComment;
use App\Services\FileService;
use App\Services\TaskService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    use ApiResponse;

    public function __construct(protected TaskService $taskService) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Task::class);

        $tasks = $this->taskService->index($request, $request->user());

        return TaskResource::collection($tasks)
            ->additional([
                'success' => true,
                'message' => 'Tasks retrieved successfully.',
            ])
            ->response();
    }

    public function store(StoreTaskRequest $request): JsonResponse
    {
        $task = $this->taskService->store($request->validated(), $request->user());

        return $this->successResponse(
            new TaskResource($task),
            'Task created successfully.',
            201
        );
    }

    public function show(Task $task): JsonResponse
    {
        $this->authorize('view', $task);

        $task = $this->taskService->show($task);

        return $this->successResponse(
            new TaskResource($task),
            'Task retrieved successfully.'
        );
    }

    public function update(UpdateTaskRequest $request, Task $task): JsonResponse
    {
        $task = $this->taskService->update($task, $request->validated(), $request->user());

        return $this->successResponse(
            new TaskResource($task),
            'Task updated successfully.'
        );
    }

    public function destroy(Task $task): JsonResponse
    {
        $this->authorize('delete', $task);

        $this->taskService->destroy($task);

        return $this->successResponse(null, 'Task deleted successfully.');
    }

    public function updateStatus(UpdateTaskStatusRequest $request, Task $task): JsonResponse
    {
        $task = $this->taskService->updateStatus(
            $task,
            $request->validated('status'),
            $request->user()
        );

        return $this->successResponse(
            new TaskResource($task),
            'Task status updated successfully.'
        );
    }

    public function subtasks(Task $task): JsonResponse
    {
        $this->authorize('view', $task);

        $subtasks = $task->subtasks()->orderBy('sort_order')->get();

        return $this->successResponse(
            SubtaskResource::collection($subtasks),
            'Subtasks retrieved successfully.'
        );
    }

    public function storeSubtask(StoreSubtaskRequest $request, Task $task): JsonResponse
    {
        $subtask = $this->taskService->createSubtask($task, $request->validated());

        return $this->successResponse(
            new SubtaskResource($subtask),
            'Subtask created successfully.',
            201
        );
    }

    public function updateSubtask(UpdateSubtaskRequest $request, Task $task, Subtask $subtask): JsonResponse
    {
        $subtask = $this->taskService->updateSubtask($task, $subtask, $request->validated());

        return $this->successResponse(
            new SubtaskResource($subtask),
            'Subtask updated successfully.'
        );
    }

    public function destroySubtask(Task $task, Subtask $subtask): JsonResponse
    {
        $this->authorize('manageSubtasks', $task);

        $this->taskService->deleteSubtask($task, $subtask);

        return $this->successResponse(null, 'Subtask deleted successfully.');
    }

    public function comments(Request $request, Task $task): JsonResponse
    {
        $this->authorize('viewComments', $task);

        $perPage = min(max((int) $request->integer('per_page', 20), 1), 100);

        $comments = $task->comments()
            ->with('author')
            ->latest('id')
            ->paginate($perPage);

        return TaskCommentResource::collection($comments)
            ->additional([
                'success' => true,
                'message' => 'Comments retrieved successfully.',
            ])
            ->response();
    }

    public function storeComment(StoreTaskCommentRequest $request, Task $task): JsonResponse
    {
        $comment = $this->taskService->createComment($task, $request->user(), $request->validated());

        return $this->successResponse(
            new TaskCommentResource($comment),
            'Comment created successfully.',
            201
        );
    }

    public function destroyComment(Task $task, TaskComment $comment): JsonResponse
    {
        abort_unless((int) $comment->task_id === (int) $task->id, 404);

        $this->authorize('delete', $comment);

        $this->taskService->deleteComment($task, $comment);

        return $this->successResponse(null, 'Comment deleted successfully.');
    }

    public function timeSummary(Task $task): JsonResponse
    {
        $this->authorize('view', $task);

        $summary = app(\App\Services\TimeEntryService::class)->taskSummary($task);

        return $this->successResponse($summary, 'Task time summary retrieved successfully.');
    }

    public function files(Request $request, Task $task): JsonResponse
    {
        $this->authorize('view', $task);

        $files = app(FileService::class)->forTask($task, $request);

        return FileResource::collection($files)
            ->additional([
                'success' => true,
                'message' => 'Task files retrieved successfully.',
            ])
            ->response();
    }
}
