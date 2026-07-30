<?php

use App\Http\Controllers\Api\AuditLogController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BrainController;
use App\Http\Controllers\Api\DepartmentController;
use App\Http\Controllers\Api\FileController;
use App\Http\Controllers\Api\FolderController;
use App\Http\Controllers\Api\MeetingController;
use App\Http\Controllers\Api\OrganizationController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\ReportsController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\TeamController;
use App\Http\Controllers\Api\TimeEntryController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API v1 — Batches 1–5
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {
    Route::prefix('auth')->group(function () {
        Route::post('register', [AuthController::class, 'register']);
        Route::post('login', [AuthController::class, 'login']);

        Route::middleware('auth:sanctum')->group(function () {
            Route::post('logout', [AuthController::class, 'logout']);
            Route::get('me', [AuthController::class, 'me']);
        });
    });

    Route::middleware('auth:sanctum')->group(function () {
        Route::apiResource('organizations', OrganizationController::class);

        Route::get('users/{user}/tasks', [UserController::class, 'tasks']);
        Route::get('users/{user}/projects', [UserController::class, 'projects']);
        Route::apiResource('users', UserController::class);

        Route::get('departments/{department}/members', [DepartmentController::class, 'members']);
        Route::get('departments/{department}/teams', [DepartmentController::class, 'teams']);
        Route::get('departments/{department}/projects', [DepartmentController::class, 'projects']);
        Route::apiResource('departments', DepartmentController::class);

        Route::get('teams/{team}/members', [TeamController::class, 'members']);
        Route::post('teams/{team}/members', [TeamController::class, 'addMember']);
        Route::delete('teams/{team}/members/{user}', [TeamController::class, 'removeMember']);
        Route::get('teams/{team}/projects', [TeamController::class, 'projects']);
        Route::apiResource('teams', TeamController::class);

        Route::get('projects/{project}/members', [ProjectController::class, 'members']);
        Route::post('projects/{project}/members', [ProjectController::class, 'addMember']);
        Route::delete('projects/{project}/members/{user}', [ProjectController::class, 'removeMember']);
        Route::get('projects/{project}/tasks', [ProjectController::class, 'tasks']);
        Route::get('projects/{project}/teams', [ProjectController::class, 'teams']);
        Route::get('projects/{project}/files', [ProjectController::class, 'files']);
        Route::apiResource('projects', ProjectController::class);

        Route::patch('tasks/{task}/status', [TaskController::class, 'updateStatus']);
        Route::get('tasks/{task}/subtasks', [TaskController::class, 'subtasks']);
        Route::post('tasks/{task}/subtasks', [TaskController::class, 'storeSubtask']);
        Route::patch('tasks/{task}/subtasks/{subtask}', [TaskController::class, 'updateSubtask']);
        Route::delete('tasks/{task}/subtasks/{subtask}', [TaskController::class, 'destroySubtask']);
        Route::get('tasks/{task}/comments', [TaskController::class, 'comments']);
        Route::post('tasks/{task}/comments', [TaskController::class, 'storeComment']);
        Route::delete('tasks/{task}/comments/{comment}', [TaskController::class, 'destroyComment']);
        Route::get('tasks/{task}/time-summary', [TaskController::class, 'timeSummary']);
        Route::get('tasks/{task}/files', [TaskController::class, 'files']);
        Route::apiResource('tasks', TaskController::class);

        Route::patch('meetings/{meeting}/status', [MeetingController::class, 'updateStatus']);
        Route::get('meetings/{meeting}/attendees', [MeetingController::class, 'attendees']);
        Route::post('meetings/{meeting}/attendees', [MeetingController::class, 'addAttendee']);
        Route::delete('meetings/{meeting}/attendees/{user}', [MeetingController::class, 'removeAttendee']);
        Route::patch('meetings/{meeting}/attendees/{user}/rsvp', [MeetingController::class, 'updateRsvp']);
        Route::post('meetings/{meeting}/agenda-items', [MeetingController::class, 'storeAgendaItem']);
        Route::get('meetings/{meeting}/agenda-items/{agendaItem}', [MeetingController::class, 'showAgendaItem']);
        Route::patch('meetings/{meeting}/agenda-items/{agendaItem}', [MeetingController::class, 'updateAgendaItem']);
        Route::delete('meetings/{meeting}/agenda-items/{agendaItem}', [MeetingController::class, 'destroyAgendaItem']);
        Route::apiResource('meetings', MeetingController::class);

        Route::get('time-entries/reports/summary', [TimeEntryController::class, 'reportSummary']);
        Route::get('time-entries/reports/by-project', [TimeEntryController::class, 'reportByProject']);
        Route::get('time-entries/reports/by-user', [TimeEntryController::class, 'reportByUser']);
        Route::apiResource('time-entries', TimeEntryController::class);

        Route::get('folders/{folder}/contents', [FolderController::class, 'contents']);
        Route::apiResource('folders', FolderController::class);

        Route::get('files/{file}/download', [FileController::class, 'download']);
        Route::get('files/{file}/comments', [FileController::class, 'comments']);
        Route::post('files/{file}/comments', [FileController::class, 'storeComment']);
        Route::apiResource('files', FileController::class);

        Route::prefix('reports')->group(function () {
            Route::get('overview', [ReportsController::class, 'overview']);
            Route::get('task-completion-trend', [ReportsController::class, 'taskCompletionTrend']);
            Route::get('projects-by-status', [ReportsController::class, 'projectsByStatus']);
            Route::get('projects-by-department', [ReportsController::class, 'projectsByDepartment']);
            Route::get('tasks-by-status', [ReportsController::class, 'tasksByStatus']);
            Route::get('tasks-by-priority', [ReportsController::class, 'tasksByPriority']);
            Route::get('overdue-tasks', [ReportsController::class, 'overdueTasks']);
            Route::get('team-performance', [ReportsController::class, 'teamPerformance']);
        });

        Route::get('audit-logs', [AuditLogController::class, 'index']);

        Route::prefix('brain')->group(function () {
            Route::get('health', [BrainController::class, 'health']);
            Route::get('status', [BrainController::class, 'status']);
            Route::post('query', [BrainController::class, 'query']);
            Route::post('ingestion/drive/folder', [BrainController::class, 'ingestDriveFolder']);
            Route::post('ingestion/slack/all', [BrainController::class, 'ingestSlackAll']);
        });
    });
});
