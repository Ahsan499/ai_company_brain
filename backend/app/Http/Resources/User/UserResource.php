<?php

namespace App\Http\Resources\User;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,

            'organization' => $this->organization ? [
                'id' => $this->organization->id,
                'name' => $this->organization->name,
                'slug' => $this->organization->slug,
            ] : null,

            'first_name' => $this->first_name,

            'last_name' => $this->last_name,

            'full_name' => $this->full_name,

            'email' => $this->email,

            'roles' => $this->getRoleNames(),

            'created_at' => $this->created_at,

            'updated_at' => $this->updated_at,
        ];
    }
}