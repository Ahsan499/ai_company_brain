<?php

namespace App\Http\Requests\Organization;

use App\Enums\OrganizationPlan;
use App\Enums\OrganizationStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateOrganizationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('update', $this->route('organization')) ?? false;
    }

    protected function prepareForValidation(): void
    {
        $merge = [];
        if ($this->has('ownerEmail')) {
            $merge['owner_email'] = $this->input('ownerEmail');
        }
        if ($this->has('ownerId')) {
            $merge['owner_id'] = $this->input('ownerId');
        }
        if ($merge) {
            $this->merge($merge);
        }
    }

    public function rules(): array
    {
        $organization = $this->route('organization');
        $id = is_object($organization) ? $organization->id : $organization;

        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'slug' => ['sometimes', 'nullable', 'string', 'max:255', Rule::unique('organizations', 'slug')->ignore($id)],
            'industry' => ['sometimes', 'nullable', 'string', 'max:255'],
            'size' => ['sometimes', 'nullable', 'string', 'max:50'],
            'plan' => ['sometimes', 'nullable', Rule::enum(OrganizationPlan::class)],
            'status' => ['sometimes', 'nullable', Rule::enum(OrganizationStatus::class)],
            'website' => ['sometimes', 'nullable', 'string', 'max:255'],
            'location' => ['sometimes', 'nullable', 'string', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string'],
            'owner_email' => ['sometimes', 'nullable', 'email'],
            'owner_id' => ['sometimes', 'nullable', 'exists:users,id'],
            'initials' => ['sometimes', 'nullable', 'string', 'max:10'],
        ];
    }
}
