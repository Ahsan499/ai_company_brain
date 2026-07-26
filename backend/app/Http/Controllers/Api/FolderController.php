<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Folder\StoreFolderRequest;
use App\Http\Requests\Folder\UpdateFolderRequest;
use App\Http\Resources\File\FileResource;
use App\Http\Resources\Folder\FolderResource;
use App\Models\Folder;
use App\Services\FolderService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FolderController extends Controller
{
    use ApiResponse;

    public function __construct(protected FolderService $folderService) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Folder::class);

        $folders = $this->folderService->index($request, $request->user());

        return FolderResource::collection($folders)
            ->additional([
                'success' => true,
                'message' => 'Folders retrieved successfully.',
            ])
            ->response();
    }

    public function store(StoreFolderRequest $request): JsonResponse
    {
        $folder = $this->folderService->store($request->validated(), $request->user());

        return $this->successResponse(
            new FolderResource($folder),
            'Folder created successfully.',
            201
        );
    }

    public function show(Folder $folder): JsonResponse
    {
        $this->authorize('view', $folder);

        $folder = $this->folderService->show($folder);

        return $this->successResponse(
            new FolderResource($folder),
            'Folder retrieved successfully.'
        );
    }

    public function update(UpdateFolderRequest $request, Folder $folder): JsonResponse
    {
        $folder = $this->folderService->update($folder, $request->validated());

        return $this->successResponse(
            new FolderResource($folder),
            'Folder updated successfully.'
        );
    }

    public function destroy(Folder $folder): JsonResponse
    {
        $this->authorize('delete', $folder);

        $this->folderService->destroy($folder);

        return $this->successResponse(null, 'Folder deleted successfully.');
    }

    public function contents(Folder $folder): JsonResponse
    {
        $this->authorize('view', $folder);

        $payload = $this->folderService->contents($folder);

        return $this->successResponse([
            'folder' => new FolderResource($payload['folder']),
            'breadcrumb' => $payload['breadcrumb'],
            'folders' => FolderResource::collection($payload['folders']),
            'files' => FileResource::collection($payload['files']),
        ], 'Folder contents retrieved successfully.');
    }
}
