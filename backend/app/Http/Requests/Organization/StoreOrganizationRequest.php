<?php

namespace App\Http\Requests\Organization;

use App\Enums\OrganizationPlan;
use App\Enums\OrganizationStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreOrganizationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', \App\Models\Organization::class) ?? false;
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
        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:organizations,slug'],
            'industry' => ['nullable', 'string', 'max:255'],
            'size' => ['nullable', 'string', 'max:50'],
            'plan' => ['nullable', Rule::enum(OrganizationPlan::class)],
            'status' => ['nullable', Rule::enum(OrganizationStatus::class)],
            'website' => ['nullable', 'string', 'max:255'],
            'location' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'owner_email' => ['nullable', 'email'],
            'owner_id' => ['nullable', 'exists:users,id'],
            'initials' => ['nullable', 'string', 'max:10'],
        ];
    }
}
