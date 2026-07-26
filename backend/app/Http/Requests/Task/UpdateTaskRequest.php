<?php

namespace App\Http\Requests\Task;

use App\Enums\Priority;
use App\Enums\TaskStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('update', $this->route('task')) ?? false;
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
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'project_id' => ['sometimes', 'required', 'exists:projects,id'],
            'assignee_id' => ['sometimes', 'nullable', 'exists:users,id'],
            'organization_id' => ['sometimes', 'nullable', 'exists:organizations,id'],
            'department_id' => ['sometimes', 'nullable', 'exists:departments,id'],
            'description' => ['sometimes', 'nullable', 'string'],
            'status' => ['sometimes', 'nullable', Rule::enum(TaskStatus::class)],
            'priority' => ['sometimes', 'nullable', Rule::enum(Priority::class)],
            'due_date' => ['sometimes', 'nullable', 'date'],
        ];
    }
}
