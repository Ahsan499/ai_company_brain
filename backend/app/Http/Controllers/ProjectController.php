<?php

namespace App\Http\Controllers;

use App\Http\Requests\Project\StoreProjectRequest;
use App\Http\Requests\Project\UpdateProjectRequest;
use App\Services\ProjectService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class ProjectController extends Controller
{
    use ApiResponse;

    protected ProjectService $projectService;

    public function __construct(ProjectService $projectService)
    {
        $this->projectService = $projectService;
    }

    /**
     * Display all projects.
     */
    public function index(): JsonResponse
    {
        $projects = $this->projectService->index();

        return $this->successResponse(
            $projects,
            'Projects retrieved successfully.'
        );
    }

    /**
     * Store a newly created project.
     */
    public function store(StoreProjectRequest $request): JsonResponse
    {
        $project = $this->projectService->store(
            $request->validated()
        );

        return $this->successResponse(
            $project,
            'Project created successfully.',
            201
        );
    }

    /**
     * Display the specified project.
     */
    public function show(int $id): JsonResponse
    {
        $project = $this->projectService->show($id);

        return $this->successResponse(
            $project,
            'Project retrieved successfully.'
        );
    }

    /**
     * Update the specified project.
     */
    public function update(UpdateProjectRequest $request, int $id): JsonResponse
    {
        $project = $this->projectService->update(
            $id,
            $request->validated()
        );

        return $this->successResponse(
            $project,
            'Project updated successfully.'
        );
    }

    /**
     * Remove the specified project.
     */
    public function destroy(int $id): JsonResponse
    {
        $this->projectService->destroy($id);

        return $this->successResponse(
            [],
            'Project deleted successfully.'
        );
    }
}