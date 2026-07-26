<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, User $model): bool
    {
        if ($user->hasRole('Super Admin') || $user->id === $model->id) {
            return true;
        }

        if ($user->can('manage_users')) {
            return (int) $user->organization_id === (int) $model->organization_id;
        }

        return (int) $user->organization_id === (int) $model->organization_id;
    }

    public function create(User $user): bool
    {
        return $user->can('manage_users') || $user->hasRole('Super Admin');
    }

    public function update(User $user, User $model): bool
    {
        if ($user->hasRole('Super Admin')) {
            return true;
        }

        if ($user->id === $model->id) {
            return true;
        }

        if (! $user->can('manage_users')) {
            return false;
        }

        return (int) $user->organization_id === (int) $model->organization_id;
    }

    public function delete(User $user, User $model): bool
    {
        if ($user->id === $model->id) {
            return false;
        }

        if ($user->hasRole('Super Admin')) {
            return true;
        }

        if (! $user->can('manage_users')) {
            return false;
        }

        return (int) $user->organization_id === (int) $model->organization_id;
    }

    public function viewTasks(User $user, User $model): bool
    {
        return $this->view($user, $model);
    }

    public function viewProjects(User $user, User $model): bool
    {
        return $this->view($user, $model);
    }
}
