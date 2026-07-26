<?php

namespace Database\Seeders;

use App\Enums\Priority;
use App\Enums\TaskStatus;
use App\Models\Subtask;
use App\Models\Task;
use App\Models\TaskComment;
use Carbon\Carbon;
use Database\Seeders\Support\FrontendDump;
use Database\Seeders\Support\IdMap;
use Illuminate\Database\Seeder;

class TaskSeeder extends Seeder
{
    public function run(): void
    {
        foreach (FrontendDump::get('TASKS') as $row) {
            $task = Task::query()->create([
                'organization_id' => IdMap::orgId($row['organizationId']),
                'department_id' => IdMap::deptId($row['departmentId'] ?? null),
                'project_id' => IdMap::projectId($row['projectId']),
                'assignee_id' => IdMap::userId($row['assigneeId'] ?? null),
                'created_by' => IdMap::userId($row['createdById'] ?? null),
                'title' => $row['title'],
                'description' => $row['description'] ?? null,
                'status' => TaskStatus::from($row['status']),
                'priority' => Priority::from($row['priority'] ?? 'medium'),
                'due_date' => isset($row['dueDate']) ? Carbon::parse($row['dueDate'])->toDateString() : null,
                'created_at' => isset($row['createdAt']) ? Carbon::parse($row['createdAt'])->startOfDay() : now(),
                'updated_at' => now(),
            ]);

            IdMap::$tasks[$row['id']] = $task->id;

            foreach ($row['subtasks'] ?? [] as $i => $sub) {
                Subtask::query()->create([
                    'task_id' => $task->id,
                    'title' => $sub['title'],
                    'done' => (bool) ($sub['done'] ?? false),
                    'sort_order' => $i,
                ]);
            }

            foreach ($row['comments'] ?? [] as $comment) {
                $authorId = IdMap::userId($comment['userId'] ?? null);
                if (! $authorId) {
                    continue;
                }

                TaskComment::query()->create([
                    'task_id' => $task->id,
                    'user_id' => $authorId,
                    'body' => $comment['text'] ?? '',
                    'created_at' => $this->relativeToCarbon($comment['time'] ?? null),
                    'updated_at' => now(),
                ]);
            }
        }
    }

    private function relativeToCarbon(?string $relative): Carbon
    {
        $now = Carbon::parse('2026-07-26 15:00:00');
        if (! $relative) {
            return $now;
        }

        $r = strtolower(trim($relative));
        if (str_contains($r, 'just') || preg_match('/^\d+m/', $r)) {
            if (preg_match('/(\d+)m/', $r, $m)) {
                return $now->copy()->subMinutes((int) $m[1]);
            }

            return $now->copy()->subMinute();
        }
        if (preg_match('/(\d+)\s*h/', $r, $m)) {
            return $now->copy()->subHours((int) $m[1]);
        }
        if (str_contains($r, 'yesterday')) {
            return $now->copy()->subDay();
        }
        if (preg_match('/(\d+)\s*d/', $r, $m)) {
            return $now->copy()->subDays((int) $m[1]);
        }
        if (str_contains($r, 'week')) {
            return $now->copy()->subWeek();
        }

        return $now->copy()->subHours(2);
    }
}
