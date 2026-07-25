<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Meeting\StoreMeetingRequest;
use App\Http\Requests\Meeting\UpdateMeetingRequest;
use App\Services\MeetingService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;


class MeetingController extends Controller
{
    use ApiResponse;

    protected MeetingService $meetingService;

    public function __construct(MeetingService $meetingService)
    {
        $this->meetingService = $meetingService;
    }

    /**
     * Display all meetings.
     */
    // public function index(): JsonResponse
    // {
    //     return $this->successResponse(
    //         $this->meetingService->index(),
    //         'Meetings retrieved successfully.'
    //     );
    // }
    public function index(Request $request)
{
    $query = Meeting::with([
        'organization',
        'department',
        'project'
    ]);

    return MeetingResource::collection(
        $this->searchService->apply($query, $request)
    );
}

    /**
     * Store a newly created meeting.
     */
    public function store(StoreMeetingRequest $request): JsonResponse
    {
        return $this->successResponse(
            $this->meetingService->store($request->validated()),
            'Meeting created successfully.',
            201
        );
    }

    /**
     * Display the specified meeting.
     */
    public function show(int $id): JsonResponse
    {
        return $this->successResponse(
            $this->meetingService->show($id),
            'Meeting retrieved successfully.'
        );
    }

    /**
     * Update the specified meeting.
     */
    public function update(UpdateMeetingRequest $request, int $id): JsonResponse
    {
        return $this->successResponse(
            $this->meetingService->update($id, $request->validated()),
            'Meeting updated successfully.'
        );
    }

    /**
     * Remove the specified meeting.
     */
    public function destroy(int $id): JsonResponse
    {
        $this->meetingService->destroy($id);

        return $this->successResponse(
            [],
            'Meeting deleted successfully.'
        );
    }
}