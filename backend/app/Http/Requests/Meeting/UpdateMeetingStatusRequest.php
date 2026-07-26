<?php

namespace App\Http\Requests\Meeting;

use App\Enums\MeetingStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateMeetingStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('updateStatus', $this->route('meeting')) ?? false;
    }

    public function rules(): array
    {
        return [
            'status' => ['required', Rule::enum(MeetingStatus::class)],
        ];
    }
}
