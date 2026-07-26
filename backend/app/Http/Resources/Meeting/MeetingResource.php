<?php

namespace App\Http\Resources\Meeting;

use App\Enums\MeetingStatus;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MeetingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $status = $this->status instanceof MeetingStatus ? $this->status->value : $this->status;

        return [
            'id' => $this->id,
            'title' => $this->title,
            'date' => optional($this->date)?->toDateString(),
            'startTime' => $this->formatTime($this->start_time),
            'durationMinutes' => (int) $this->duration_minutes,
            'status' => $status,
            'type' => $this->type?->value ?? $this->type,
            'location' => $this->location,
            'joinUrl' => $this->join_url,
            'projectId' => $this->project_id,
            'projectName' => $this->whenLoaded('project', fn () => $this->project?->name),
            'project' => $this->whenLoaded('project', function () {
                if (! $this->project) {
                    return null;
                }

                return [
                    'id' => $this->project->id,
                    'name' => $this->project->name,
                ];
            }),
            'teamId' => $this->team_id,
            'teamName' => $this->whenLoaded('team', fn () => $this->team?->name),
            'team' => $this->whenLoaded('team', function () {
                if (! $this->team) {
                    return null;
                }

                return [
                    'id' => $this->team->id,
                    'name' => $this->team->name,
                ];
            }),
            'organizerId' => $this->organizer_id,
            'organizerName' => $this->whenLoaded('organizer', fn () => $this->organizer?->name),
            'organizerInitials' => $this->whenLoaded('organizer', fn () => $this->organizer?->initials),
            'organizer' => $this->whenLoaded('organizer', function () {
                if (! $this->organizer) {
                    return null;
                }

                return [
                    'id' => $this->organizer->id,
                    'name' => $this->organizer->name,
                    'initials' => $this->organizer->initials,
                ];
            }),
            'attendees' => $this->whenLoaded('attendees', function () {
                return $this->attendees->map(fn ($user) => [
                    'userId' => $user->id,
                    'name' => $user->name,
                    'initials' => $user->initials,
                    'rsvpStatus' => $user->pivot->rsvp_status,
                ]);
            }),
            'description' => $this->description,
            'agenda' => $this->whenLoaded('agendaItems', function () {
                return $this->agendaItems->map(fn ($item) => [
                    'id' => $item->id,
                    'title' => $item->title,
                    'done' => (bool) $item->done,
                ]);
            }),
            'agendaItems' => $this->whenLoaded('agendaItems', function () {
                return $this->agendaItems->map(fn ($item) => [
                    'id' => $item->id,
                    'title' => $item->title,
                    'done' => (bool) $item->done,
                    'sortOrder' => $item->sort_order,
                ]);
            }),
            'notes' => $status === MeetingStatus::Completed->value ? $this->notes : null,
            'recurring' => $this->recurring,
            'createdAt' => optional($this->created_at)?->toDateString(),
            'createdById' => $this->created_by,
            'createdByName' => $this->whenLoaded('creator', fn () => $this->creator?->name),
        ];
    }

    private function formatTime(mixed $time): ?string
    {
        if ($time === null) {
            return null;
        }

        if (is_string($time)) {
            return substr($time, 0, 5);
        }

        return optional($time)->format('H:i');
    }
}
