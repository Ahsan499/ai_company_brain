<?php

namespace App\Http\Requests\Team;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTeamRequest extends FormRequest
{
    /**
     * Determine if the user is authorized.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Validation rules.
     */
    public function rules(): array
    {
        $teamId = $this->route('team');

        return [

            'organization_id' => 'required|exists:organizations,id',

            'department_id' => 'required|exists:departments,id',

            'name' => 'required|string|max:255',

            'slug' => 'required|string|max:255|unique:teams,slug,' . $teamId,

            'description' => 'nullable|string',

            'is_active' => 'nullable|boolean',

            'users' => 'nullable|array',
            'users.*' => 'exists:users,id',

            'projects' => 'nullable|array',
            'projects.*' => 'exists:projects,id',

        ];
    }
}