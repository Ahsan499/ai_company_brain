<?php

namespace Database\Seeders;

use App\Models\TimeEntry;
use Carbon\Carbon;
use Database\Seeders\Support\FrontendDump;
use Database\Seeders\Support\IdMap;
use Illuminate\Database\Seeder;

class TimeEntrySeeder extends Seeder
{
    public function run(): void
    {
        foreach (FrontendDump::get('TIME_ENTRIES') as $row) {
            TimeEntry::query()->create([
                'user_id' => IdMap::userId($row['userId']),
                'task_id' => IdMap::taskId($row['taskId'] ?? null),
                'project_id' => IdMap::projectId($row['projectId'] ?? null),
                'team_id' => IdMap::teamId($row['teamId'] ?? null),
                'date' => Carbon::parse($row['date'])->toDateString(),
                'duration_minutes' => (int) ($row['durationMinutes'] ?? 0),
                'note' => $row['note'] ?? null,
                'billable' => (bool) ($row['billable'] ?? true),
                'created_at' => Carbon::parse($row['date'])->setTime(12, 0),
                'updated_at' => now(),
            ]);
        }
    }
}
