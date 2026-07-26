<?php

namespace App\Http\Resources\Auth;

use App\Support\RoleLabel;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $spatieRole = $this->getRoleNames()->first();

        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'initials' => $this->initials,
            'phone' => $this->phone,
            'location' => $this->location,
            'status' => $this->status?->value ?? $this->status,
            'role' => RoleLabel::toFrontend($spatieRole),
            'permissions' => $this->getAllPermissions()->pluck('name')->values(),
            'organizationId' => $this->organization_id,
            'organizationName' => $this->whenLoaded('organization', fn () => $this->organization?->name),
            'departmentId' => $this->department_id,
            'department' => $this->whenLoaded('department', fn () => $this->department?->name),
            'joinedAt' => optional($this->created_at)?->toDateString(),
            'lastLogin' => optional($this->last_login_at)?->toIso8601String(),
            'emailVerifiedAt' => optional($this->email_verified_at)?->toIso8601String(),
        ];
    }
}
