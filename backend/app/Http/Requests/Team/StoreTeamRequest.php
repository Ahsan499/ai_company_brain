<?php

namespace App\Http\Requests\Team;

use App\Enums\TeamStatus;
use App\Models\Team;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTeamRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', Team::class) ?? false;
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
        // Accept leadId mapped already; also accept teamLeadId
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
            'name' => ['required', 'string', 'max:255'],
            'organization_id' => ['required', 'exists:organizations,id'],
            'department_id' => ['required', 'exists:departments,id'],
            'team_lead_id' => ['nullable', 'exists:users,id'],
            'description' => ['nullable', 'string'],
            'status' => ['nullable', Rule::enum(TeamStatus::class)],
            'color' => ['nullable', 'string', 'max:32'],
            'member_ids' => ['nullable', 'array'],
            'member_ids.*' => ['integer', 'exists:users,id'],
            'project_ids' => ['nullable', 'array'],
            'project_ids.*' => ['integer', 'exists:projects,id'],
        ];
    }
}
