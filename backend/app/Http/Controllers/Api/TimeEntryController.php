<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\TimeEntry\StoreTimeEntryRequest;
use App\Http\Requests\TimeEntry\UpdateTimeEntryRequest;
use App\Http\Resources\TimeEntry\TimeEntryResource;
use App\Models\TimeEntry;
use App\Services\TimeEntryService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TimeEntryController extends Controller
{
    use ApiResponse;

    public function __construct(protected TimeEntryService $timeEntryService) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', TimeEntry::class);

        $entries = $this->timeEntryService->index($request, $request->user());

        return TimeEntryResource::collection($entries)
            ->additional([
                'success' => true,
                'message' => 'Time entries retrieved successfully.',
            ])
            ->response();
    }

    public function store(StoreTimeEntryRequest $request): JsonResponse
    {
        $entry = $this->timeEntryService->store($request->validated(), $request->user());

        return $this->successResponse(
            new TimeEntryResource($entry),
            'Time entry created successfully.',
            201
        );
    }

    public function show(TimeEntry $timeEntry): JsonResponse
    {
        $this->authorize('view', $timeEntry);

        $entry = $this->timeEntryService->show($timeEntry);

        return $this->successResponse(
            new TimeEntryResource($entry),
            'Time entry retrieved successfully.'
        );
    }

    public function update(UpdateTimeEntryRequest $request, TimeEntry $timeEntry): JsonResponse
    {
        $entry = $this->timeEntryService->update($timeEntry, $request->validated());

        return $this->successResponse(
            new TimeEntryResource($entry),
            'Time entry updated successfully.'
        );
    }

    public function destroy(TimeEntry $timeEntry): JsonResponse
    {
        $this->authorize('delete', $timeEntry);

        $this->timeEntryService->destroy($timeEntry);

        return $this->successResponse(null, 'Time entry deleted successfully.');
    }

    public function reportSummary(Request $request): JsonResponse
    {
        $this->authorize('viewReports', TimeEntry::class);

        $summary = $this->timeEntryService->summary($request, $request->user());

        return $this->successResponse($summary, 'Time summary retrieved successfully.');
    }

    public function reportByProject(Request $request): JsonResponse
    {
        $this->authorize('viewReports', TimeEntry::class);

        $rows = $this->timeEntryService->byProject($request, $request->user());

        return $this->successResponse($rows, 'Hours by project retrieved successfully.');
    }

    public function reportByUser(Request $request): JsonResponse
    {
        $this->authorize('viewReports', TimeEntry::class);

        $rows = $this->timeEntryService->byUser($request, $request->user());

        return $this->successResponse($rows, 'Hours by user retrieved successfully.');
    }
}
