<?php

namespace App\Policies;

use App\Models\Project;
use App\Models\User;

class ProjectPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Project $project): bool
    {
        if ($user->hasRole('Super Admin')) {
            return true;
        }

        return (int) $user->organization_id === (int) $project->organization_id;
    }

    public function create(User $user): bool
    {
        return $user->hasRole('Super Admin')
            || $user->hasAnyRole([
                'Organization Owner',
                'Organization Admin',
                'Department Manager',
                'Team Lead',
            ])
            || $user->can('manage_projects');
    }

    public function update(User $user, Project $project): bool
    {
        if ($user->hasRole('Super Admin')) {
            return true;
        }

        if ((int) $user->organization_id !== (int) $project->organization_id) {
            return false;
        }

        if ($user->hasAnyRole(['Organization Owner', 'Organization Admin'])) {
            return true;
        }

        if ($user->hasRole('Department Manager')
            && (int) $user->department_id === (int) $project->department_id) {
            return true;
        }

        if ($project->isMember($user->id)) {
            return true;
        }

        return $user->can('manage_projects');
    }

    public function delete(User $user, Project $project): bool
    {
        if ($user->hasRole('Super Admin')) {
            return true;
        }

        if ((int) $user->organization_id !== (int) $project->organization_id) {
            return false;
        }

        return $user->hasAnyRole(['Organization Owner', 'Organization Admin'])
            || $user->can('delete_projects')
            || $user->can('manage_projects');
    }

    public function manageMembers(User $user, Project $project): bool
    {
        return $this->update($user, $project);
    }

    public function viewMembers(User $user, Project $project): bool
    {
        return $this->view($user, $project);
    }

    public function viewTasks(User $user, Project $project): bool
    {
        return $this->view($user, $project);
    }

    public function viewTeams(User $user, Project $project): bool
    {
        return $this->view($user, $project);
    }

    public function viewFiles(User $user, Project $project): bool
    {
        return $this->view($user, $project);
    }
}
