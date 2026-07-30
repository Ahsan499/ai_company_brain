<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class BrainController extends Controller
{
    use ApiResponse;

    private function brainUrl(string $path = ''): string
    {
        $base = rtrim((string) config('services.ai_brain.url', 'http://127.0.0.1:8001'), '/');

        return $base.$path;
    }

    private function brainUnavailable(ConnectionException $e): JsonResponse
    {
        return $this->errorResponse(
            'Knowledge service is unreachable. Start ai-brain-service on port 8001.',
            ['detail' => $e->getMessage()],
            503
        );
    }

    public function health(): JsonResponse
    {
        try {
            $response = Http::timeout(10)->get($this->brainUrl('/health'));
        } catch (ConnectionException $e) {
            return $this->brainUnavailable($e);
        }

        if (! $response->successful()) {
            return $this->errorResponse(
                'Knowledge service health check failed.',
                $response->json(),
                $response->status()
            );
        }

        return $this->successResponse($response->json(), 'Knowledge service healthy.');
    }

    public function status(): JsonResponse
    {
        try {
            $response = Http::timeout(30)->get($this->brainUrl('/ingestion/status'));
        } catch (ConnectionException $e) {
            return $this->brainUnavailable($e);
        }

        if (! $response->successful()) {
            return $this->errorResponse(
                'Failed to load knowledge base status.',
                $response->json(),
                $response->status()
            );
        }

        return $this->successResponse($response->json(), 'Knowledge base status.');
    }

    public function query(Request $request): JsonResponse
    {
        $payload = $request->validate([
            'question' => ['required', 'string', 'min:1', 'max:4000'],
            'n_results' => ['sometimes', 'integer', 'min:1', 'max:20'],
            'skip_llm' => ['sometimes', 'boolean'],
        ]);

        try {
            $response = Http::timeout(90)->post($this->brainUrl('/query'), [
                'question' => $payload['question'],
                'n_results' => $payload['n_results'] ?? 5,
                'skip_llm' => (bool) ($payload['skip_llm'] ?? false),
            ]);
        } catch (ConnectionException $e) {
            return $this->brainUnavailable($e);
        }

        if (! $response->successful()) {
            $body = $response->json();
            $detail = is_array($body)
                ? ($body['detail'] ?? $body['message'] ?? $body)
                : $response->body();

            $message = 'Knowledge query failed.';
            $detailText = is_string($detail) ? $detail : json_encode($detail);
            if (is_string($detailText) && str_contains(strtolower($detailText), 'credit')) {
                $message = 'Anthropic API credits are too low. Upgrade billing, then try again.';
            }

            return $this->errorResponse(
                $message,
                $detail,
                $response->status() >= 400 ? $response->status() : 502
            );
        }

        return $this->successResponse($response->json(), 'Knowledge query completed.');
    }

    public function ingestDriveFolder(Request $request): JsonResponse
    {
        $payload = $request->validate([
            'folder_id' => ['nullable', 'string'],
            'max_files' => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);

        $body = [
            'folder_id' => $payload['folder_id'] ?? null,
        ];
        if (isset($payload['max_files'])) {
            $body['max_files'] = $payload['max_files'];
        }

        try {
            $response = Http::timeout(180)->post($this->brainUrl('/ingestion/drive/folder'), $body);
        } catch (ConnectionException $e) {
            return $this->brainUnavailable($e);
        }

        if (! $response->successful()) {
            return $this->errorResponse(
                'Drive ingestion failed.',
                $response->json(),
                $response->status()
            );
        }

        return $this->successResponse($response->json(), 'Drive ingestion completed.');
    }

    public function ingestSlackAll(): JsonResponse
    {
        try {
            $response = Http::timeout(180)->post($this->brainUrl('/ingestion/slack/all'));
        } catch (ConnectionException $e) {
            return $this->brainUnavailable($e);
        }

        if (! $response->successful()) {
            return $this->errorResponse(
                'Slack ingestion failed.',
                $response->json(),
                $response->status()
            );
        }

        return $this->successResponse($response->json(), 'Slack ingestion completed.');
    }
}
