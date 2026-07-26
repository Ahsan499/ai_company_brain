<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\StoreUserRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Http\Resources\Project\ProjectResource;
use App\Http\Resources\Task\TaskResource;
use App\Http\Resources\User\UserResource;
use App\Models\User;
use App\Services\UserService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    use ApiResponse;

    public function __construct(protected UserService $userService) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', User::class);

        $users = $this->userService->index($request, $request->user());

        return UserResource::collection($users)
            ->additional([
                'success' => true,
                'message' => 'Users retrieved successfully.',
            ])
            ->response();
    }

    public function store(StoreUserRequest $request): JsonResponse
    {
        $user = $this->userService->store($request->validated());

        return $this->successResponse(
            new UserResource($user),
            'User created successfully.',
            201
        );
    }

    public function show(User $user): JsonResponse
    {
        $this->authorize('view', $user);

        $user = $this->userService->show($user);

        return $this->successResponse(
            new UserResource($user),
            'User retrieved successfully.'
        );
    }

    public function update(UpdateUserRequest $request, User $user): JsonResponse
    {
        $user = $this->userService->update($user, $request->validated());

        return $this->successResponse(
            new UserResource($user),
            'User updated successfully.'
        );
    }

    public function destroy(User $user): JsonResponse
    {
        $this->authorize('delete', $user);

        $this->userService->destroy($user);

        return $this->successResponse(null, 'User deleted successfully.');
    }

    public function tasks(Request $request, User $user): JsonResponse
    {
        $this->authorize('viewTasks', $user);

        $perPage = min(max((int) $request->integer('per_page', 20), 1), 100);

        $tasks = $user->assignedTasks()
            ->with(['project', 'organization', 'department', 'assignee', 'creator', 'subtasks', 'comments.author'])
            ->latest('id')
            ->paginate($perPage);

        return TaskResource::collection($tasks)
            ->additional([
                'success' => true,
                'message' => 'User tasks retrieved successfully.',
            ])
            ->response();
    }

    public function projects(Request $request, User $user): JsonResponse
    {
        $this->authorize('viewProjects', $user);

        $perPage = min(max((int) $request->integer('per_page', 20), 1), 100);

        $projects = $user->projects()
            ->with(['organization', 'department', 'members', 'milestones', 'tasks'])
            ->withCount('tasks')
            ->latest('projects.id')
            ->paginate($perPage);

        return ProjectResource::collection($projects)
            ->additional([
                'success' => true,
                'message' => 'User projects retrieved successfully.',
            ])
            ->response();
    }
}
