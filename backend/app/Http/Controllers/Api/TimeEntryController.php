<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\TimeEntry\StoreTimeEntryRequest;
use App\Http\Requests\TimeEntry\UpdateTimeEntryRequest;
use App\Services\TimeEntryService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TimeEntryController extends Controller
{
    use ApiResponse;

    protected TimeEntryService $timeEntryService;

    public function __construct(TimeEntryService $timeEntryService)
    {
        $this->timeEntryService = $timeEntryService;
    }

    /**
     * Display all time entries.
     */
    public function index(): JsonResponse
    {
        return $this->successResponse(
            $this->timeEntryService->index(),
            'Time entries retrieved successfully.'
        );
    }

    /**
     * Store a newly created time entry.
     */
    public function store(StoreTimeEntryRequest $request): JsonResponse
    {
        return $this->successResponse(
            $this->timeEntryService->store($request->validated()),
            'Time entry created successfully.',
            201
        );
    }

    /**
     * Display the specified time entry.
     */
    public function show(int $id): JsonResponse
    {
        return $this->successResponse(
            $this->timeEntryService->show($id),
            'Time entry retrieved successfully.'
        );
    }

    /**
     * Update the specified time entry.
     */
    public function update(UpdateTimeEntryRequest $request, int $id): JsonResponse
    {
        return $this->successResponse(
            $this->timeEntryService->update($id, $request->validated()),
            'Time entry updated successfully.'
        );
    }

    /**
     * Remove the specified time entry.
     */
    public function destroy(int $id): JsonResponse
    {
        $this->timeEntryService->destroy($id);

        return $this->successResponse(
            [],
            'Time entry deleted successfully.'
        );
    }

    /**
     * Start timer.
     */
    public function start(Request $request): JsonResponse
    {
        return $this->successResponse(
            $this->timeEntryService->start($request->all()),
            'Timer started successfully.'
        );
    }

    /**
     * Stop timer.
     */
    public function stop(int $id): JsonResponse
    {
        return $this->successResponse(
            $this->timeEntryService->stop($id),
            'Timer stopped successfully.'
        );
    }
}