<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;

trait ApiResponse
{
    /**
     * Return Success Response
     */
    protected function successResponse(
        mixed $data = null,
        string $message = 'Success',
        int $status = 200
    ): JsonResponse {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
        ], $status);
    }

    /**
     * Return Error Response
     */
    protected function errorResponse(
        string $message = 'Something went wrong.',
        mixed $errors = null,
        int $status = 400
    ): JsonResponse {
        return response()->json([
            'success' => false,
            'message' => $message,
            'errors' => $errors,
        ], $status);
    }

    /**
     * Validation Error Response
     */
    protected function validationResponse(
        mixed $errors,
        string $message = 'Validation failed.'
    ): JsonResponse {
        return response()->json([
            'success' => false,
            'message' => $message,
            'errors' => $errors,
        ], 422);
    }

    /**
     * Unauthorized Response
     */
    protected function unauthorizedResponse(
        string $message = 'Unauthorized.'
    ): JsonResponse {
        return response()->json([
            'success' => false,
            'message' => $message,
        ], 401);
    }

    /**
     * Not Found Response
     */
    protected function notFoundResponse(
        string $message = 'Resource not found.'
    ): JsonResponse {
        return response()->json([
            'success' => false,
            'message' => $message,
        ], 404);
    }
}