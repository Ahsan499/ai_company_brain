<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\OrganizationController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\Api\TeamController;
use App\Http\Controllers\Api\MeetingController;
use App\Http\Controllers\Api\TimeEntryController;
use App\Http\Controllers\Api\AttachmentController;
use App\Http\Controllers\Api\NotificationController;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

/*
|--------------------------------------------------------------------------
| Protected Routes (Sanctum)
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/me', [AuthController::class, 'me']);

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::apiResource('organizations', OrganizationController::class);
    Route::apiResource('users', UserController::class);
    Route::apiResource('departments', DepartmentController::class);
    Route::apiResource('projects', ProjectController::class);
    Route::apiResource('tasks', TaskController::class);
    Route::apiResource('teams', TeamController::class);
    Route::apiResource('meetings', MeetingController::class);
    Route::apiResource('time-entries', TimeEntryController::class);
    Route::post('time-entries/start', [TimeEntryController::class, 'start']);
    Route::post('time-entries/{id}/stop', [TimeEntryController::class, 'stop']);
    Route::apiResource('attachments', AttachmentController::class);

    Route::apiResource('notifications', NotificationController::class);

    Route::put(
    'notifications/{id}/mark-read',
    [NotificationController::class, 'markAsRead']
    );

    Route::put(
    'notifications/user/{userId}/mark-all-read',
    [NotificationController::class, 'markAllAsRead']
    );

    Route::get(
    'notifications/user/{userId}/unread-count',
    [NotificationController::class, 'unreadCount']
    );
});