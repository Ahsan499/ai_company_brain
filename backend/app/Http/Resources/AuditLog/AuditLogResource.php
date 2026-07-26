<?php

namespace App\Http\Resources\AuditLog;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AuditLogResource extends JsonResource
{
    private const MODULE_PATH = [
        'Organization' => '/dashboard/organizations/',
        'User' => '/dashboard/users/',
        'Department' => '/dashboard/departments/',
        'Project' => '/dashboard/projects/',
        'Task' => '/dashboard/tasks/',
        'Team' => '/dashboard/teams/',
        'Meeting' => '/dashboard/meetings/',
        'File' => '/dashboard/files/',
        'Folder' => '/dashboard/files/',
    ];

    public function toArray(Request $request): array
    {
        $entityType = $this->entity_type;
        $entityId = $this->entity_id;
        $link = null;

        if ($entityType && $entityId && isset(self::MODULE_PATH[$entityType])) {
            $link = self::MODULE_PATH[$entityType].$entityId;
        }

        $action = $this->action?->value ?? $this->action;

        return [
            'id' => $this->id,
            'actorId' => $this->actor_id,
            'actorName' => $this->whenLoaded('actor', fn () => $this->actor?->name),
            'actorInitials' => $this->whenLoaded('actor', fn () => $this->actor?->initials),
            'actor' => $this->whenLoaded('actor', function () {
                if (! $this->actor) {
                    return null;
                }

                return [
                    'id' => $this->actor->id,
                    'name' => $this->actor->name,
                    'initials' => $this->actor->initials,
                    'email' => $this->actor->email,
                ];
            }),
            'action' => $action,
            'actionType' => $action,
            'entityType' => $entityType,
            'module' => $entityType,
            'targetEntity' => [
                'type' => $entityType,
                'id' => $entityId,
                'name' => $this->entity_name,
                'link' => $link,
            ],
            'diff' => $this->diff,
            'metadata' => $this->metadata,
            'ipAddress' => $this->ip_address,
            'device' => $this->device,
            'createdAt' => optional($this->created_at)?->toIso8601String(),
            'timestamp' => optional($this->created_at)?->toIso8601String(),
        ];
    }
}
