<?php

namespace App\Http\Resources\Notification;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NotificationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [

            'id' => $this->id,

            'organization' => [
                'id' => $this->organization->id,
                'name' => $this->organization->name,
            ],

            'user' => [
                'id' => $this->user->id,
                'name' => $this->user->full_name,
                'email' => $this->user->email,
            ],

            'title' => $this->title,

            'message' => $this->message,

            'type' => $this->type,

            'is_read' => $this->is_read,

            'read_at' => optional($this->read_at)->format('Y-m-d H:i:s'),

            'is_active' => $this->is_active,

            'created_at' => $this->created_at,

            'updated_at' => $this->updated_at,

        ];
    }
}