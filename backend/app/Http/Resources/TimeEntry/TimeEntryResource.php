<?php

namespace App\Http\Resources\TimeEntry;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TimeEntryResource extends JsonResource
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

            'project' => [
                'id' => $this->project->id,
                'name' => $this->project->name,
            ],

            'task' => [
                'id' => $this->task->id,
                'title' => $this->task->title,
            ],

            'user' => [
                'id' => $this->user->id,
                'name' => $this->user->full_name,
                'email' => $this->user->email,
            ],

            'description' => $this->description,

            'start_time' => optional($this->start_time)->format('Y-m-d H:i:s'),

            'end_time' => optional($this->end_time)->format('Y-m-d H:i:s'),

            'duration' => $this->duration,

            'duration_text' => floor($this->duration / 60) . 'h ' . ($this->duration % 60) . 'm',

            'is_active' => $this->is_active,

            'created_at' => $this->created_at,

            'updated_at' => $this->updated_at,

        ];
    }
}