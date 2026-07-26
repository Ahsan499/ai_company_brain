<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\File\StoreFileCommentRequest;
use App\Http\Requests\File\StoreFileRequest;
use App\Http\Requests\File\UpdateFileRequest;
use App\Http\Resources\File\FileResource;
use App\Models\File;
use App\Services\FileService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class FileController extends Controller
{
    use ApiResponse;

    public function __construct(protected FileService $fileService) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', File::class);

        $files = $this->fileService->index($request, $request->user());

        return FileResource::collection($files)
            ->additional([
                'success' => true,
                'message' => 'Files retrieved successfully.',
            ])
            ->response();
    }

    public function store(StoreFileRequest $request): JsonResponse
    {
        $file = $this->fileService->store(
            $request->validated(),
            $request->user(),
            $request->file('file')
        );

        return $this->successResponse(
            new FileResource($file),
            'File uploaded successfully.',
            201
        );
    }

    public function show(File $file): JsonResponse
    {
        $this->authorize('view', $file);

        $file = $this->fileService->show($file);

        return $this->successResponse(
            new FileResource($file),
            'File retrieved successfully.'
        );
    }

    public function update(UpdateFileRequest $request, File $file): JsonResponse
    {
        $file = $this->fileService->update(
            $file,
            $request->validated(),
            $request->file('file')
        );

        return $this->successResponse(
            new FileResource($file),
            'File updated successfully.'
        );
    }

    public function destroy(File $file): JsonResponse
    {
        $this->authorize('delete', $file);

        $this->fileService->destroy($file);

        return $this->successResponse(null, 'File deleted successfully.');
    }

    public function download(File $file): StreamedResponse
    {
        $this->authorize('download', $file);

        return $this->fileService->download($file);
    }

    public function comments(File $file): JsonResponse
    {
        $this->authorize('view', $file);

        return $this->successResponse(
            $this->fileService->comments($file),
            'File comments retrieved successfully.'
        );
    }

    public function storeComment(StoreFileCommentRequest $request, File $file): JsonResponse
    {
        $comment = $this->fileService->addComment($file, $request->user(), $request->text());

        return $this->successResponse($comment, 'Comment added successfully.', 201);
    }
}
