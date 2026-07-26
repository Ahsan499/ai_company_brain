<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Department\StoreDepartmentRequest;
use App\Http\Requests\Department\UpdateDepartmentRequest;
use App\Http\Resources\Department\DepartmentResource;
use App\Http\Resources\Project\ProjectResource;
use App\Http\Resources\Team\TeamResource;
use App\Http\Resources\User\UserResource;
use App\Models\Department;
use App\Services\DepartmentService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
    use ApiResponse;

    public function __construct(protected DepartmentService $departmentService) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Department::class);

        $departments = $this->departmentService->index($request, $request->user());

        return DepartmentResource::collection($departments)
            ->additional([
                'success' => true,
                'message' => 'Departments retrieved successfully.',
            ])
            ->response();
    }

    public function store(StoreDepartmentRequest $request): JsonResponse
    {
        $department = $this->departmentService->store($request->validated());

        return $this->successResponse(
            new DepartmentResource($department),
            'Department created successfully.',
            201
        );
    }

    public function show(Department $department): JsonResponse
    {
        $this->authorize('view', $department);

        $department = $this->departmentService->show($department);

        return $this->successResponse(
            new DepartmentResource($department),
            'Department retrieved successfully.'
        );
    }

    public function update(UpdateDepartmentRequest $request, Department $department): JsonResponse
    {
        $department = $this->departmentService->update($department, $request->validated());

        return $this->successResponse(
            new DepartmentResource($department),
            'Department updated successfully.'
        );
    }

    public function destroy(Department $department): JsonResponse
    {
        $this->authorize('delete', $department);

        $this->departmentService->destroy($department);

        return $this->successResponse(null, 'Department deleted successfully.');
    }

    public function members(Request $request, Department $department): JsonResponse
    {
        $this->authorize('viewMembers', $department);

        $perPage = min(max((int) $request->integer('per_page', 20), 1), 100);

        $members = $department->members()
            ->with(['organization', 'department', 'manager', 'teams', 'roles'])
            ->withCount(['assignedTasks', 'projects'])
            ->latest('users.id')
            ->paginate($perPage);

        return UserResource::collection($members)
            ->additional([
                'success' => true,
                'message' => 'Department members retrieved successfully.',
            ])
            ->response();
    }

    public function teams(Request $request, Department $department): JsonResponse
    {
        $this->authorize('viewTeams', $department);

        $perPage = min(max((int) $request->integer('per_page', 20), 1), 100);

        $teams = $department->teams()
            ->with(['organization', 'department', 'lead', 'members', 'projects'])
            ->withCount(['members', 'projects'])
            ->latest('id')
            ->paginate($perPage);

        return TeamResource::collection($teams)
            ->additional([
                'success' => true,
                'message' => 'Department teams retrieved successfully.',
            ])
            ->response();
    }

    public function projects(Request $request, Department $department): JsonResponse
    {
        $this->authorize('viewProjects', $department);

        $perPage = min(max((int) $request->integer('per_page', 20), 1), 100);

        $projects = $department->projects()
            ->with(['organization', 'department', 'members', 'milestones', 'tasks'])
            ->withCount('tasks')
            ->latest('id')
            ->paginate($perPage);

        return ProjectResource::collection($projects)
            ->additional([
                'success' => true,
                'message' => 'Department projects retrieved successfully.',
            ])
            ->response();
    }
}
