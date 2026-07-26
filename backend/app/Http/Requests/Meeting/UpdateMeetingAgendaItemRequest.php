<?php

namespace App\Http\Requests\Meeting;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMeetingAgendaItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('manageAgenda', $this->route('meeting')) ?? false;
    }

    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'done' => ['sometimes', 'boolean'],
        ];
    }
}
