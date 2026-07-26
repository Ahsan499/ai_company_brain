<?php

namespace App\Http\Requests\Meeting;

use Illuminate\Foundation\Http\FormRequest;

class StoreMeetingAgendaItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('manageAgenda', $this->route('meeting')) ?? false;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'done' => ['nullable', 'boolean'],
        ];
    }
}
