<?php

namespace App\Http\Requests\User;

use App\Enums\UserStatus;
use App\Support\RoleLabel;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', \App\Models\User::class) ?? false;
    }

    protected function prepareForValidation(): void
    {
        $merge = [];
        foreach ([
            'organizationId' => 'organization_id',
            'departmentId' => 'department_id',
            'managerId' => 'manager_id',
        ] as $camel => $snake) {
            if ($this->has($camel)) {
                $merge[$snake] = $this->input($camel);
            }
        }

        // Invite modal sends department as name string
        if ($this->filled('department') && ! $this->filled('department_id') && ! $this->filled('departmentId')) {
            $merge['department_name'] = $this->input('department');
        }

        if ($merge) {
            $this->merge($merge);
        }
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['nullable', 'string', 'min:8', 'confirmed'],
            'role' => ['required', 'string', Rule::in(array_keys(RoleLabel::TO_SPATIE))],
            'organization_id' => ['required', 'exists:organizations,id'],
            'department_id' => ['nullable', 'exists:departments,id'],
            'department_name' => ['nullable', 'string', 'max:255'],
            'manager_id' => ['nullable', 'exists:users,id'],
            'phone' => ['nullable', 'string', 'max:50'],
            'location' => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', Rule::enum(UserStatus::class)],
            'initials' => ['nullable', 'string', 'max:10'],
        ];
    }
}
