<?php

namespace App\Services;

use App\Models\Attachment;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class AttachmentService
{
    public function getAll()
    {
        return Attachment::with([
            'organization',
            'uploader',
            'attachable',
        ])->latest()->get();
    }

    public function find(int $id)
    {
        return Attachment::with([
            'organization',
            'uploader',
            'attachable',
        ])->findOrFail($id);
    }

    public function create(array $data): Attachment
    {
        /** @var UploadedFile $file */
        $file = $data['file'];

        $path = $file->store('uploads', 'public');

        return Attachment::create([
            'organization_id' => $data['organization_id'],
            'attachable_type' => $data['attachable_type'],
            'attachable_id' => $data['attachable_id'],

            'original_name' => $file->getClientOriginalName(),
            'file_name' => basename($path),
            'file_path' => $path,
            'mime_type' => $file->getClientMimeType(),
            'file_size' => $file->getSize(),

            'uploaded_by' => auth()->id(),
        ]);
    }

    public function update(Attachment $attachment, array $data): Attachment
    {
        $attachment->update([
            'organization_id' => $data['organization_id'],
            'attachable_type' => $data['attachable_type'],
            'attachable_id' => $data['attachable_id'],
        ]);

        return $attachment->fresh([
            'organization',
            'uploader',
            'attachable',
        ]);
    }

    public function delete(Attachment $attachment): bool
    {
        if (
            $attachment->file_path &&
            Storage::disk('public')->exists($attachment->file_path)
        ) {
            Storage::disk('public')->delete($attachment->file_path);
        }

        return $attachment->delete();
    }
}