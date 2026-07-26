<?php

namespace App\Http\Requests\Meeting;

use App\Enums\MeetingStatus;
use App\Enums\MeetingType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateMeetingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('update', $this->route('meeting')) ?? false;
    }

    protected function prepareForValidation(): void
    {
        $merge = [];
        foreach ([
            'projectId' => 'project_id',
            'teamId' => 'team_id',
            'organizerId' => 'organizer_id',
            'startTime' => 'start_time',
            'durationMinutes' => 'duration_minutes',
            'joinUrl' => 'join_url',
            'attendeeIds' => 'attendee_ids',
            'agendaItems' => 'agenda_items',
        ] as $camel => $snake) {
            if ($this->has($camel)) {
                $merge[$snake] = $this->input($camel);
            }
        }
        if ($this->has('time') && ! isset($merge['start_time'])) {
            $merge['start_time'] = $this->input('time');
        }
        if ($this->has('duration') && ! isset($merge['duration_minutes'])) {
            $merge['duration_minutes'] = (int) $this->input('duration');
        }
        if ($merge) {
            $this->merge($merge);
        }
    }

    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'date' => ['sometimes', 'required', 'date'],
            'start_time' => ['sometimes', 'required', 'string'],
            'duration_minutes' => ['sometimes', 'required', 'integer', 'min:5', 'max:480'],
            'project_id' => ['sometimes', 'nullable', 'exists:projects,id'],
            'team_id' => ['sometimes', 'nullable', 'exists:teams,id'],
            'organizer_id' => ['sometimes', 'nullable', 'exists:users,id'],
            'description' => ['sometimes', 'nullable', 'string'],
            'notes' => ['sometimes', 'nullable', 'string'],
            'status' => ['sometimes', 'nullable', Rule::enum(MeetingStatus::class)],
            'type' => ['sometimes', 'nullable', Rule::enum(MeetingType::class)],
            'location' => ['sometimes', 'nullable', 'string', 'max:255'],
            'join_url' => ['sometimes', 'nullable', 'string', 'max:500'],
            'recurring' => ['sometimes', 'nullable', 'string', 'max:100'],
            'attendee_ids' => ['sometimes', 'nullable', 'array'],
            'attendee_ids.*' => ['integer', 'exists:users,id'],
        ];
    }
}
