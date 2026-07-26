<?php

namespace App\Policies;

use App\Models\Team;
use App\Models\User;

class TeamPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Team $team): bool
    {
        if ($user->hasRole('Super Admin')) {
            return true;
        }

        return (int) $user->organization_id === (int) $team->organization_id;
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
            || $user->can('manage_teams');
    }

    public function update(User $user, Team $team): bool
    {
        if ($user->hasRole('Super Admin')) {
            return true;
        }

        if ((int) $user->organization_id !== (int) $team->organization_id) {
            return false;
        }

        if ($user->hasAnyRole(['Organization Owner', 'Organization Admin'])) {
            return true;
        }

        if ($user->hasRole('Department Manager')
            && (int) $user->department_id === (int) $team->department_id) {
            return true;
        }

        if ($user->hasRole('Team Lead') && (int) $user->id === (int) $team->team_lead_id) {
            return true;
        }

        return $user->can('manage_teams');
    }

    public function delete(User $user, Team $team): bool
    {
        if ($user->hasRole('Super Admin')) {
            return true;
        }

        if ((int) $user->organization_id !== (int) $team->organization_id) {
            return false;
        }

        if ($user->hasAnyRole(['Organization Owner', 'Organization Admin'])) {
            return true;
        }

        if ($user->hasRole('Department Manager')
            && (int) $user->department_id === (int) $team->department_id) {
            return true;
        }

        return false;
    }

    public function viewMembers(User $user, Team $team): bool
    {
        return $this->view($user, $team);
    }

    public function manageMembers(User $user, Team $team): bool
    {
        return $this->update($user, $team);
    }

    public function viewProjects(User $user, Team $team): bool
    {
        return $this->view($user, $team);
    }
}
