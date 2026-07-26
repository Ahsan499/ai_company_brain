<?php

namespace App\Http\Requests\Team;

use App\Enums\TeamStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTeamRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('update', $this->route('team')) ?? false;
    }

    protected function prepareForValidation(): void
    {
        $merge = [];
        foreach ([
            'organizationId' => 'organization_id',
            'departmentId' => 'department_id',
            'leadId' => 'team_lead_id',
            'memberIds' => 'member_ids',
            'projectIds' => 'project_ids',
        ] as $camel => $snake) {
            if ($this->has($camel)) {
                $merge[$snake] = $this->input($camel);
            }
        }
        if ($this->has('teamLeadId') && ! isset($merge['team_lead_id'])) {
            $merge['team_lead_id'] = $this->input('teamLeadId');
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
            'team_lead_id' => ['sometimes', 'nullable', 'exists:users,id'],
            'description' => ['sometimes', 'nullable', 'string'],
            'status' => ['sometimes', 'nullable', Rule::enum(TeamStatus::class)],
            'color' => ['sometimes', 'nullable', 'string', 'max:32'],
            'member_ids' => ['sometimes', 'nullable', 'array'],
            'member_ids.*' => ['integer', 'exists:users,id'],
            'project_ids' => ['sometimes', 'nullable', 'array'],
            'project_ids.*' => ['integer', 'exists:projects,id'],
        ];
    }
}
