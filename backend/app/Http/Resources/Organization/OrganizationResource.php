<?php

namespace App\Http\Resources\Organization;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrganizationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $gradients = [
            'from-[#3B82F6] to-[#1D4ED8]',
            'from-[#0891B2] to-[#0E7490]',
            'from-[#059669] to-[#047857]',
            'from-[#D97706] to-[#B45309]',
            'from-[#DC2626] to-[#B91C1C]',
            'from-[#7C3AED] to-[#5B21B6]',
        ];

        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'industry' => $this->industry,
            'size' => $this->size,
            'memberCount' => $this->when(
                isset($this->users_count),
                fn () => (int) $this->users_count,
                fn () => $this->relationLoaded('users') ? $this->users->count() : null,
            ),
            'departmentCount' => $this->when(
                isset($this->departments_count),
                fn () => (int) $this->departments_count,
                fn () => $this->relationLoaded('departments') ? $this->departments->count() : null,
            ),
            'departmentsCount' => $this->when(
                isset($this->departments_count),
                fn () => (int) $this->departments_count,
                fn () => $this->relationLoaded('departments') ? $this->departments->count() : null,
            ),
            'projectCount' => $this->when(
                isset($this->projects_count),
                fn () => (int) $this->projects_count,
                fn () => $this->relationLoaded('projects') ? $this->projects->count() : null,
            ),
            'activeProjectsCount' => $this->when(
                isset($this->active_projects_count),
                fn () => (int) $this->active_projects_count,
            ),
            'plan' => $this->plan?->value ?? $this->plan,
            'status' => $this->status?->value ?? $this->status,
            'createdAt' => optional($this->created_at)?->toDateString(),
            'owner' => $this->whenLoaded('owner', fn () => $this->owner?->name),
            'ownerEmail' => $this->whenLoaded('owner', fn () => $this->owner?->email),
            'ownerId' => $this->owner_id,
            'location' => $this->location,
            'website' => $this->website,
            'description' => $this->description,
            'initials' => $this->initials,
            'logo' => $this->logo,
            'gradient' => $gradients[$this->id % count($gradients)],
            'members' => $this->whenLoaded('users', function () {
                return $this->users->map(fn ($user) => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->getRoleNames()->first(),
                    'department' => $user->department?->name,
                    'status' => $user->status?->value ?? $user->status,
                    'initials' => $user->initials,
                ]);
            }),
            'activity' => [],
        ];
    }
}
