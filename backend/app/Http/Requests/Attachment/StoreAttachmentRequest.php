<?php

namespace App\Http\Requests\Attachment;

use Illuminate\Foundation\Http\FormRequest;

class StoreAttachmentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'organization_id' => [
                'required',
                'exists:organizations,id',
            ],

            'attachable_type' => [
                'required',
                'string',
            ],

            'attachable_id' => [
                'required',
                'integer',
            ],

            'file' => [
                'required',
                'file',
                'max:10240', // 10 MB
            ],
        ];
    }
}