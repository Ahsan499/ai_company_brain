<?php

namespace App\Http\Resources\Task;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TaskResource extends JsonResource
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

            'project' => [
                'id' => $this->project->id,
                'name' => $this->project->name,
            ],

            'assigned_user' => [
                'id' => $this->assignedUser->id,
                'name' => $this->assignedUser->full_name,
                'email' => $this->assignedUser->email,
            ],

            'title' => $this->title,

            'description' => $this->description,

            'status' => $this->status,

            'priority' => $this->priority,

            'due_date' => optional($this->due_date)->format('Y-m-d'),

            'is_active' => $this->is_active,

            'created_at' => $this->created_at,

            'updated_at' => $this->updated_at,
        ];
    }
}