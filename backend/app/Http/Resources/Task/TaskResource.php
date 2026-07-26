<?php

namespace App\Http\Resources\Task;

use App\Enums\TaskStatus;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TaskResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $subtaskCount = (int) ($this->subtasks_count ?? ($this->relationLoaded('subtasks') ? $this->subtasks->count() : 0));
        $subtasksDone = (int) ($this->subtasks_done_count
            ?? ($this->relationLoaded('subtasks') ? $this->subtasks->where('done', true)->count() : 0));
        $commentCount = (int) ($this->comments_count ?? ($this->relationLoaded('comments') ? $this->comments->count() : 0));

        $status = $this->status instanceof TaskStatus ? $this->status->value : $this->status;
        $isOverdue = $this->due_date
            && $status !== TaskStatus::Done->value
            && $this->due_date->copy()->endOfDay()->isPast();

        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
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
            'organizationId' => $this->organization_id,
            'organizationName' => $this->whenLoaded('organization', fn () => $this->organization?->name),
            'departmentId' => $this->department_id,
            'departmentName' => $this->whenLoaded('department', fn () => $this->department?->name),
            'assigneeId' => $this->assignee_id,
            'assigneeName' => $this->whenLoaded('assignee', fn () => $this->assignee?->name),
            'assigneeInitials' => $this->whenLoaded('assignee', fn () => $this->assignee?->initials),
            'assignee' => $this->whenLoaded('assignee', function () {
                if (! $this->assignee) {
                    return null;
                }

                return [
                    'id' => $this->assignee->id,
                    'name' => $this->assignee->name,
                    'avatar' => null,
                    'initials' => $this->assignee->initials,
                ];
            }),
            'createdById' => $this->created_by,
            'createdByName' => $this->whenLoaded('creator', fn () => $this->creator?->name),
            'status' => $status,
            'priority' => $this->priority?->value ?? $this->priority,
            'dueDate' => optional($this->due_date)?->toDateString(),
            'createdAt' => optional($this->created_at)?->toDateString(),
            'isOverdue' => $isOverdue,
            'subtaskCount' => $subtaskCount,
            'subtasksDone' => $subtasksDone,
            'commentCount' => $commentCount,
            'subtasks' => $this->whenLoaded('subtasks', function () {
                return $this->subtasks->map(fn ($s) => [
                    'id' => $s->id,
                    'title' => $s->title,
                    'done' => (bool) $s->done,
                ]);
            }),
            'comments' => $this->whenLoaded('comments', function () {
                return $this->comments->map(fn ($c) => [
                    'id' => $c->id,
                    'userId' => $c->user_id,
                    'userName' => $c->relationLoaded('author') ? $c->author?->name : null,
                    'initials' => $c->relationLoaded('author') ? $c->author?->initials : null,
                    'text' => $c->body,
                    'time' => optional($c->created_at)?->diffForHumans(),
                ]);
            }),
            'attachments' => [],
        ];
    }
}
