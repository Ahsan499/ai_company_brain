<?php

namespace App\Http\Requests\Task;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTaskRequest extends FormRequest
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
        return [
            'organization_id' => 'required|exists:organizations,id',

            'department_id' => 'required|exists:departments,id',

            'project_id' => 'required|exists:projects,id',

            'assigned_to' => 'required|exists:users,id',

            'title' => 'required|string|max:255',

            'description' => 'nullable|string',

            'status' => 'required|in:Pending,In Progress,Completed,Cancelled',

            'priority' => 'required|in:Low,Medium,High',

            'due_date' => 'nullable|date',

            'is_active' => 'nullable|boolean',
        ];
    }
}