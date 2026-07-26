<?php

namespace App\Http\Resources\TimeEntry;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TimeEntryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'userId' => $this->user_id,
            'userName' => $this->whenLoaded('user', fn () => $this->user?->name),
            'initials' => $this->whenLoaded('user', fn () => $this->user?->initials),
            'user' => $this->whenLoaded('user', function () {
                if (! $this->user) {
                    return null;
                }

                return [
                    'id' => $this->user->id,
                    'name' => $this->user->name,
                    'initials' => $this->user->initials,
                ];
            }),
            'taskId' => $this->task_id,
            'taskTitle' => $this->whenLoaded('task', fn () => $this->task?->title),
            'task' => $this->whenLoaded('task', function () {
                if (! $this->task) {
                    return null;
                }

                return [
                    'id' => $this->task->id,
                    'title' => $this->task->title,
                ];
            }),
            'projectId' => $this->project_id,
            'projectName' => $this->whenLoaded('project', fn () => $this->project?->name),
            'project' => $this->whenLoaded('project', function () {
                if (! $this->project) {
                    return null;
                }

                return [
                    'id' => $this->project->id,
                    'name' => $this->project->name,
                ];
            }),
            'teamId' => $this->team_id,
            'teamName' => $this->whenLoaded('team', fn () => $this->team?->name),
            'team' => $this->whenLoaded('team', function () {
                if (! $this->team) {
                    return null;
                }

                return [
                    'id' => $this->team->id,
                    'name' => $this->team->name,
                ];
            }),
            'date' => optional($this->date)?->toDateString(),
            'durationMinutes' => (int) $this->duration_minutes,
            'note' => $this->note,
            'billable' => (bool) $this->billable,
        ];
    }
}
