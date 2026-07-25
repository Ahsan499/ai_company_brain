<?php

namespace App\Http\Resources\Attachment;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AttachmentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,

            'organization' => [
                'id' => $this->organization?->id,
                'name' => $this->organization?->name,
            ],

            'attachable_type' => class_basename($this->attachable_type),
            'attachable_id' => $this->attachable_id,

            'original_name' => $this->original_name,
            'file_name' => $this->file_name,
            'file_path' => $this->file_path,
            'file_url' => asset('storage/' . $this->file_path),

            'mime_type' => $this->mime_type,
            'file_size' => $this->file_size,

            'uploaded_by' => [
                'id' => $this->uploader?->id,
                'name' => $this->uploader?->first_name . ' ' . $this->uploader?->last_name,
            ],

            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}