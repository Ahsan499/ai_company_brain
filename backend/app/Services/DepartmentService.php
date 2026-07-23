<?php

namespace App\Services;

use App\Http\Resources\Department\DepartmentResource;
use App\Models\Department;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class DepartmentService
{
    /**
     * Display all departments.
     */
    public function index()
    {
        $departments = Department::with('organization')
            ->latest()
            ->paginate(10);

        return DepartmentResource::collection($departments);
    }

    /**
     * Store a newly created department.
     */
    public function store(array $data)
    {
        return DB::transaction(function () use ($data) {

            if (empty($data['slug'])) {
                $data['slug'] = Str::slug($data['name']);
            }

            $department = Department::create($data);

            $department->load('organization');

            return new DepartmentResource($department);
        });
    }

    /**
     * Display the specified department.
     */
    public function show(int $id)
    {
        $department = Department::with('organization')
            ->findOrFail($id);

        return new DepartmentResource($department);
    }

    /**
     * Update the specified department.
     */
    public function update(int $id, array $data)
    {
        return DB::transaction(function () use ($id, $data) {

            $department = Department::findOrFail($id);

            if (empty($data['slug'])) {
                $data['slug'] = Str::slug($data['name']);
            }

            $department->update($data);

            $department->load('organization');

            return new DepartmentResource($department);
        });
    }

    /**
     * Remove the specified department.
     */
    public function destroy(int $id): bool
    {
        $department = Department::findOrFail($id);

        $department->delete();

        return true;
    }
}