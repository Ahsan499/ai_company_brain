<?php

namespace App\Http\Requests\Project;

use Illuminate\Foundation\Http\FormRequest;

class StoreProjectMemberRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('manageMembers', $this->route('project')) ?? false;
    }

    protected function prepareForValidation(): void
    {
        $merge = [];
        if ($this->has('userId')) {
            $merge['user_id'] = $this->input('userId');
        }
        if ($this->has('roleInProject')) {
            $merge['role_in_project'] = $this->input('roleInProject');
        }
        if ($merge) {
            $this->merge($merge);
        }
    }

    public function rules(): array
    {
        return [
            'user_id' => ['required', 'integer', 'exists:users,id'],
            'role_in_project' => ['nullable', 'string', 'max:100'],
        ];
    }
}
