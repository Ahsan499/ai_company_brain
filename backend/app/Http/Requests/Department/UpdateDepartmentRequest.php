<?php

namespace App\Http\Requests\Department;

use App\Enums\DepartmentStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateDepartmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('update', $this->route('department')) ?? false;
    }

    protected function prepareForValidation(): void
    {
        $merge = [];
        foreach ([
            'organizationId' => 'organization_id',
            'managerId' => 'manager_id',
            'avgTenureMonths' => 'avg_tenure_months',
            'memberIds' => 'member_ids',
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
            'manager_id' => ['sometimes', 'nullable', 'exists:users,id'],
            'description' => ['sometimes', 'nullable', 'string'],
            'status' => ['sometimes', 'nullable', Rule::enum(DepartmentStatus::class)],
            'avg_tenure_months' => ['sometimes', 'nullable', 'integer', 'min:0'],
            'member_ids' => ['sometimes', 'nullable', 'array'],
            'member_ids.*' => ['integer', 'exists:users,id'],
        ];
    }
}
