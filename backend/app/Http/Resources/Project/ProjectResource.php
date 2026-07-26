<?php

namespace App\Http\Resources\Project;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $tasksTotal = (int) ($this->tasks_count ?? ($this->relationLoaded('tasks') ? $this->tasks->count() : 0));
        $tasksDone = (int) ($this->tasks_done_count ?? 0);
        $tasksInProgress = (int) ($this->tasks_in_progress_count ?? 0);
        $tasksOverdue = (int) ($this->tasks_overdue_count ?? 0);

        $computedProgress = $tasksTotal > 0
            ? (int) round(($tasksDone / $tasksTotal) * 100)
            : (int) $this->progress;

        return [
            'id' => $this->id,
            'name' => $this->name,
            'organizationId' => $this->organization_id,
            'organizationName' => $this->whenLoaded('organization', fn () => $this->organization?->name),
            'organization' => $this->whenLoaded('organization', function () {
                if (! $this->organization) {
                    return null;
                }

                return [
                    'id' => $this->organization->id,
                    'name' => $this->organization->name,
                ];
            }),
            'departmentId' => $this->department_id,
            'departmentName' => $this->whenLoaded('department', fn () => $this->department?->name),
            'department' => $this->whenLoaded('department', function () {
                if (! $this->department) {
                    return null;
                }

                return [
                    'id' => $this->department->id,
                    'name' => $this->department->name,
                ];
            }),
            'status' => $this->status?->value ?? $this->status,
            'priority' => $this->priority?->value ?? $this->priority,
            'progress' => $computedProgress,
            'dueDate' => optional($this->due_date)?->toDateString(),
            'createdAt' => optional($this->created_at)?->toDateString(),
            'description' => $this->description,
            'memberCount' => $this->when(
                isset($this->members_count),
                fn () => (int) $this->members_count,
                fn () => $this->relationLoaded('members') ? $this->members->count() : null,
            ),
            'members' => $this->whenLoaded('members', function () {
                return $this->members->map(fn ($user) => [
                    'userId' => $user->id,
                    'projectRole' => $user->pivot->role_in_project,
                    'roleInProject' => $user->pivot->role_in_project,
                    'initials' => $user->initials,
                    'name' => $user->name,
                ]);
            }),
            'taskCounts' => [
                'total' => $tasksTotal,
                'done' => $tasksDone,
                'inProgress' => $tasksInProgress,
                'overdue' => $tasksOverdue,
            ],
            'tasksDone' => $tasksDone,
            'tasksTotal' => $tasksTotal,
            'totalHoursLogged' => $this->when(
                isset($this->time_entries_sum_duration_minutes),
                fn () => round(((int) $this->time_entries_sum_duration_minutes) / 60, 2),
            ),
            'milestones' => $this->whenLoaded('milestones', function () {
                return $this->milestones->map(fn ($m) => [
                    'id' => $m->id,
                    'title' => $m->title,
                    'dueDate' => optional($m->due_date)?->toDateString(),
                    'done' => (bool) $m->done,
                ]);
            }),
            'activity' => [],
        ];
    }
}
