<?php

namespace App\Http\Requests\Meeting;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMeetingRequest extends FormRequest
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

            'team_id' => 'required|exists:teams,id',

            'title' => 'required|string|max:255',

            'description' => 'nullable|string',

            'meeting_date' => 'required|date',

            'start_time' => 'required|date_format:H:i',

            'end_time' => 'nullable|date_format:H:i|after:start_time',

            'location' => 'nullable|string|max:255',

            'status' => 'nullable|in:Scheduled,Completed,Cancelled',

            'is_active' => 'nullable|boolean',

        ];
    }
}