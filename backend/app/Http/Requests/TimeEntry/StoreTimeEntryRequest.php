<?php

namespace App\Http\Requests\TimeEntry;

use Illuminate\Foundation\Http\FormRequest;

class StoreTimeEntryRequest extends FormRequest
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

            'project_id' => 'required|exists:projects,id',

            'task_id' => 'required|exists:tasks,id',

            'user_id' => 'required|exists:users,id',

            'description' => 'nullable|string',

            'start_time' => 'required|date',

            'end_time' => 'nullable|date|after:start_time',

            'duration' => 'nullable|integer|min:0',

            'is_active' => 'nullable|boolean',

        ];
    }
}