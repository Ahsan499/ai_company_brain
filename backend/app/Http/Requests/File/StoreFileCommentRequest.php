<?php

namespace App\Http\Requests\File;

use Illuminate\Foundation\Http\FormRequest;

class StoreFileCommentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('comment', $this->route('file')) ?? false;
    }

    public function rules(): array
    {
        return [
            'text' => ['required_without:body', 'nullable', 'string', 'max:2000'],
            'body' => ['required_without:text', 'nullable', 'string', 'max:2000'],
        ];
    }

    public function text(): string
    {
        $data = $this->validated();

        return (string) ($data['text'] ?? $data['body'] ?? '');
    }
}
