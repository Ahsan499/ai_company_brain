<?php

namespace App\Http\Resources\Meeting;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MeetingAgendaItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'meetingId' => $this->meeting_id,
            'title' => $this->title,
            'done' => (bool) $this->done,
            'sortOrder' => $this->sort_order,
        ];
    }
}
