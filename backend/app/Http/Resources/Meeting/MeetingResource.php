<?php

namespace App\Http\Resources\Meeting;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MeetingResource extends JsonResource
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

            'team' => [
                'id' => $this->team->id,
                'name' => $this->team->name,
            ],

            'title' => $this->title,

            'description' => $this->description,

            'meeting_date' => optional($this->meeting_date)->format('Y-m-d'),

            'start_time' => $this->start_time,

            'end_time' => $this->end_time,

            'location' => $this->location,

            'status' => $this->status,

            'is_active' => $this->is_active,

            'created_at' => $this->created_at,

            'updated_at' => $this->updated_at,

        ];
    }
}