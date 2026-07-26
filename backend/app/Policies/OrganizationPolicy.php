<?php

namespace App\Policies;

use App\Models\Organization;
use App\Models\User;

class OrganizationPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Organization $organization): bool
    {
        if ($user->hasRole('Super Admin')) {
            return true;
        }

        return (int) $user->organization_id === (int) $organization->id;
    }

    public function create(User $user): bool
    {
        return $user->can('manage_organizations')
            || $user->hasRole('Super Admin');
    }

    public function update(User $user, Organization $organization): bool
    {
        if ($user->hasRole('Super Admin')) {
            return true;
        }

        if (! $user->can('manage_organizations')) {
            return false;
        }

        return (int) $user->organization_id === (int) $organization->id;
    }

    public function delete(User $user, Organization $organization): bool
    {
        // Super Admin or Org Admin (Organization Admin) with manage_organizations
        if ($user->hasRole('Super Admin')) {
            return true;
        }

        if (! $user->hasAnyRole(['Organization Admin', 'Organization Owner'])) {
            return false;
        }

        return $user->can('manage_organizations')
            && (int) $user->organization_id === (int) $organization->id;
    }
}
