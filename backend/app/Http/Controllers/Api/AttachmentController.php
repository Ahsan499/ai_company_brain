<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Attachment\StoreAttachmentRequest;
use App\Http\Requests\Attachment\UpdateAttachmentRequest;
use App\Http\Resources\Attachment\AttachmentResource;
use App\Models\Attachment;
use App\Services\AttachmentService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class AttachmentController extends Controller
{
    use ApiResponse;

    protected AttachmentService $attachmentService;

    public function __construct(AttachmentService $attachmentService)
    {
        $this->attachmentService = $attachmentService;
    }

    /**
     * Display a listing.
     */
    public function index(): JsonResponse
    {
        return $this->successResponse(
            AttachmentResource::collection(
                $this->attachmentService->getAll()
            ),
            'Attachments retrieved successfully.'
        );
    }

    /**
     * Store a newly created attachment.
     */
    public function store(StoreAttachmentRequest $request): JsonResponse
    {
        return $this->successResponse(
            new AttachmentResource(
                $this->attachmentService->create(
                    $request->validated()
                )
            ),
            'Attachment uploaded successfully.',
            201
        );
    }

    /**
     * Display the specified attachment.
     */
    public function show(Attachment $attachment): JsonResponse
    {
        return $this->successResponse(
            new AttachmentResource(
                $this->attachmentService->find($attachment->id)
            ),
            'Attachment retrieved successfully.'
        );
    }

    /**
     * Update the specified attachment.
     */
    public function update(
        UpdateAttachmentRequest $request,
        Attachment $attachment
    ): JsonResponse {
        return $this->successResponse(
            new AttachmentResource(
                $this->attachmentService->update(
                    $attachment,
                    $request->validated()
                )
            ),
            'Attachment updated successfully.'
        );
    }

    /**
     * Remove the specified attachment.
     */
    public function destroy(Attachment $attachment): JsonResponse
    {
        $this->attachmentService->delete($attachment);

        return $this->successResponse(
            [],
            'Attachment deleted successfully.'
        );
    }
}