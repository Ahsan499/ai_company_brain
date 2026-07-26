<?php

namespace App\Http\Resources\Team;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TeamResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $tones = [
            ['iconTone' => 'from-[#EFF6FF] to-[#BFDBFE] text-primary', 'color' => '#2563EB'],
            ['iconTone' => 'from-[#ECFEFF] to-[#A5F3FC] text-cyan-700', 'color' => '#0891B2'],
            ['iconTone' => 'from-[#F5F3FF] to-[#DDD6FE] text-violet-700', 'color' => '#7C3AED'],
            ['iconTone' => 'from-[#FFF7ED] to-[#FED7AA] text-amber-700', 'color' => '#D97706'],
            ['iconTone' => 'from-[#FDF2F8] to-[#FBCFE8] text-pink-700', 'color' => '#DB2777'],
            ['iconTone' => 'from-[#ECFDF5] to-[#A7F3D0] text-emerald-700', 'color' => '#059669'],
        ];
        $tone = $tones[$this->id % count($tones)];

        return [
            'id' => $this->id,
            'name' => $this->name,
            'organizationId' => $this->organization_id,
            'organizationName' => $this->whenLoaded('organization', fn () => $this->organization?->name),
            'departmentId' => $this->department_id,
            'departmentName' => $this->whenLoaded('department', fn () => $this->department?->name),
            'leadId' => $this->team_lead_id,
            'leadName' => $this->whenLoaded('lead', fn () => $this->lead?->name),
            'leadInitials' => $this->whenLoaded('lead', fn () => $this->lead?->initials),
            'memberIds' => $this->whenLoaded('members', fn () => $this->members->pluck('id')->values()),
            'memberCount' => $this->when(
                isset($this->members_count),
                fn () => (int) $this->members_count,
                fn () => $this->relationLoaded('members') ? $this->members->count() : null,
            ),
            'projectIds' => $this->whenLoaded('projects', fn () => $this->projects->pluck('id')->values()),
            'projectCount' => $this->when(
                isset($this->projects_count),
                fn () => (int) $this->projects_count,
            ),
            'description' => $this->description,
            'createdAt' => optional($this->created_at)?->toDateString(),
            'status' => $this->status?->value ?? $this->status,
            'iconTone' => $tone['iconTone'],
            'color' => $this->color ?: $tone['color'],
        ];
    }
}
