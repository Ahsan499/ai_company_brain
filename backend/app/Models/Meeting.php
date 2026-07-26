<?php

namespace App\Models;

use App\Enums\MeetingStatus;
use App\Enums\MeetingType;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Meeting extends Model
{
    use HasFactory, SoftDeletes;

    public function scopeSearch(Builder $query, ?string $search): Builder
    {
        if (! $search) {
            return $query;
        }

        $term = '%'.$search.'%';

        return $query->where(function (Builder $q) use ($term) {
            $q->where('title', 'like', $term)
                ->orWhere('description', 'like', $term)
                ->orWhere('location', 'like', $term);
        });
    }

    public function scopeProjectId(Builder $query, mixed $projectId): Builder
    {
        if ($projectId === null || $projectId === '' || $projectId === 'all') {
            return $query;
        }

        return $query->where('project_id', $projectId);
    }

    public function scopeTeamId(Builder $query, mixed $teamId): Builder
    {
        if ($teamId === null || $teamId === '' || $teamId === 'all') {
            return $query;
        }

        return $query->where('team_id', $teamId);
    }

    public function scopeOrganizerId(Builder $query, mixed $organizerId): Builder
    {
        if ($organizerId === null || $organizerId === '' || $organizerId === 'all') {
            return $query;
        }

        return $query->where('organizer_id', $organizerId);
    }

    public function scopeDateBetween(Builder $query, mixed $from, mixed $to): Builder
    {
        if ($from) {
            $query->whereDate('date', '>=', $from);
        }
        if ($to) {
            $query->whereDate('date', '<=', $to);
        }

        return $query;
    }

    public function scopeMyMeetings(Builder $query, mixed $flag, ?int $userId): Builder
    {
        if (! $flag || in_array($flag, [false, 'false', '0', 0], true) || ! $userId) {
            return $query;
        }

        return $query->where(function (Builder $q) use ($userId) {
            $q->where('organizer_id', $userId)
                ->orWhereHas('attendees', fn (Builder $a) => $a->where('users.id', $userId));
        });
    }

    public function isAttendee(int $userId): bool
    {
        return $this->attendees()->where('users.id', $userId)->exists();
    }


    protected $fillable = [
        'organization_id',
        'project_id',
        'team_id',
        'organizer_id',
        'created_by',
        'title',
        'description',
        'notes',
        'date',
        'start_time',
        'duration_minutes',
        'status',
        'type',
        'location',
        'join_url',
        'recurring',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date',
            'duration_minutes' => 'integer',
            'status' => MeetingStatus::class,
            'type' => MeetingType::class,
        ];
    }

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    public function organizer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'organizer_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function attendees(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'meeting_attendees')
            ->withPivot('rsvp_status')
            ->withTimestamps();
    }

    public function agendaItems(): HasMany
    {
        return $this->hasMany(MeetingAgendaItem::class)->orderBy('sort_order');
    }
}
