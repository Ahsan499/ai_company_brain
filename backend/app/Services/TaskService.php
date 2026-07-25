<?php

namespace App\Services;

use App\Http\Resources\Task\TaskResource;
use App\Models\Task;

class TaskService
{
    /**
     * Display all tasks.
     */
    public function index()
    {
        $tasks = Task::with([
            'organization',
            'department',
            'project',
            'assignedUser'
        ])->latest()->paginate(10);

        return TaskResource::collection($tasks);
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