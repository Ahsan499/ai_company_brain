<?php

namespace App\Http\Requests\Meeting;

use App\Enums\MeetingStatus;
use App\Enums\MeetingType;
use App\Models\Meeting;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreMeetingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', Meeting::class) ?? false;
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
        if ($this->has('agenda') && is_string($this->input('agenda'))) {
            $merge['agenda'] = $this->input('agenda');
        }
        if ($merge) {
            $this->merge($merge);
        }
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'date' => ['required', 'date'],
            'start_time' => ['required', 'string'],
            'duration_minutes' => ['required', 'integer', 'min:5', 'max:480'],
            'project_id' => ['nullable', 'exists:projects,id'],
            'team_id' => ['nullable', 'exists:teams,id'],
            'organizer_id' => ['nullable', 'exists:users,id'],
            'description' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
            'status' => ['nullable', Rule::enum(MeetingStatus::class)],
            'type' => ['nullable', Rule::enum(MeetingType::class)],
            'location' => ['nullable', 'string', 'max:255'],
            'join_url' => ['nullable', 'string', 'max:500'],
            'recurring' => ['nullable', 'string', 'max:100'],
            'attendee_ids' => ['nullable', 'array'],
            'attendee_ids.*' => ['integer', 'exists:users,id'],
            'agenda_items' => ['nullable', 'array'],
            'agenda_items.*' => ['string', 'max:255'],
            'agenda' => ['nullable', 'string', 'max:255'],
        ];
    }
}
