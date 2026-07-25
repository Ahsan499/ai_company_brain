<?php

namespace App\Http\Resources\Team;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TeamResource extends JsonResource
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

            'is_active' => $this->is_active,

            'users' => $this->users->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->full_name,
                    'email' => $user->email,
                ];
            }),

            'projects' => $this->projects->map(function ($project) {
                return [
                    'id' => $project->id,
                    'name' => $project->name,
                ];
            }),

            'created_at' => $this->created_at,

            'updated_at' => $this->updated_at,
        ];
    }
}