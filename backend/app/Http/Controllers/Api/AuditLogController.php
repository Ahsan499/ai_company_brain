<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AuditLog\AuditLogResource;
use App\Models\AuditLog;
use App\Services\AuditLogService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuditLogController extends Controller
{
    use ApiResponse;

    public function __construct(protected AuditLogService $auditLogService) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', AuditLog::class);

        $logs = $this->auditLogService->index($request, $request->user());

        return AuditLogResource::collection($logs)
            ->additional([
                'success' => true,
                'message' => 'Audit logs retrieved successfully.',
            ])
            ->response();
    }
}
