<?php

namespace App\Http\Requests\Project;

use App\Enums\Priority;
use App\Enums\ProjectStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('update', $this->route('project')) ?? false;
    }

    protected function prepareForValidation(): void
    {
        $merge = [];
        foreach ([
            'organizationId' => 'organization_id',
            'departmentId' => 'department_id',
            'dueDate' => 'due_date',
            'memberIds' => 'member_ids',
            'teamIds' => 'team_ids',
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
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'organization_id' => ['sometimes', 'required', 'exists:organizations,id'],
            'department_id' => ['sometimes', 'required', 'exists:departments,id'],
            'description' => ['sometimes', 'nullable', 'string'],
            'status' => ['sometimes', 'nullable', Rule::enum(ProjectStatus::class)],
            'priority' => ['sometimes', 'nullable', Rule::enum(Priority::class)],
            'due_date' => ['sometimes', 'nullable', 'date'],
            'progress' => ['sometimes', 'nullable', 'integer', 'min:0', 'max:100'],
            'member_ids' => ['sometimes', 'nullable', 'array'],
            'member_ids.*' => ['integer', 'exists:users,id'],
            'team_ids' => ['sometimes', 'nullable', 'array'],
            'team_ids.*' => ['integer', 'exists:teams,id'],
        ];
    }
}
