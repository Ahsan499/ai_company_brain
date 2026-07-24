<?php

namespace App\Http\Resources\Project;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,

            'organization' => [
                'id' => $this->organization->id,
                'name' => $this->organization->name,
            ],

            'department' => [
                'id' => $this->department->id,
                'name' => $this->department->name,
            ],

            'name' => $this->name,

            'slug' => $this->slug,

            'description' => $this->description,

            'start_date' => optional($this->start_date)->format('Y-m-d'),

            'end_date' => optional($this->end_date)->format('Y-m-d'),

            'status' => $this->status,

            'is_active' => $this->is_active,

            'members' => $this->users->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->full_name,
                    'email' => $user->email,
                ];
            }),

            'created_at' => $this->created_at,

            'updated_at' => $this->updated_at,
        ];
    }
}