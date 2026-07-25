<?php

namespace App\Services;

use App\Http\Resources\Meeting\MeetingResource;
use App\Models\Meeting;
use Illuminate\Http\Request;

class MeetingService
{
    protected SearchService $searchService;

    public function __construct(SearchService $searchService)
    {
        $this->searchService = $searchService;
    }

    /**
     * Display all meetings.
     */
    public function index(Request $request)
    {
        $query = Meeting::with([
            'organization',
            'department',
            'project',
            'team',
        ]);

        return MeetingResource::collection(
            $this->searchService->apply($query, $request)
        );
    }

    /**
     * Store a newly created meeting.
     */
    public function store(array $data)
    {
        $meeting = Meeting::create($data);

        $meeting->load([
            'organization',
            'department',
            'project',
            'team',
        ]);

        return new MeetingResource($meeting);
    }

    /**
     * Display the specified meeting.
     */
    public function show(int $id)
    {
        $meeting = Meeting::with([
            'organization',
            'department',
            'project',
            'team',
        ])->findOrFail($id);

        return new MeetingResource($meeting);
    }

    /**
     * Update the specified meeting.
     */
    public function update(int $id, array $data)
    {
        $meeting = Meeting::findOrFail($id);

        $meeting->update($data);

        $meeting->load([
            'organization',
            'department',
            'project',
            'team',
        ]);

        return new MeetingResource($meeting);
    }

    /**
     * Remove the specified meeting.
     */
    public function destroy(int $id): bool
    {
        $meeting = Meeting::findOrFail($id);

        $meeting->delete();

        return true;
    }
}