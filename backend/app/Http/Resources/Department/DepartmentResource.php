<?php

namespace App\Http\Resources\Department;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DepartmentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $tones = [
            ['iconTone' => 'from-[#EFF6FF] to-[#BFDBFE] text-primary', 'accent' => 'bg-primary'],
            ['iconTone' => 'from-[#F5F3FF] to-[#DDD6FE] text-violet-600', 'accent' => 'bg-violet-500'],
            ['iconTone' => 'from-[#FDF2F8] to-[#FBCFE8] text-pink-600', 'accent' => 'bg-pink-500'],
            ['iconTone' => 'from-[#ECFDF5] to-[#A7F3D0] text-emerald-600', 'accent' => 'bg-emerald-500'],
            ['iconTone' => 'from-[#FFF7ED] to-[#FED7AA] text-orange-600', 'accent' => 'bg-orange-500'],
            ['iconTone' => 'from-[#ECFEFF] to-[#A5F3FC] text-cyan-700', 'accent' => 'bg-cyan-600'],
        ];
        $tone = $tones[$this->id % count($tones)];

        return [
            'id' => $this->id,
            'name' => $this->name,
            'organizationId' => $this->organization_id,
            'organizationName' => $this->whenLoaded('organization', fn () => $this->organization?->name),
            'managerId' => $this->manager_id,
            'managerName' => $this->whenLoaded('manager', fn () => $this->manager?->name),
            'managerInitials' => $this->whenLoaded('manager', fn () => $this->manager?->initials),
            'memberIds' => $this->whenLoaded('members', fn () => $this->members->pluck('id')->values()),
            'memberCount' => $this->when(
                isset($this->members_count),
                fn () => (int) $this->members_count,
                fn () => $this->relationLoaded('members') ? $this->members->count() : null,
            ),
            'projectCount' => $this->when(
                isset($this->projects_count),
                fn () => (int) $this->projects_count,
            ),
            'activeProjectsCount' => $this->when(
                isset($this->active_projects_count),
                fn () => (int) $this->active_projects_count,
            ),
            'teamCount' => $this->when(
                isset($this->teams_count),
                fn () => (int) $this->teams_count,
            ),
            'status' => $this->status?->value ?? $this->status,
            'createdAt' => optional($this->created_at)?->toDateString(),
            'avgTenureMonths' => $this->avg_tenure_months,
            'description' => $this->description,
            'iconTone' => $tone['iconTone'],
            'accent' => $tone['accent'],
        ];
    }
}
