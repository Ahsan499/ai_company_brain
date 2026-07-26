<?php

namespace App\Policies;

use App\Models\User;

class ReportsPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasRole('Super Admin')
            || $user->can('view_reports')
            || $user->hasAnyRole([
                'Organization Owner',
                'Organization Admin',
                'Department Manager',
                'Team Lead',
                'HR',
            ]);
    }
}
