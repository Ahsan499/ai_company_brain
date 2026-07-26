<?php

namespace App\Http\Requests\Task;

use App\Enums\Priority;
use App\Enums\TaskStatus;
use App\Models\Task;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', Task::class) ?? false;
    }

    protected function prepareForValidation(): void
    {
        $merge = [];
        foreach ([
            'projectId' => 'project_id',
            'assigneeId' => 'assignee_id',
            'organizationId' => 'organization_id',
            'departmentId' => 'department_id',
            'dueDate' => 'due_date',
        ] as $camel => $snake) {
            if ($this->has($camel)) {
                $merge[$snake] = $this->input($camel);
            }
        }
        if ($merge) {
            $this->merge($merge);
        }
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'project_id' => ['required', 'exists:projects,id'],
            'assignee_id' => ['nullable', 'exists:users,id'],
            'organization_id' => ['nullable', 'exists:organizations,id'],
            'department_id' => ['nullable', 'exists:departments,id'],
            'description' => ['nullable', 'string'],
            'status' => ['nullable', Rule::enum(TaskStatus::class)],
            'priority' => ['nullable', Rule::enum(Priority::class)],
            'due_date' => ['nullable', 'date'],
        ];
    }
}
