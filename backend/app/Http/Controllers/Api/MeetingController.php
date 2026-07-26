<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Meeting\StoreMeetingAgendaItemRequest;
use App\Http\Requests\Meeting\StoreMeetingAttendeeRequest;
use App\Http\Requests\Meeting\StoreMeetingRequest;
use App\Http\Requests\Meeting\UpdateMeetingAgendaItemRequest;
use App\Http\Requests\Meeting\UpdateMeetingRequest;
use App\Http\Requests\Meeting\UpdateMeetingRsvpRequest;
use App\Http\Requests\Meeting\UpdateMeetingStatusRequest;
use App\Http\Resources\Meeting\MeetingAgendaItemResource;
use App\Http\Resources\Meeting\MeetingResource;
use App\Models\Meeting;
use App\Models\MeetingAgendaItem;
use App\Models\User;
use App\Services\MeetingService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MeetingController extends Controller
{
    use ApiResponse;

    public function __construct(protected MeetingService $meetingService) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Meeting::class);

        $meetings = $this->meetingService->index($request, $request->user());

        return MeetingResource::collection($meetings)
            ->additional([
                'success' => true,
                'message' => 'Meetings retrieved successfully.',
            ])
            ->response();
    }

    public function store(StoreMeetingRequest $request): JsonResponse
    {
        $meeting = $this->meetingService->store($request->validated(), $request->user());

        return $this->successResponse(
            new MeetingResource($meeting),
            'Meeting created successfully.',
            201
        );
    }

    public function show(Meeting $meeting): JsonResponse
    {
        $this->authorize('view', $meeting);

        $meeting = $this->meetingService->show($meeting);

        return $this->successResponse(
            new MeetingResource($meeting),
            'Meeting retrieved successfully.'
        );
    }

    public function update(UpdateMeetingRequest $request, Meeting $meeting): JsonResponse
    {
        $meeting = $this->meetingService->update($meeting, $request->validated());

        return $this->successResponse(
            new MeetingResource($meeting),
            'Meeting updated successfully.'
        );
    }

    public function destroy(Meeting $meeting): JsonResponse
    {
        $this->authorize('delete', $meeting);

        $this->meetingService->destroy($meeting);

        return $this->successResponse(null, 'Meeting deleted successfully.');
    }

    public function updateStatus(UpdateMeetingStatusRequest $request, Meeting $meeting): JsonResponse
    {
        $meeting = $this->meetingService->updateStatus($meeting, $request->validated('status'));

        return $this->successResponse(
            new MeetingResource($meeting),
            'Meeting status updated successfully.'
        );
    }

    public function attendees(Meeting $meeting): JsonResponse
    {
        $this->authorize('view', $meeting);

        $meeting = $this->meetingService->show($meeting);

        $data = $meeting->attendees->map(fn (User $user) => [
            'userId' => $user->id,
            'name' => $user->name,
            'initials' => $user->initials,
            'rsvpStatus' => $user->pivot->rsvp_status,
        ]);

        return $this->successResponse($data, 'Attendees retrieved successfully.');
    }

    public function addAttendee(StoreMeetingAttendeeRequest $request, Meeting $meeting): JsonResponse
    {
        $meeting = $this->meetingService->addAttendee($meeting, (int) $request->validated('user_id'));

        return $this->successResponse(
            new MeetingResource($meeting),
            'Attendee added successfully.',
            201
        );
    }

    public function removeAttendee(Meeting $meeting, User $user): JsonResponse
    {
        $this->authorize('manageAttendees', $meeting);

        $meeting = $this->meetingService->removeAttendee($meeting, $user->id);

        return $this->successResponse(
            new MeetingResource($meeting),
            'Attendee removed successfully.'
        );
    }

    public function updateRsvp(UpdateMeetingRsvpRequest $request, Meeting $meeting, User $user): JsonResponse
    {
        $meeting = $this->meetingService->updateRsvp(
            $meeting,
            $user->id,
            $request->validated('rsvp_status')
        );

        return $this->successResponse(
            new MeetingResource($meeting),
            'RSVP updated successfully.'
        );
    }

    public function storeAgendaItem(StoreMeetingAgendaItemRequest $request, Meeting $meeting): JsonResponse
    {
        $item = $this->meetingService->createAgendaItem($meeting, $request->validated());

        return $this->successResponse(
            new MeetingAgendaItemResource($item),
            'Agenda item created successfully.',
            201
        );
    }

    public function showAgendaItem(Meeting $meeting, MeetingAgendaItem $agendaItem): JsonResponse
    {
        $this->authorize('view', $meeting);
        abort_unless((int) $agendaItem->meeting_id === (int) $meeting->id, 404);

        return $this->successResponse(
            new MeetingAgendaItemResource($agendaItem),
            'Agenda item retrieved successfully.'
        );
    }

    public function updateAgendaItem(UpdateMeetingAgendaItemRequest $request, Meeting $meeting, MeetingAgendaItem $agendaItem): JsonResponse
    {
        $item = $this->meetingService->updateAgendaItem($meeting, $agendaItem, $request->validated());

        return $this->successResponse(
            new MeetingAgendaItemResource($item),
            'Agenda item updated successfully.'
        );
    }

    public function destroyAgendaItem(Meeting $meeting, MeetingAgendaItem $agendaItem): JsonResponse
    {
        $this->authorize('manageAgenda', $meeting);

        $this->meetingService->deleteAgendaItem($meeting, $agendaItem);

        return $this->successResponse(null, 'Agenda item deleted successfully.');
    }
}
