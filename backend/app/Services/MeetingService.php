<?php

namespace App\Services;

use App\Enums\MeetingStatus;
use App\Enums\MeetingType;
use App\Enums\RsvpStatus;
use App\Models\Meeting;
use App\Models\MeetingAgendaItem;
use App\Models\Project;
use App\Models\Team;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class MeetingService
{
    public function index(Request $request, User $actor): LengthAwarePaginator
    {
        $perPage = min(max((int) $request->integer('per_page', 20), 1), 100);

        $query = Meeting::query()
            ->with(['project', 'team', 'organizer', 'creator', 'attendees', 'agendaItems'])
            ->search($request->string('search')->toString() ?: $request->string('query')->toString())
            ->projectId($request->input('project_id', $request->input('projectId')))
            ->teamId($request->input('team_id', $request->input('teamId')))
            ->organizerId($request->input('organizer_id', $request->input('organizerId')))
            ->dateBetween(
                $request->input('date_from', $request->input('dateFrom')),
                $request->input('date_to', $request->input('dateTo'))
            )
            ->myMeetings($request->input('my_meetings', $request->input('myMeetings')), $actor->id)
            ->latest('date')
            ->latest('id');

        if (! $actor->hasRole('Super Admin')) {
            $query->where('organization_id', $actor->organization_id);
        }

        return $query->paginate($perPage);
    }

    public function show(Meeting $meeting): Meeting
    {
        return $meeting->load(['project', 'team', 'organizer', 'creator', 'attendees', 'agendaItems']);
    }

    public function store(array $data, User $actor): Meeting
    {
        return DB::transaction(function () use ($data, $actor) {
            $orgId = $actor->organization_id;
            if (! empty($data['project_id'])) {
                $orgId = Project::query()->find($data['project_id'])?->organization_id ?? $orgId;
            } elseif (! empty($data['team_id'])) {
                $orgId = Team::query()->find($data['team_id'])?->organization_id ?? $orgId;
            }

            $organizerId = $data['organizer_id'] ?? $actor->id;

            $meeting = Meeting::query()->create([
                'organization_id' => $orgId,
                'project_id' => $data['project_id'] ?? null,
                'team_id' => $data['team_id'] ?? null,
                'organizer_id' => $organizerId,
                'created_by' => $actor->id,
                'title' => $data['title'],
                'description' => $data['description'] ?? null,
                'notes' => $data['notes'] ?? null,
                'date' => $data['date'],
                'start_time' => $data['start_time'],
                'duration_minutes' => $data['duration_minutes'],
                'status' => $data['status'] ?? MeetingStatus::Upcoming->value,
                'type' => $data['type'] ?? MeetingType::Video->value,
                'location' => $data['location'] ?? null,
                'join_url' => $data['join_url'] ?? null,
                'recurring' => $data['recurring'] ?? null,
            ]);

            $attendeeSync = [];
            foreach ($data['attendee_ids'] ?? [] as $userId) {
                $attendeeSync[$userId] = ['rsvp_status' => RsvpStatus::Pending->value];
            }
            if (! isset($attendeeSync[$organizerId])) {
                $attendeeSync[$organizerId] = ['rsvp_status' => RsvpStatus::Accepted->value];
            }
            $meeting->attendees()->sync($attendeeSync);

            foreach ($data['agenda_items'] ?? [] as $i => $title) {
                if (is_string($title) && trim($title) !== '') {
                    $meeting->agendaItems()->create([
                        'title' => $title,
                        'done' => false,
                        'sort_order' => $i,
                    ]);
                }
            }

            // Support single agenda string from create modal
            if (! empty($data['agenda']) && is_string($data['agenda'])) {
                $meeting->agendaItems()->create([
                    'title' => $data['agenda'],
                    'done' => false,
                    'sort_order' => 0,
                ]);
            }

            return $this->show($meeting);
        });
    }

    public function update(Meeting $meeting, array $data): Meeting
    {
        return DB::transaction(function () use ($meeting, $data) {
            $meeting->fill([
                'project_id' => array_key_exists('project_id', $data) ? $data['project_id'] : $meeting->project_id,
                'team_id' => array_key_exists('team_id', $data) ? $data['team_id'] : $meeting->team_id,
                'organizer_id' => $data['organizer_id'] ?? $meeting->organizer_id,
                'title' => $data['title'] ?? $meeting->title,
                'description' => array_key_exists('description', $data) ? $data['description'] : $meeting->description,
                'notes' => array_key_exists('notes', $data) ? $data['notes'] : $meeting->notes,
                'date' => $data['date'] ?? $meeting->date,
                'start_time' => $data['start_time'] ?? $meeting->start_time,
                'duration_minutes' => $data['duration_minutes'] ?? $meeting->duration_minutes,
                'status' => $data['status'] ?? $meeting->status,
                'type' => $data['type'] ?? $meeting->type,
                'location' => array_key_exists('location', $data) ? $data['location'] : $meeting->location,
                'join_url' => array_key_exists('join_url', $data) ? $data['join_url'] : $meeting->join_url,
                'recurring' => array_key_exists('recurring', $data) ? $data['recurring'] : $meeting->recurring,
            ])->save();

            if (array_key_exists('attendee_ids', $data)) {
                $sync = [];
                foreach ($data['attendee_ids'] ?? [] as $userId) {
                    $existing = $meeting->attendees()->where('users.id', $userId)->first();
                    $sync[$userId] = [
                        'rsvp_status' => $existing?->pivot?->rsvp_status ?? RsvpStatus::Pending->value,
                    ];
                }
                $meeting->attendees()->sync($sync);
            }

            return $this->show($meeting->fresh());
        });
    }

    public function updateStatus(Meeting $meeting, string $status): Meeting
    {
        $meeting->forceFill(['status' => $status])->save();

        return $this->show($meeting->fresh());
    }

    public function destroy(Meeting $meeting): void
    {
        $meeting->delete();
    }

    public function addAttendee(Meeting $meeting, int $userId): Meeting
    {
        $user = User::query()->findOrFail($userId);
        if ((int) $user->organization_id !== (int) $meeting->organization_id) {
            throw ValidationException::withMessages([
                'user_id' => ['User must belong to the same organization.'],
            ]);
        }

        $meeting->attendees()->syncWithoutDetaching([
            $userId => ['rsvp_status' => RsvpStatus::Pending->value],
        ]);

        return $this->show($meeting);
    }

    public function removeAttendee(Meeting $meeting, int $userId): Meeting
    {
        if ((int) $meeting->organizer_id === $userId) {
            throw ValidationException::withMessages([
                'user_id' => ['Cannot remove the meeting organizer.'],
            ]);
        }

        $meeting->attendees()->detach($userId);

        return $this->show($meeting);
    }

    public function updateRsvp(Meeting $meeting, int $userId, string $rsvp): Meeting
    {
        if (! $meeting->attendees()->where('users.id', $userId)->exists()) {
            $meeting->attendees()->attach($userId, ['rsvp_status' => $rsvp]);
        } else {
            $meeting->attendees()->updateExistingPivot($userId, ['rsvp_status' => $rsvp]);
        }

        return $this->show($meeting);
    }

    public function createAgendaItem(Meeting $meeting, array $data): MeetingAgendaItem
    {
        $sort = (int) $meeting->agendaItems()->max('sort_order') + 1;

        return $meeting->agendaItems()->create([
            'title' => $data['title'],
            'done' => (bool) ($data['done'] ?? false),
            'sort_order' => $sort,
        ]);
    }

    public function updateAgendaItem(Meeting $meeting, MeetingAgendaItem $item, array $data): MeetingAgendaItem
    {
        abort_unless((int) $item->meeting_id === (int) $meeting->id, 404);

        $item->fill([
            'title' => $data['title'] ?? $item->title,
            'done' => array_key_exists('done', $data) ? (bool) $data['done'] : $item->done,
        ])->save();

        return $item->fresh();
    }

    public function deleteAgendaItem(Meeting $meeting, MeetingAgendaItem $item): void
    {
        abort_unless((int) $item->meeting_id === (int) $meeting->id, 404);
        $item->delete();
    }
}
