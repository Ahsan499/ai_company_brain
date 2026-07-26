<?php

namespace App\Http\Resources\User;

use App\Support\RoleLabel;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $spatieRole = $this->getRoleNames()->first();
        $team = $this->relationLoaded('teams') ? $this->teams->first() : null;
        $teamLeadId = $request->attributes->get('team_lead_id');

        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'initials' => $this->initials,
            'role' => RoleLabel::toFrontend($spatieRole),
            'permissions' => $this->when(
                $request->user()?->id === $this->id || $request->routeIs('auth.*'),
                fn () => $this->getAllPermissions()->pluck('name')->values(),
            ),
            'department' => $this->when(
                $this->relationLoaded('department'),
                function () {
                    if (! $this->department) {
                        return null;
                    }

                    return [
                        'id' => $this->department->id,
                        'name' => $this->department->name,
                    ];
                }
            ),
            'departmentId' => $this->department_id,
            'departmentName' => $this->whenLoaded('department', fn () => $this->department?->name),
            'team' => $this->when($this->relationLoaded('teams'), function () use ($team) {
                if (! $team) {
                    return null;
                }

                return [
                    'id' => $team->id,
                    'name' => $team->name,
                ];
            }),
            'teamName' => $team?->name,
            'isTeamLead' => $this->when(
                $teamLeadId !== null,
                fn () => (int) $this->id === (int) $teamLeadId,
            ),
            'organizationId' => $this->organization_id,
            'organizationName' => $this->whenLoaded('organization', fn () => $this->organization?->name),
            'status' => $this->status?->value ?? $this->status,
            'joinedAt' => optional($this->created_at)?->toDateString(),
            'lastActive' => optional($this->last_login_at)?->diffForHumans(),
            'lastLogin' => optional($this->last_login_at)?->toIso8601String(),
            'manager' => $this->whenLoaded('manager', fn () => $this->manager?->name),
            'managerId' => $this->manager_id,
            'phone' => $this->phone,
            'location' => $this->location,
            'tasksAssigned' => $this->when(
                isset($this->assigned_tasks_count),
                fn () => (int) $this->assigned_tasks_count,
            ),
            'projects' => $this->when(
                isset($this->projects_count),
                fn () => (int) $this->projects_count,
            ),
            'hoursThisWeek' => $this->when(
                array_key_exists('hours_this_week', $this->resource->getAttributes()),
                fn () => (float) $this->hours_this_week,
            ),
            'activity' => [],
        ];
    }
}
