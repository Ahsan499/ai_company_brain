<?php

namespace App\Policies;

use App\Models\Project;
use App\Models\Task;
use App\Models\User;

class TaskPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Task $task): bool
    {
        if ($user->hasRole('Super Admin')) {
            return true;
        }

        return (int) $user->organization_id === (int) $task->organization_id;
    }

    public function create(User $user): bool
    {
        return $user->hasRole('Super Admin')
            || $user->can('manage_tasks')
            || $user->hasAnyRole([
                'Organization Owner',
                'Organization Admin',
                'Department Manager',
                'Team Lead',
                'Employee',
            ]);
    }

    public function update(User $user, Task $task): bool
    {
        if ($user->hasRole('Super Admin')) {
            return true;
        }

        if ((int) $user->organization_id !== (int) $task->organization_id) {
            return false;
        }

        if ($user->hasAnyRole(['Organization Owner', 'Organization Admin', 'Department Manager'])) {
            return true;
        }

        if ((int) $user->id === (int) $task->assignee_id || (int) $user->id === (int) $task->created_by) {
            return true;
        }

        $project = $task->relationLoaded('project') ? $task->project : Project::query()->find($task->project_id);

        return $project?->isMember($user->id) ?? false;
    }

    public function delete(User $user, Task $task): bool
    {
        if ($user->hasRole('Super Admin')) {
            return true;
        }

        if ((int) $user->organization_id !== (int) $task->organization_id) {
            return false;
        }

        if ($user->hasAnyRole(['Organization Owner', 'Organization Admin'])) {
            return true;
        }

        return (int) $user->id === (int) $task->created_by || $user->can('manage_tasks');
    }

    public function updateStatus(User $user, Task $task): bool
    {
        return $this->update($user, $task);
    }

    public function manageSubtasks(User $user, Task $task): bool
    {
        return $this->update($user, $task);
    }

    public function viewComments(User $user, Task $task): bool
    {
        return $this->view($user, $task);
    }

    public function createComment(User $user, Task $task): bool
    {
        return $this->view($user, $task);
    }
}
