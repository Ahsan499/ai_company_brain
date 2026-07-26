<?php

namespace App\Http\Requests\Folder;

use Illuminate\Foundation\Http\FormRequest;

class UpdateFolderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('update', $this->route('folder')) ?? false;
    }

    protected function prepareForValidation(): void
    {
        $merge = [];
        if ($this->has('parentId')) {
            $merge['parent_id'] = $this->input('parentId') ?: null;
        }
        if ($merge) {
            $this->merge($merge);
        }
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'parent_id' => ['nullable', 'exists:folders,id'],
        ];
    }
}
