<?php

namespace App\Services;

use App\Http\Resources\AuditLog\AuditLogResource;
use App\Models\AuditLog;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuditLogService
{
    protected SearchService $searchService;

    public function __construct(SearchService $searchService)
    {
        $this->searchService = $searchService;
    }

    /**
     * Store audit log.
     */
    public function log(
        string $action,
        Model $model,
        ?array $oldValues = null,
        ?array $newValues = null
    ): AuditLog {

        return AuditLog::create([

            'user_id' => Auth::id(),

            'module' => class_basename($model),

            'record_id' => $model->id,

            'action' => $action,

            'old_values' => $oldValues,

            'new_values' => $newValues,

            'ip_address' => request()->ip(),

            'user_agent' => request()->userAgent(),
        ]);
    }

    /**
     * Get all audit logs.
     */
    public function index(Request $request)
    {
        $query = AuditLog::with('user');

        return AuditLogResource::collection(
            $this->searchService->apply($query, $request)
        );
    }
}