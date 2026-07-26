<?php

namespace Database\Seeders;

use App\Enums\MeetingStatus;
use App\Enums\MeetingType;
use App\Enums\RsvpStatus;
use App\Models\Meeting;
use App\Models\MeetingAgendaItem;
use App\Models\Project;
use App\Models\Team;
use App\Models\User;
use Carbon\Carbon;
use Database\Seeders\Support\FrontendDump;
use Database\Seeders\Support\IdMap;
use Illuminate\Database\Seeder;

class MeetingSeeder extends Seeder
{
    public function run(): void
    {
        foreach (FrontendDump::get('MEETINGS') as $row) {
            $meeting = Meeting::query()->create([
                'organization_id' => $this->orgFromLinks($row),
                'project_id' => IdMap::projectId($row['projectId'] ?? null),
                'team_id' => IdMap::teamId($row['teamId'] ?? null),
                'organizer_id' => IdMap::userId($row['organizerId']),
                'created_by' => IdMap::userId($row['createdById'] ?? null),
                'title' => $row['title'],
                'description' => $row['description'] ?? null,
                'notes' => $row['notes'] ?? null,
                'date' => Carbon::parse($row['date'])->toDateString(),
                'start_time' => $row['startTime'],
                'duration_minutes' => (int) ($row['durationMinutes'] ?? 30),
                'status' => MeetingStatus::from($row['status']),
                'type' => MeetingType::from($row['type'] ?? 'video'),
                'location' => $row['location'] ?? null,
                'join_url' => $row['joinUrl'] ?? null,
                'recurring' => $row['recurring'] ?? null,
                'created_at' => isset($row['createdAt']) ? Carbon::parse($row['createdAt'])->startOfDay() : now(),
                'updated_at' => now(),
            ]);

            IdMap::$meetings[$row['id']] = $meeting->id;

            $sync = [];
            foreach ($row['attendees'] ?? [] as $attendee) {
                $uid = IdMap::userId($attendee['userId'] ?? null);
                if (! $uid) {
                    continue;
                }
                $sync[$uid] = [
                    'rsvp_status' => RsvpStatus::from($attendee['rsvpStatus'] ?? 'pending')->value,
                ];
            }
            if ($sync) {
                $meeting->attendees()->sync($sync);
            }

            foreach ($row['agenda'] ?? [] as $i => $item) {
                MeetingAgendaItem::query()->create([
                    'meeting_id' => $meeting->id,
                    'title' => $item['title'],
                    'done' => (bool) ($item['done'] ?? false),
                    'sort_order' => $i,
                ]);
            }
        }
    }

    private function orgFromLinks(array $row): ?int
    {
        if (! empty($row['projectId'])) {
            $project = Project::query()->find(IdMap::projectId($row['projectId']));
            if ($project) {
                return $project->organization_id;
            }
        }
        if (! empty($row['teamId'])) {
            $team = Team::query()->find(IdMap::teamId($row['teamId']));
            if ($team) {
                return $team->organization_id;
            }
        }

        return User::query()->find(IdMap::userId($row['organizerId'] ?? null))?->organization_id;
    }
}
