<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Meeting extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'department_id',
        'project_id',
        'team_id',
        'title',
        'description',
        'meeting_date',
        'start_time',
        'end_time',
        'location',
        'status',
        'is_active',
    ];

    protected $casts = [
        'meeting_date' => 'date',
        'is_active' => 'boolean',
    ];

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function team()
    {
        return $this->belongsTo(Team::class);
    }
}