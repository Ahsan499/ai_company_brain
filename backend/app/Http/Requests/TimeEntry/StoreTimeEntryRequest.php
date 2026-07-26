<?php

namespace App\Http\Requests\TimeEntry;

use App\Models\TimeEntry;
use Illuminate\Foundation\Http\FormRequest;

class StoreTimeEntryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', TimeEntry::class) ?? false;
    }

    protected function prepareForValidation(): void
    {
        $merge = [];
        foreach ([
            'userId' => 'user_id',
            'taskId' => 'task_id',
            'projectId' => 'project_id',
            'teamId' => 'team_id',
            'durationMinutes' => 'duration_minutes',
        ] as $camel => $snake) {
            if ($this->has($camel)) {
                $merge[$snake] = $this->input($camel);
            }
        }

        if (! isset($merge['duration_minutes']) && ($this->has('hours') || $this->has('minutes'))) {
            $hours = (int) $this->input('hours', 0);
            $minutes = (int) $this->input('minutes', 0);
            $merge['duration_minutes'] = ($hours * 60) + $minutes;
        }

        if ($merge) {
            $this->merge($merge);
        }
    }

    public function rules(): array
    {
        return [
            'user_id' => ['nullable', 'exists:users,id'],
            'task_id' => ['nullable', 'exists:tasks,id'],
            'project_id' => ['nullable', 'exists:projects,id'],
            'team_id' => ['nullable', 'exists:teams,id'],
            'date' => ['required', 'date'],
            'duration_minutes' => ['required', 'integer', 'min:1', 'max:1440'],
            'note' => ['nullable', 'string'],
            'billable' => ['nullable', 'boolean'],
        ];
    }
}
