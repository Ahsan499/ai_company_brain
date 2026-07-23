<?php

namespace App\Http\Requests\Department;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDepartmentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Validation rules.
     */
    public function rules(): array
    {
        $departmentId = $this->route('department');

        return [
            'organization_id' => 'required|exists:organizations,id',

            'name' => 'required|string|max:255',

            'slug' => 'required|string|max:255|unique:departments,slug,' . $departmentId,

            'description' => 'nullable|string',

            'is_active' => 'nullable|boolean',
        ];
    }
}