<?php

namespace App\Http\Controllers;

use App\Http\Requests\Department\StoreDepartmentRequest;
use App\Http\Requests\Department\UpdateDepartmentRequest;
use App\Services\DepartmentService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class DepartmentController extends Controller
{
    use ApiResponse;

    protected DepartmentService $departmentService;

    public function __construct(DepartmentService $departmentService)
    {
        $this->departmentService = $departmentService;
    }

    /**
     * Display all departments.
     */
    public function index(): JsonResponse
    {
        $departments = $this->departmentService->index();

        return $this->successResponse(
            $departments,
            'Departments retrieved successfully.'
        );
    }

    /**
     * Store a newly created department.
     */
    public function store(StoreDepartmentRequest $request): JsonResponse
    {
        $department = $this->departmentService->store(
            $request->validated()
        );

        return $this->successResponse(
            $department,
            'Department created successfully.',
            201
        );
    }

    /**
     * Display the specified department.
     */
    public function show(int $id): JsonResponse
    {
        $department = $this->departmentService->show($id);

        return $this->successResponse(
            $department,
            'Department retrieved successfully.'
        );
    }

    /**
     * Update the specified department.
     */
    public function update(UpdateDepartmentRequest $request, int $id): JsonResponse
    {
        $department = $this->departmentService->update(
            $id,
            $request->validated()
        );

        return $this->successResponse(
            $department,
            'Department updated successfully.'
        );
    }

    /**
     * Remove the specified department.
     */
    public function destroy(int $id): JsonResponse
    {
        $this->departmentService->destroy($id);

        return $this->successResponse(
            [],
            'Department deleted successfully.'
        );
    }
}