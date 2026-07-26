<?php

namespace Database\Seeders;

use App\Enums\TeamStatus;
use App\Models\Team;
use Carbon\Carbon;
use Database\Seeders\Support\FrontendDump;
use Database\Seeders\Support\IdMap;
use Illuminate\Database\Seeder;

class TeamSeeder extends Seeder
{
    public function run(): void
    {
        foreach (FrontendDump::get('TEAMS') as $row) {
            $team = Team::query()->create([
                'organization_id' => IdMap::orgId($row['organizationId']),
                'department_id' => IdMap::deptId($row['departmentId']),
                'name' => $row['name'],
                'description' => $row['description'] ?? null,
                'status' => TeamStatus::from($row['status'] ?? 'active'),
                'color' => $row['color'] ?? null,
                'team_lead_id' => IdMap::userId($row['leadId'] ?? null),
                'created_at' => isset($row['createdAt']) ? Carbon::parse($row['createdAt'])->startOfDay() : now(),
                'updated_at' => now(),
            ]);

            IdMap::$teams[$row['id']] = $team->id;

            $memberIds = collect($row['memberIds'] ?? [])
                ->map(fn ($id) => IdMap::userId($id))
                ->filter()
                ->values()
                ->all();

            if ($memberIds) {
                $team->members()->sync($memberIds);
            }
        }
    }
}
