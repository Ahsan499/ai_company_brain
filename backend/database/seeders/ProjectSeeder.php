<?php

namespace Database\Seeders;

use App\Enums\Priority;
use App\Enums\ProjectStatus;
use App\Models\Project;
use App\Models\ProjectMilestone;
use Carbon\Carbon;
use Database\Seeders\Support\FrontendDump;
use Database\Seeders\Support\IdMap;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    public function run(): void
    {
        foreach (FrontendDump::get('PROJECTS') as $row) {
            $project = Project::query()->create([
                'organization_id' => IdMap::orgId($row['organizationId']),
                'department_id' => IdMap::deptId($row['departmentId']),
                'name' => $row['name'],
                'description' => $row['description'] ?? null,
                'status' => ProjectStatus::from($row['status']),
                'priority' => Priority::from($row['priority'] ?? 'medium'),
                'progress' => (int) ($row['progress'] ?? 0),
                'due_date' => isset($row['dueDate']) ? Carbon::parse($row['dueDate'])->toDateString() : null,
                'created_at' => isset($row['createdAt']) ? Carbon::parse($row['createdAt'])->startOfDay() : now(),
                'updated_at' => now(),
            ]);

            IdMap::$projects[$row['id']] = $project->id;

            $sync = [];
            foreach ($row['members'] ?? [] as $member) {
                $uid = IdMap::userId($member['userId'] ?? null);
                if (! $uid) {
                    continue;
                }
                $sync[$uid] = [
                    'role_in_project' => $member['projectRole'] ?? null,
                ];
            }
            if ($sync) {
                $project->members()->sync($sync);
            }

            foreach ($row['milestones'] ?? [] as $i => $ms) {
                ProjectMilestone::query()->create([
                    'project_id' => $project->id,
                    'title' => $ms['title'],
                    'due_date' => isset($ms['dueDate']) ? Carbon::parse($ms['dueDate'])->toDateString() : null,
                    'done' => (bool) ($ms['done'] ?? false),
                    'sort_order' => $i,
                ]);
            }
        }

        // Attach teams ↔ projects from team.projectIds
        foreach (FrontendDump::get('TEAMS') as $team) {
            $teamId = IdMap::teamId($team['id'] ?? null);
            if (! $teamId) {
                continue;
            }
            $projectIds = collect($team['projectIds'] ?? [])
                ->map(fn ($id) => IdMap::projectId($id))
                ->filter()
                ->values()
                ->all();

            if ($projectIds) {
                \App\Models\Team::query()->find($teamId)?->projects()->syncWithoutDetaching($projectIds);
            }
        }
    }
}
