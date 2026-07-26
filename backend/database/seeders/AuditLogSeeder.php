<?php

namespace Database\Seeders;

use App\Enums\AuditAction;
use App\Models\AuditLog;
use Carbon\Carbon;
use Database\Seeders\Support\FrontendDump;
use Database\Seeders\Support\IdMap;
use Illuminate\Database\Seeder;

class AuditLogSeeder extends Seeder
{
    public function run(): void
    {
        foreach (FrontendDump::get('AUDIT_LOGS') as $row) {
            $entityId = $this->resolveEntityId($row['module'] ?? null, $row['entityId'] ?? null);

            AuditLog::query()->create([
                'actor_id' => IdMap::userId($row['actorId'] ?? null),
                'action' => AuditAction::from($row['action']),
                'entity_type' => $row['module'] ?? 'Settings',
                'entity_id' => $entityId,
                'entity_name' => $row['entityName'] ?? null,
                'diff' => $row['diffs'] ?? null,
                'metadata' => $row['metadata'] ?? null,
                'ip_address' => $row['ip'] ?? null,
                'device' => $row['device'] ?? null,
                'created_at' => Carbon::parse($row['timestamp']),
            ]);
        }
    }

    private function resolveEntityId(?string $module, ?string $frontendId): ?int
    {
        if (! $frontendId || ! $module) {
            return null;
        }

        return match ($module) {
            'Organization' => IdMap::orgId($frontendId),
            'User' => IdMap::userId($frontendId),
            'Department' => IdMap::deptId($frontendId),
            'Project' => IdMap::projectId($frontendId),
            'Task' => IdMap::taskId($frontendId),
            'Team' => IdMap::teamId($frontendId),
            'Meeting' => IdMap::$meetings[$frontendId] ?? null,
            'File' => IdMap::$files[$frontendId] ?? null,
            default => null,
        };
    }
}
