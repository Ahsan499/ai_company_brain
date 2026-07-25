<?php

namespace App\Services;

use App\Http\Resources\TimeEntry\TimeEntryResource;
use App\Models\TimeEntry;
use Carbon\Carbon;

class TimeEntryService
{
    /**
     * Display all time entries.
     */
    public function index()
    {
        $timeEntries = TimeEntry::with([
            'organization',
            'project',
            'task',
            'user',
        ])->latest()->paginate(10);

        return TimeEntryResource::collection($timeEntries);
    }

    /**
     * Store a new time entry.
     */
    public function store(array $data)
    {
        if (!empty($data['end_time'])) {

            $start = Carbon::parse($data['start_time']);
            $end = Carbon::parse($data['end_time']);

            $data['duration'] = $start->diffInMinutes($end);
        }

        $timeEntry = TimeEntry::create($data);

        $timeEntry->load([
            'organization',
            'project',
            'task',
            'user',
        ]);

        return new TimeEntryResource($timeEntry);
    }

    /**
     * Show a single time entry.
     */
    public function show(int $id)
    {
        $timeEntry = TimeEntry::with([
            'organization',
            'project',
            'task',
            'user',
        ])->findOrFail($id);

        return new TimeEntryResource($timeEntry);
    }

    /**
     * Update a time entry.
     */
    public function update(int $id, array $data)
    {
        $timeEntry = TimeEntry::findOrFail($id);

        if (
            isset($data['start_time']) &&
            isset($data['end_time'])
        ) {
            $start = Carbon::parse($data['start_time']);
            $end = Carbon::parse($data['end_time']);

            $data['duration'] = $start->diffInMinutes($end);
        }

        $timeEntry->update($data);

        $timeEntry->load([
            'organization',
            'project',
            'task',
            'user',
        ]);

        return new TimeEntryResource($timeEntry);
    }

    /**
     * Delete a time entry.
     */
    public function destroy(int $id): bool
    {
        $timeEntry = TimeEntry::findOrFail($id);

        $timeEntry->delete();

        return true;
    }

    /**
     * Start timer.
     */
    public function start(array $data)
    {
        $data['start_time'] = now();
        $data['end_time'] = null;
        $data['duration'] = 0;

        $timeEntry = TimeEntry::create($data);

        $timeEntry->load([
            'organization',
            'project',
            'task',
            'user',
        ]);

        return new TimeEntryResource($timeEntry);
    }

    /**
     * Stop timer.
     */
    public function stop(int $id)
    {
        $timeEntry = TimeEntry::findOrFail($id);

        $timeEntry->end_time = now();

        $timeEntry->duration = Carbon::parse(
            $timeEntry->start_time
        )->diffInMinutes(now());

        $timeEntry->save();

        $timeEntry->load([
            'organization',
            'project',
            'task',
            'user',
        ]);

        return new TimeEntryResource($timeEntry);
    }
}