<?php

namespace App\Http\Requests\Team;

use Illuminate\Foundation\Http\FormRequest;

class StoreTeamMemberRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('manageMembers', $this->route('team')) ?? false;
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('userId') && ! $this->has('user_id')) {
            $this->merge(['user_id' => $this->input('userId')]);
        }
    }

    public function rules(): array
    {
        return [
            'user_id' => ['required', 'integer', 'exists:users,id'],
        ];
    }
}
