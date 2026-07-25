<?php

namespace App\Http\Requests\Notification;

use Illuminate\Foundation\Http\FormRequest;

class StoreNotificationRequest extends FormRequest
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

            'user_id' => 'required|exists:users,id',

            'title' => 'required|string|max:255',

            'message' => 'required|string',

            'type' => 'required|in:Info,Success,Warning,Error',

            'is_read' => 'nullable|boolean',

            'read_at' => 'nullable|date',

            'is_active' => 'nullable|boolean',

        ];
    }
}