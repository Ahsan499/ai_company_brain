<?php

namespace App\Http\Requests\User;

use App\Enums\UserStatus;
use App\Support\RoleLabel;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('update', $this->route('user')) ?? false;
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

        if ($this->filled('department') && ! $this->filled('department_id') && ! $this->filled('departmentId')) {
            $merge['department_name'] = $this->input('department');
        }

        if ($merge) {
            $this->merge($merge);
        }
    }

    public function rules(): array
    {
        $user = $this->route('user');
        $id = is_object($user) ? $user->id : $user;

        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'email' => ['sometimes', 'required', 'email', Rule::unique('users', 'email')->ignore($id)],
            'password' => ['sometimes', 'nullable', 'string', 'min:8', 'confirmed'],
            'role' => ['sometimes', 'string', Rule::in(array_keys(RoleLabel::TO_SPATIE))],
            'organization_id' => ['sometimes', 'nullable', 'exists:organizations,id'],
            'department_id' => ['sometimes', 'nullable', 'exists:departments,id'],
            'department_name' => ['sometimes', 'nullable', 'string', 'max:255'],
            'manager_id' => ['sometimes', 'nullable', 'exists:users,id'],
            'phone' => ['sometimes', 'nullable', 'string', 'max:50'],
            'location' => ['sometimes', 'nullable', 'string', 'max:255'],
            'status' => ['sometimes', 'nullable', Rule::enum(UserStatus::class)],
            'initials' => ['sometimes', 'nullable', 'string', 'max:10'],
        ];
    }
}
