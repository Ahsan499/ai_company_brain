<?php

namespace App\Http\Requests\Department;

use App\Enums\DepartmentStatus;
use App\Models\Department;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreDepartmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', Department::class) ?? false;
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
            'name' => ['required', 'string', 'max:255'],
            'organization_id' => ['required', 'exists:organizations,id'],
            'manager_id' => ['nullable', 'exists:users,id'],
            'description' => ['nullable', 'string'],
            'status' => ['nullable', Rule::enum(DepartmentStatus::class)],
            'avg_tenure_months' => ['nullable', 'integer', 'min:0'],
            'member_ids' => ['nullable', 'array'],
            'member_ids.*' => ['integer', 'exists:users,id'],
        ];
    }
}
