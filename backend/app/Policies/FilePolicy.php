<?php

namespace App\Policies;

use App\Models\File;
use App\Models\User;

class FilePolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, File $file): bool
    {
        if ($user->hasRole('Super Admin')) {
            return true;
        }

        return (int) $user->organization_id === (int) $file->organization_id;
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

    public function update(User $user, File $file): bool
    {
        if ($user->hasRole('Super Admin')) {
            return true;
        }

        if ((int) $user->organization_id !== (int) $file->organization_id) {
            return false;
        }

        return (int) $user->id === (int) $file->uploaded_by
            || $user->can('manage_files')
            || $user->hasAnyRole(['Organization Owner', 'Organization Admin']);
    }

    public function delete(User $user, File $file): bool
    {
        return $this->update($user, $file);
    }

    public function download(User $user, File $file): bool
    {
        return $this->view($user, $file);
    }

    public function comment(User $user, File $file): bool
    {
        return $this->view($user, $file);
    }
}
