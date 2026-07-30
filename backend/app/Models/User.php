<?php

namespace App\Models;

use App\Enums\UserStatus;
use App\Support\RoleLabel;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, HasRoles, Notifiable, SoftDeletes;

    public function scopeSearch(Builder $query, ?string $search): Builder
    {
        if (! $search) {
            return $query;
        }

        $term = '%'.$search.'%';

        return $query->where(function (Builder $q) use ($term) {
            $q->where('name', 'like', $term)
                ->orWhere('email', 'like', $term)
                ->orWhereHas('department', fn (Builder $d) => $d->where('name', 'like', $term))
                ->orWhereHas('organization', fn (Builder $o) => $o->where('name', 'like', $term))
                ->orWhereHas('roles', fn (Builder $r) => $r->where('name', 'like', $term));
        });
    }

    public function scopeStatus(Builder $query, ?string $status): Builder
    {
        if (! $status || $status === 'all') {
            return $query;
        }

        return $query->where('status', $status);
    }

    public function scopeFilterRole(Builder $query, ?string $role): Builder
    {
        if (! $role || $role === 'all') {
            return $query;
        }

        $spatie = RoleLabel::toSpatie($role);

        return $query->whereHas('roles', fn (Builder $r) => $r->where('name', $spatie));
    }

    public function scopeDepartmentId(Builder $query, mixed $departmentId): Builder
    {
        if ($departmentId === null || $departmentId === '' || $departmentId === 'all') {
            return $query;
        }

        return $query->where('department_id', $departmentId);
    }

    public function scopeOrganizationId(Builder $query, mixed $organizationId): Builder
    {
        if ($organizationId === null || $organizationId === '' || $organizationId === 'all') {
            return $query;
        }

        return $query->where('organization_id', $organizationId);
    }


    protected $fillable = [
        'organization_id',
        'department_id',
        'manager_id',
        'name',
        'email',
        'google_id',
        'microsoft_id',
        'initials',
        'avatar_url',
        'phone',
        'location',
        'status',
        'password',
        'last_login_at',
        'email_verified_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'last_login_at' => 'datetime',
            'password' => 'hashed',
            'status' => UserStatus::class,
        ];
    }

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function manager(): BelongsTo
    {
        return $this->belongsTo(User::class, 'manager_id');
    }

    public function directReports(): HasMany
    {
        return $this->hasMany(User::class, 'manager_id');
    }

    public function departmentsManaged(): HasMany
    {
        return $this->hasMany(Department::class, 'manager_id');
    }

    public function departments(): BelongsToMany
    {
        return $this->belongsToMany(Department::class)->withTimestamps();
    }

    public function teams(): BelongsToMany
    {
        return $this->belongsToMany(Team::class)->withTimestamps();
    }

    public function teamsLed(): HasMany
    {
        return $this->hasMany(Team::class, 'team_lead_id');
    }

    public function projects(): BelongsToMany
    {
        return $this->belongsToMany(Project::class)
            ->withPivot('role_in_project')
            ->withTimestamps();
    }

    public function assignedTasks(): HasMany
    {
        return $this->hasMany(Task::class, 'assignee_id');
    }

    public function createdTasks(): HasMany
    {
        return $this->hasMany(Task::class, 'created_by');
    }

    public function taskComments(): HasMany
    {
        return $this->hasMany(TaskComment::class);
    }

    public function organizedMeetings(): HasMany
    {
        return $this->hasMany(Meeting::class, 'organizer_id');
    }

    public function meetings(): BelongsToMany
    {
        return $this->belongsToMany(Meeting::class, 'meeting_attendees')
            ->withPivot('rsvp_status')
            ->withTimestamps();
    }

    public function timeEntries(): HasMany
    {
        return $this->hasMany(TimeEntry::class);
    }

    public function uploadedFiles(): HasMany
    {
        return $this->hasMany(File::class, 'uploaded_by');
    }

    public function auditLogs(): HasMany
    {
        return $this->hasMany(AuditLog::class, 'actor_id');
    }

    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class);
    }

    /** Compatibility for older code expecting first_name/last_name. */
    public function getFullNameAttribute(): string
    {
        return (string) $this->name;
    }
}
