<?php

namespace App\Policies;

use App\Models\Department;
use App\Models\User;

class DepartmentPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Department $department): bool
    {
        if ($user->hasRole('Super Admin')) {
            return true;
        }

        return (int) $user->organization_id === (int) $department->organization_id;
    }

    public function create(User $user): bool
    {
        return $user->hasRole('Super Admin')
            || $user->hasAnyRole(['Organization Owner', 'Organization Admin', 'Department Manager', 'HR'])
            || $user->can('manage_departments');
    }

    public function update(User $user, Department $department): bool
    {
        if ($user->hasRole('Super Admin')) {
            return true;
        }

        if ((int) $user->organization_id !== (int) $department->organization_id) {
            return false;
        }

        if ($user->hasAnyRole(['Organization Owner', 'Organization Admin', 'HR'])) {
            return true;
        }

        if ($user->hasRole('Department Manager') && (int) $user->id === (int) $department->manager_id) {
            return true;
        }

        return $user->can('manage_departments');
    }

    public function delete(User $user, Department $department): bool
    {
        if ($user->hasRole('Super Admin')) {
            return true;
        }

        if ((int) $user->organization_id !== (int) $department->organization_id) {
            return false;
        }

        return $user->hasAnyRole(['Organization Owner', 'Organization Admin'])
            || $user->can('manage_departments');
    }

    public function viewMembers(User $user, Department $department): bool
    {
        return $this->view($user, $department);
    }

    public function viewTeams(User $user, Department $department): bool
    {
        return $this->view($user, $department);
    }

    public function viewProjects(User $user, Department $department): bool
    {
        return $this->view($user, $department);
    }
}
