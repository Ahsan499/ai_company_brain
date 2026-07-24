<?php

namespace App\Http\Requests\Project;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProjectRequest extends FormRequest
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
        $projectId = $this->route('project');

        return [
            'organization_id' => 'required|exists:organizations,id',

            'department_id' => 'required|exists:departments,id',

            'name' => 'required|string|max:255',

            'slug' => 'required|string|max:255|unique:projects,slug,' . $projectId,

            'description' => 'nullable|string',

            'start_date' => 'nullable|date',

            'end_date' => 'nullable|date|after_or_equal:start_date',

            'status' => 'required|in:Planning,Active,Completed,On Hold,Cancelled',

            'is_active' => 'nullable|boolean',

            'users' => 'nullable|array',

            'users.*' => 'exists:users,id',
        ];
    }
}