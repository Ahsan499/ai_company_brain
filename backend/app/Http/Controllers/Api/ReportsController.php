<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Task\TaskResource;
use App\Services\ReportService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class ReportsController extends Controller
{
    use ApiResponse;

    public function __construct(protected ReportService $reportService) {}

    protected function authorizeReports(): void
    {
        Gate::authorize('viewReports');
    }

    public function overview(Request $request): JsonResponse
    {
        $this->authorizeReports();

        return $this->successResponse(
            $this->reportService->overview($request, $request->user()),
            'Overview report retrieved successfully.'
        );
    }

    public function taskCompletionTrend(Request $request): JsonResponse
    {
        $this->authorizeReports();

        return $this->successResponse(
            $this->reportService->taskCompletionTrend($request, $request->user()),
            'Task completion trend retrieved successfully.'
        );
    }

    public function projectsByStatus(Request $request): JsonResponse
    {
        $this->authorizeReports();

        return $this->successResponse(
            $this->reportService->projectsByStatus($request, $request->user()),
            'Projects by status retrieved successfully.'
        );
    }

    public function projectsByDepartment(Request $request): JsonResponse
    {
        $this->authorizeReports();

        return $this->successResponse(
            $this->reportService->projectsByDepartment($request, $request->user()),
            'Projects by department retrieved successfully.'
        );
    }

    public function tasksByStatus(Request $request): JsonResponse
    {
        $this->authorizeReports();

        return $this->successResponse(
            $this->reportService->tasksByStatus($request, $request->user()),
            'Tasks by status retrieved successfully.'
        );
    }

    public function tasksByPriority(Request $request): JsonResponse
    {
        $this->authorizeReports();

        return $this->successResponse(
            $this->reportService->tasksByPriority($request, $request->user()),
            'Tasks by priority retrieved successfully.'
        );
    }

    public function overdueTasks(Request $request): JsonResponse
    {
        $this->authorizeReports();

        $tasks = $this->reportService->overdueTasks($request, $request->user());

        return TaskResource::collection($tasks)
            ->additional([
                'success' => true,
                'message' => 'Overdue tasks retrieved successfully.',
            ])
            ->response();
    }

    public function teamPerformance(Request $request): JsonResponse
    {
        $this->authorizeReports();

        return $this->successResponse(
            $this->reportService->teamPerformance($request, $request->user()),
            'Team performance retrieved successfully.'
        );
    }
}
