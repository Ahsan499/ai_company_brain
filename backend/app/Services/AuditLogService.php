<?php

namespace App\Services;

use App\Enums\AuditAction;
use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request as RequestFacade;

class AuditLogService
{
    public function index(Request $request, User $actor): LengthAwarePaginator
    {
        $perPage = min(max((int) $request->integer('per_page', 20), 1), 100);

        $query = AuditLog::query()
            ->with('actor')
            ->latest('created_at')
            ->latest('id');

        if ($actorId = $request->input('actor_id', $request->input('actorId'))) {
            $query->where('actor_id', $actorId);
        }

        if ($action = $request->input('action_type', $request->input('actionType', $request->input('action')))) {
            $query->where('action', $action);
        }

        if ($entityType = $request->input('entity_type', $request->input('entityType', $request->input('module')))) {
            $query->where('entity_type', $entityType);
        }

        $from = $request->input('date_from', $request->input('dateFrom'));
        $to = $request->input('date_to', $request->input('dateTo'));
        if ($from) {
            $query->whereDate('created_at', '>=', $from);
        }
        if ($to) {
            $query->whereDate('created_at', '<=', $to);
        }

        $search = trim((string) ($request->input('search') ?: $request->input('query') ?: ''));
        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('entity_name', 'like', "%{$search}%")
                    ->orWhereHas('actor', fn ($a) => $a->where('name', 'like', "%{$search}%"));
            });
        }

        if (! $actor->hasRole('Super Admin') && $actor->organization_id) {
            $orgId = $actor->organization_id;
            $query->where(function ($q) use ($orgId) {
                $q->whereHas('actor', fn ($a) => $a->where('organization_id', $orgId))
                    ->orWhereNull('actor_id');
            });
        }

        return $query->paginate($perPage);
    }

    public function log(
        AuditAction|string $action,
        string $entityType,
        ?int $entityId = null,
        ?string $entityName = null,
        ?array $diff = null,
        ?array $metadata = null,
        ?int $actorId = null,
    ): AuditLog {
        return AuditLog::query()->create([
            'actor_id' => $actorId ?? Auth::id(),
            'action' => $action instanceof AuditAction ? $action->value : $action,
            'entity_type' => $entityType,
            'entity_id' => $entityId,
            'entity_name' => $entityName,
            'diff' => $diff,
            'metadata' => $metadata,
            'ip_address' => RequestFacade::ip(),
            'device' => substr((string) RequestFacade::userAgent(), 0, 255) ?: null,
            'created_at' => now(),
        ]);
    }

    public function logModel(AuditAction $action, Model $model, ?array $diff = null): AuditLog
    {
        $entityType = class_basename($model);
        $name = $model->getAttribute('name')
            ?? $model->getAttribute('title')
            ?? $model->getAttribute('email')
            ?? '#'.$model->getKey();

        return $this->log(
            $action,
            $entityType,
            (int) $model->getKey(),
            is_string($name) ? $name : (string) $name,
            $diff,
        );
    }
}
