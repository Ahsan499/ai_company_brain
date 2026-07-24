<?php

namespace App\Services;

use App\Http\Resources\Project\ProjectResource;
use App\Models\Project;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProjectService
{
    /**
     * Display all projects.
     */
    public function index()
    {
        $projects = Project::with([
            'organization',
            'department',
            'users'
        ])->latest()->paginate(10);

        return ProjectResource::collection($projects);
    }

    /**
     * Store a newly created project.
     */
    public function store(array $data)
    {
        return DB::transaction(function () use ($data) {

            $users = $data['users'] ?? [];
            unset($data['users']);

            if (empty($data['slug'])) {
                $data['slug'] = Str::slug($data['name']);
            }

            $project = Project::create($data);

            if (!empty($users)) {
                $project->users()->attach($users);
            }

            $project->load([
                'organization',
                'department',
                'users'
            ]);

            return new ProjectResource($project);
        });
    }

    /**
     * Display the specified project.
     */
    public function show(int $id)
    {
        $project = Project::with([
            'organization',
            'department',
            'users'
        ])->findOrFail($id);

        return new ProjectResource($project);
    }

    /**
     * Update the specified project.
     */
    public function update(int $id, array $data)
    {
        return DB::transaction(function () use ($id, $data) {

            $project = Project::findOrFail($id);

            $users = $data['users'] ?? [];
            unset($data['users']);

            if (empty($data['slug'])) {
                $data['slug'] = Str::slug($data['name']);
            }

            $project->update($data);

            $project->users()->sync($users);

            $project->load([
                'organization',
                'department',
                'users'
            ]);

            return new ProjectResource($project);
        });
    }

    /**
     * Remove the specified project.
     */
    public function destroy(int $id): bool
    {
        $project = Project::findOrFail($id);

        $project->users()->detach();

        $project->delete();

        return true;
    }
}