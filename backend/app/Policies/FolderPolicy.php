<?php

namespace App\Policies;

use App\Models\Folder;
use App\Models\User;

class FolderPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Folder $folder): bool
    {
        if ($user->hasRole('Super Admin')) {
            return true;
        }

        return (int) $user->organization_id === (int) $folder->organization_id;
    }

    public function create(User $user): bool
    {
        return $user->hasRole('Super Admin')
            || $user->can('manage_files')
            || $user->hasAnyRole([
                'Organization Owner',
                'Organization Admin',
                'Department Manager',
                'Team Lead',
                'Employee',
            ]);
    }

    public function update(User $user, Folder $folder): bool
    {
        if ($user->hasRole('Super Admin')) {
            return true;
        }

        if ((int) $user->organization_id !== (int) $folder->organization_id) {
            return false;
        }

        return (int) $user->id === (int) $folder->created_by
            || $user->can('manage_files')
            || $user->hasAnyRole(['Organization Owner', 'Organization Admin']);
    }

    public function delete(User $user, Folder $folder): bool
    {
        return $this->update($user, $folder);
    }
}
