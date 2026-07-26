<?php

namespace App\Http\Requests\Folder;

use App\Models\Folder;
use Illuminate\Foundation\Http\FormRequest;

class StoreFolderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', Folder::class) ?? false;
    }

    protected function prepareForValidation(): void
    {
        $merge = [];
        if ($this->has('parentId')) {
            $merge['parent_id'] = $this->input('parentId') ?: null;
        }
        if ($this->has('organizationId')) {
            $merge['organization_id'] = $this->input('organizationId');
        }
        if ($merge) {
            $this->merge($merge);
        }
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'parent_id' => ['nullable', 'exists:folders,id'],
            'organization_id' => ['nullable', 'exists:organizations,id'],
        ];
    }
}
