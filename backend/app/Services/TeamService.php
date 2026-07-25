<?php

namespace App\Services;

use App\Http\Resources\Team\TeamResource;
use App\Models\Team;

class TeamService
{
    /**
     * Display all teams.
     */
    public function index()
    {
        $teams = Team::with([
            'organization',
            'department',
            'users',
            'projects',
        ])->latest()->paginate(10);

        return TeamResource::collection($teams);
    }

    /**
     * Store a newly created team.
     */
    public function store(array $data)
    {
        $users = $data['users'] ?? [];
        $projects = $data['projects'] ?? [];

        unset($data['users'], $data['projects']);

        $team = Team::create($data);

        $team->users()->sync($users);
        $team->projects()->sync($projects);

        $team->load([
            'organization',
            'department',
            'users',
            'projects',
        ]);

        return new TeamResource($team);
    }

    /**
     * Display the specified team.
     */
    public function show(int $id)
    {
        $team = Team::with([
            'organization',
            'department',
            'users',
            'projects',
        ])->findOrFail($id);

        return new TeamResource($team);
    }

    /**
     * Update the specified team.
     */
    public function update(int $id, array $data)
    {
        $team = Team::findOrFail($id);

        $users = $data['users'] ?? [];
        $projects = $data['projects'] ?? [];

        unset($data['users'], $data['projects']);

        $team->update($data);

        $team->users()->sync($users);
        $team->projects()->sync($projects);

        $team->load([
            'organization',
            'department',
            'users',
            'projects',
        ]);

        return new TeamResource($team);
    }

    /**
     * Remove the specified team.
     */
    public function destroy(int $id): bool
    {
        $team = Team::findOrFail($id);

        $team->users()->detach();
        $team->projects()->detach();

        $team->delete();

        return true;
    }
}