<?php

namespace App\Providers;

use App\Models\AuditLog;
use App\Models\Department;
use App\Models\File;
use App\Models\Folder;
use App\Models\Meeting;
use App\Models\Organization;
use App\Models\Project;
use App\Models\Task;
use App\Models\TaskComment;
use App\Models\Team;
use App\Models\TimeEntry;
use App\Models\User;
use App\Policies\AuditLogPolicy;
use App\Policies\DepartmentPolicy;
use App\Policies\FilePolicy;
use App\Policies\FolderPolicy;
use App\Policies\MeetingPolicy;
use App\Policies\OrganizationPolicy;
use App\Policies\ProjectPolicy;
use App\Policies\ReportsPolicy;
use App\Policies\TaskCommentPolicy;
use App\Policies\TaskPolicy;
use App\Policies\TeamPolicy;
use App\Policies\TimeEntryPolicy;
use App\Policies\UserPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        Organization::class => OrganizationPolicy::class,
        User::class => UserPolicy::class,
        Department::class => DepartmentPolicy::class,
        Team::class => TeamPolicy::class,
        Project::class => ProjectPolicy::class,
        Task::class => TaskPolicy::class,
        TaskComment::class => TaskCommentPolicy::class,
        Meeting::class => MeetingPolicy::class,
        TimeEntry::class => TimeEntryPolicy::class,
        Folder::class => FolderPolicy::class,
        File::class => FilePolicy::class,
        AuditLog::class => AuditLogPolicy::class,
    ];

    public function boot(): void
    {
        $this->registerPolicies();

        Gate::define('viewReports', [ReportsPolicy::class, 'viewAny']);
    }
}
