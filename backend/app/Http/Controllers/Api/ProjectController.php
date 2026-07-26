<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Project\StoreProjectMemberRequest;
use App\Http\Requests\Project\StoreProjectRequest;
use App\Http\Requests\Project\UpdateProjectRequest;
use App\Http\Resources\File\FileResource;
use App\Http\Resources\Project\ProjectResource;
use App\Http\Resources\Task\TaskResource;
use App\Http\Resources\Team\TeamResource;
use App\Models\Project;
use App\Models\User;
use App\Services\FileService;
use App\Services\ProjectService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    use ApiResponse;

    public function __construct(protected ProjectService $projectService) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Project::class);

        $projects = $this->projectService->index($request, $request->user());

        return ProjectResource::collection($projects)
            ->additional([
                'success' => true,
                'message' => 'Projects retrieved successfully.',
            ])
            ->response();
    }

    public function store(StoreProjectRequest $request): JsonResponse
    {
        $project = $this->projectService->store($request->validated(), $request->user());

        return $this->successResponse(
            new ProjectResource($project),
            'Project created successfully.',
            201
        );
    }

    public function show(Project $project): JsonResponse
    {
        $this->authorize('view', $project);

        $project = $this->projectService->show($project);

        return $this->successResponse(
            new ProjectResource($project),
            'Project retrieved successfully.'
        );
    }

    public function update(UpdateProjectRequest $request, Project $project): JsonResponse
    {
        $project = $this->projectService->update($project, $request->validated());

        return $this->successResponse(
            new ProjectResource($project),
            'Project updated successfully.'
        );
    }

    public function destroy(Project $project): JsonResponse
    {
        $this->authorize('delete', $project);

        $this->projectService->destroy($project);

        return $this->successResponse(null, 'Project deleted successfully.');
    }

    public function members(Request $request, Project $project): JsonResponse
    {
        $this->authorize('viewMembers', $project);

        $perPage = min(max((int) $request->integer('per_page', 20), 1), 100);

        $members = $project->members()
            ->orderBy('users.name')
            ->paginate($perPage);

        $data = collect($members->items())->map(fn (User $user) => [
            'userId' => $user->id,
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'initials' => $user->initials,
            'projectRole' => $user->pivot->role_in_project,
            'roleInProject' => $user->pivot->role_in_project,
            'status' => $user->status?->value ?? $user->status,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Project members retrieved successfully.',
            'data' => $data,
            'meta' => [
                'current_page' => $members->currentPage(),
                'last_page' => $members->lastPage(),
                'per_page' => $members->perPage(),
                'total' => $members->total(),
            ],
        ]);
    }

    public function addMember(StoreProjectMemberRequest $request, Project $project): JsonResponse
    {
        $validated = $request->validated();
        $project = $this->projectService->addMember(
            $project,
            (int) $validated['user_id'],
            $validated['role_in_project'] ?? null
        );

        return $this->successResponse(
            new ProjectResource($project),
            'Project member added successfully.',
            201
        );
    }

    public function removeMember(Project $project, User $user): JsonResponse
    {
        $this->authorize('manageMembers', $project);

        $project = $this->projectService->removeMember($project, $user->id);

        return $this->successResponse(
            new ProjectResource($project),
            'Project member removed successfully.'
        );
    }

    public function tasks(Request $request, Project $project): JsonResponse
    {
        $this->authorize('viewTasks', $project);

        $perPage = min(max((int) $request->integer('per_page', 20), 1), 100);

        $tasks = $project->tasks()
            ->with(['project', 'organization', 'department', 'assignee', 'creator', 'subtasks'])
            ->withCount([
                'subtasks',
                'subtasks as subtasks_done_count' => fn ($q) => $q->where('done', true),
                'comments',
            ])
            ->latest('id')
            ->paginate($perPage);

        return TaskResource::collection($tasks)
            ->additional([
                'success' => true,
                'message' => 'Project tasks retrieved successfully.',
            ])
            ->response();
    }

    public function teams(Request $request, Project $project): JsonResponse
    {
        $this->authorize('viewTeams', $project);

        $perPage = min(max((int) $request->integer('per_page', 20), 1), 100);

        $teams = $project->teams()
            ->with(['organization', 'department', 'lead', 'members', 'projects'])
            ->withCount(['members', 'projects'])
            ->latest('teams.id')
            ->paginate($perPage);

        return TeamResource::collection($teams)
            ->additional([
                'success' => true,
                'message' => 'Project teams retrieved successfully.',
            ])
            ->response();
    }

    public function files(Request $request, Project $project): JsonResponse
    {
        $this->authorize('viewFiles', $project);

        $files = app(FileService::class)->forProject($project, $request);

        return FileResource::collection($files)
            ->additional([
                'success' => true,
                'message' => 'Project files retrieved successfully.',
            ])
            ->response();
    }
}
