<?php

namespace App\Http\Requests\Meeting;

use App\Enums\RsvpStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateMeetingRsvpRequest extends FormRequest
{
    public function authorize(): bool
    {
        $meeting = $this->route('meeting');
        $user = $this->route('user');

        return $this->user()?->can('updateRsvp', [$meeting, $user]) ?? false;
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('rsvpStatus') && ! $this->has('rsvp_status')) {
            $this->merge(['rsvp_status' => $this->input('rsvpStatus')]);
        }
    }

    public function rules(): array
    {
        return [
            'rsvp_status' => ['required', Rule::enum(RsvpStatus::class)],
        ];
    }
}
