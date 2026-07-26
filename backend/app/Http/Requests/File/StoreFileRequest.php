<?php

namespace App\Http\Requests\File;

use App\Enums\FileType;
use App\Models\File;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreFileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', File::class) ?? false;
    }

    protected function prepareForValidation(): void
    {
        $merge = [];
        foreach ([
            'folderId' => 'folder_id',
            'projectId' => 'project_id',
            'taskId' => 'task_id',
            'organizationId' => 'organization_id',
            'mimeLabel' => 'mime_label',
        ] as $camel => $snake) {
            if ($this->has($camel)) {
                $merge[$snake] = $this->input($camel);
            }
        }
        if ($merge) {
            $this->merge($merge);
        }
    }

    public function rules(): array
    {
        return [
            'file' => [
                'required',
                'file',
                'max:20480', // 20 MB
                'mimes:pdf,doc,docx,xls,xlsx,csv,png,jpg,jpeg,gif,webp,txt,md,json,zip,ppt,pptx',
            ],
            'name' => ['nullable', 'string', 'max:255'],
            'folder_id' => ['nullable', 'exists:folders,id'],
            'project_id' => ['nullable', 'exists:projects,id'],
            'task_id' => ['nullable', 'exists:tasks,id'],
            'organization_id' => ['nullable', 'exists:organizations,id'],
            'type' => ['nullable', Rule::enum(FileType::class)],
            'mime_label' => ['nullable', 'string', 'max:100'],
        ];
    }
}
