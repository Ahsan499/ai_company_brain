<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Dashboard\DashboardResource;
use App\Services\DashboardService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    use ApiResponse;

    protected DashboardService $dashboardService;

    public function __construct(DashboardService $dashboardService)
    {
        $this->dashboardService = $dashboardService;
    }

    /**
     * Dashboard Statistics
     */
    public function index(): JsonResponse
    {
        return $this->successResponse(
            new DashboardResource(
                $this->dashboardService->statistics()
            ),
            'Dashboard retrieved successfully.'
        );
    }
}