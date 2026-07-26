<?php

namespace App\Http\Requests\Task;

use Illuminate\Foundation\Http\FormRequest;

class StoreTaskCommentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('createComment', $this->route('task')) ?? false;
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('text') && ! $this->has('body')) {
            $this->merge(['body' => $this->input('text')]);
        }
    }

    public function rules(): array
    {
        return [
            'body' => ['required', 'string'],
        ];
    }
}
