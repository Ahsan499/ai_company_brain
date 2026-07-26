<?php

namespace App\Http\Resources\Task;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TaskCommentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'taskId' => $this->task_id,
            'userId' => $this->user_id,
            'userName' => $this->whenLoaded('author', fn () => $this->author?->name),
            'initials' => $this->whenLoaded('author', fn () => $this->author?->initials),
            'text' => $this->body,
            'body' => $this->body,
            'time' => optional($this->created_at)?->diffForHumans(),
            'createdAt' => optional($this->created_at)?->toIso8601String(),
            'author' => $this->whenLoaded('author', function () {
                if (! $this->author) {
                    return null;
                }

                return [
                    'id' => $this->author->id,
                    'name' => $this->author->name,
                    'initials' => $this->author->initials,
                    'avatar' => null,
                ];
            }),
        ];
    }
}
