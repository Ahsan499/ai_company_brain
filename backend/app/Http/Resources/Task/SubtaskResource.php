<?php

namespace App\Http\Resources\Task;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SubtaskResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'taskId' => $this->task_id,
            'title' => $this->title,
            'done' => (bool) $this->done,
            'sortOrder' => $this->sort_order,
        ];
    }
}
