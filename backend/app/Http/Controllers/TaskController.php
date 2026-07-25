<?php

namespace App\Http\Controllers;

use App\Http\Requests\Task\StoreTaskRequest;
use App\Http\Requests\Task\UpdateTaskRequest;
use App\Services\TaskService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    use ApiResponse;

    protected TaskService $taskService;

    public function __construct(TaskService $taskService)
    {
        $this->taskService = $taskService;
    }

    /**
     * Display all tasks.
     */
    // public function index(): JsonResponse
    // {
    //     $tasks = $this->taskService->index();

    //     return $this->successResponse(
    //         $tasks,
    //         'Tasks retrieved successfully.'
    //     );
    // }
    public function index(Request $request): JsonResponse
{
    return $this->successResponse(
        $this->taskService->index($request),
        'Tasks retrieved successfully.'
    );
}

    /**
     * Store a newly created task.
     */
    public function store(StoreTaskRequest $request): JsonResponse
    {
        $task = $this->taskService->store(
            $request->validated()
        );

        return $this->successResponse(
            $task,
            'Task created successfully.',
            201
        );
    }

    /**
     * Display the specified task.
     */
    public function show(int $id): JsonResponse
    {
        $task = $this->taskService->show($id);

        return $this->successResponse(
            $task,
            'Task retrieved successfully.'
        );
    }

    /**
     * Update the specified task.
     */
    public function update(UpdateTaskRequest $request, int $id): JsonResponse
    {
        $task = $this->taskService->update(
            $id,
            $request->validated()
        );

        return $this->successResponse(
            $task,
            'Task updated successfully.'
        );
    }

    /**
     * Remove the specified task.
     */
    public function destroy(int $id): JsonResponse
    {
        $this->taskService->destroy($id);

        return $this->successResponse(
            [],
            'Task deleted successfully.'
        );
    }
}