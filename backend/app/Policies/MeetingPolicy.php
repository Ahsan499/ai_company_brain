<?php

namespace App\Policies;

use App\Models\Meeting;
use App\Models\User;

class MeetingPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Meeting $meeting): bool
    {
        if ($user->hasRole('Super Admin')) {
            return true;
        }

        return (int) $user->organization_id === (int) $meeting->organization_id;
    }

    public function create(User $user): bool
    {
        return $user->hasRole('Super Admin')
            || $user->can('manage_meetings')
            || $user->hasAnyRole([
                'Organization Owner',
                'Organization Admin',
                'Department Manager',
                'Team Lead',
                'Employee',
                'HR',
            ]);
    }

    public function update(User $user, Meeting $meeting): bool
    {
        if ($user->hasRole('Super Admin')) {
            return true;
        }

        if ((int) $user->organization_id !== (int) $meeting->organization_id) {
            return false;
        }

        if ($user->hasAnyRole(['Organization Owner', 'Organization Admin'])) {
            return true;
        }

        if ((int) $user->id === (int) $meeting->organizer_id) {
            return true;
        }

        if ($meeting->project_id) {
            $project = $meeting->relationLoaded('project')
                ? $meeting->project
                : $meeting->project()->first();
            if ($project?->isMember($user->id)) {
                return true;
            }
        }

        if ($meeting->team_id) {
            $team = $meeting->relationLoaded('team')
                ? $meeting->team
                : $meeting->team()->first();
            if ($team?->members()->where('users.id', $user->id)->exists()) {
                return true;
            }
        }

        return $user->can('manage_meetings');
    }

    public function delete(User $user, Meeting $meeting): bool
    {
        if ($user->hasRole('Super Admin')) {
            return true;
        }

        if ((int) $user->organization_id !== (int) $meeting->organization_id) {
            return false;
        }

        return (int) $user->id === (int) $meeting->organizer_id
            || $user->hasAnyRole(['Organization Owner', 'Organization Admin'])
            || $user->can('manage_meetings');
    }

    public function updateStatus(User $user, Meeting $meeting): bool
    {
        if ($user->hasRole('Super Admin')) {
            return true;
        }

        if ((int) $user->organization_id !== (int) $meeting->organization_id) {
            return false;
        }

        return (int) $user->id === (int) $meeting->organizer_id
            || $user->hasAnyRole(['Organization Owner', 'Organization Admin'])
            || $user->can('manage_meetings');
    }

    public function manageAttendees(User $user, Meeting $meeting): bool
    {
        return $this->update($user, $meeting);
    }

    public function manageAgenda(User $user, Meeting $meeting): bool
    {
        return $this->update($user, $meeting);
    }

    public function updateRsvp(User $user, Meeting $meeting, User $attendee): bool
    {
        if ((int) $user->id !== (int) $attendee->id) {
            return false;
        }

        return $meeting->isAttendee($user->id)
            || (int) $meeting->organizer_id === (int) $user->id;
    }
}
