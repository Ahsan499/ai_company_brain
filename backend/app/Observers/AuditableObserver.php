<?php

namespace App\Observers;

use App\Enums\AuditAction;
use App\Services\AuditLogService;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class AuditableObserver
{
    public function __construct(protected AuditLogService $auditLogService) {}

    public function created(Model $model): void
    {
        if (! Auth::check()) {
            return;
        }

        $this->auditLogService->logModel(AuditAction::Create, $model);
    }

    public function updated(Model $model): void
    {
        if (! Auth::check()) {
            return;
        }

        $changes = $model->getChanges();
        unset($changes['updated_at'], $changes['remember_token'], $changes['password']);

        if ($changes === []) {
            return;
        }

        $diff = [];
        foreach ($changes as $key => $newValue) {
            $diff[$key] = [
                'before' => $model->getOriginal($key),
                'after' => $newValue,
            ];
        }

        $this->auditLogService->logModel(AuditAction::Update, $model, $diff);
    }

    public function deleted(Model $model): void
    {
        if (! Auth::check()) {
            return;
        }

        $this->auditLogService->logModel(AuditAction::Delete, $model);
    }
}
