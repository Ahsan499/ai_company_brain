<?php

namespace App\Services;

use App\Http\Resources\Task\TaskResource;
use App\Models\Task;
use Illuminate\Http\Request;

class TaskService
{
    protected SearchService $searchService;

    public function __construct(SearchService $searchService)
    {
        $this->searchService = $searchService;
    }

    /**
     * Display all tasks.
     */
    public function index(Request $request)
    {
        $query = Task::with([
            'organization',
            'department',
            'project',
            'assignedUser'
        ]);

        return TaskResource::collection(
            $this->searchService->apply($query, $request)
        );
    }

    /**
     * Store a newly created task.
     */
    public function store(array $data)
    {
        $task = Task::create($data);

        $task->load([
            'organization',
            'department',
            'project',
            'assignedUser'
        ]);

        return new TaskResource($task);
    }

    /**
     * Display the specified task.
     */
    public function show(int $id)
    {
        $task = Task::with([
            'organization',
            'department',
            'project',
            'assignedUser'
        ])->findOrFail($id);

        return new TaskResource($task);
    }

    /**
     * Update the specified task.
     */
    public function update(int $id, array $data)
    {
        $task = Task::findOrFail($id);

        $task->update($data);

        $task->load([
            'organization',
            'department',
            'project',
            'assignedUser'
        ]);

        return new TaskResource($task);
    }

    /**
     * Remove the specified task.
     */
    public function destroy(int $id): bool
    {
        $task = Task::findOrFail($id);

        $task->delete();

        return true;
    }
}