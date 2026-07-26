<?php

namespace App\Policies;

use App\Models\TimeEntry;
use App\Models\User;

class TimeEntryPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, TimeEntry $entry): bool
    {
        if ($user->hasRole('Super Admin')) {
            return true;
        }

        if ((int) $user->id === (int) $entry->user_id) {
            return true;
        }

        if ($this->canViewReports($user)) {
            return (int) $user->organization_id === (int) $entry->user?->organization_id
                || (int) $user->organization_id === (int) ($entry->user()->value('organization_id'));
        }

        // Managers can view direct reports
        return (int) $entry->user?->manager_id === (int) $user->id
            || (int) ($entry->user()->value('manager_id')) === (int) $user->id;
    }

    public function create(User $user): bool
    {
        return $user->can('manage_time_tracking')
            || $user->hasRole('Super Admin')
            || $user->hasAnyRole([
                'Organization Owner',
                'Organization Admin',
                'Department Manager',
                'Team Lead',
                'Employee',
            ]);
    }

    public function update(User $user, TimeEntry $entry): bool
    {
        if ($user->hasRole('Super Admin')) {
            return true;
        }

        if ((int) $user->id === (int) $entry->user_id) {
            return true;
        }

        return $this->canViewReports($user)
            && ((int) $user->organization_id === (int) $entry->user?->organization_id
                || (int) $user->organization_id === (int) ($entry->user()->value('organization_id')));
    }

    public function delete(User $user, TimeEntry $entry): bool
    {
        return $this->update($user, $entry);
    }

    public function viewReports(User $user): bool
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

    public function canViewReports(User $user): bool
    {
        return $this->viewReports($user);
    }
}
