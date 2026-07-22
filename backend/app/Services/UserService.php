<?php

namespace App\Services;

use App\Http\Resources\User\UserResource;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserService
{
    /**
     * Display all users.
     */
    public function index()
    {
        $users = User::with(['organization', 'roles'])
            ->latest()
            ->paginate(10);

        return UserResource::collection($users);
    }

    /**
     * Store a newly created user.
     */
    public function store(array $data)
    {
        return DB::transaction(function () use ($data) {

            $role = $data['role'];
            unset($data['role']);

            $data['password'] = Hash::make($data['password']);

            $user = User::create($data);

            $user->assignRole($role);

            $user->load(['organization', 'roles']);

            return new UserResource($user);
        });
    }

    /**
     * Display the specified user.
     */
    public function show(int $id)
    {
        $user = User::with(['organization', 'roles'])
            ->findOrFail($id);

        return new UserResource($user);
    }

    /**
     * Update the specified user.
     */
    public function update(int $id, array $data)
    {
        return DB::transaction(function () use ($id, $data) {

            $user = User::findOrFail($id);

            $role = $data['role'];
            unset($data['role']);

            if (!empty($data['password'])) {
                $data['password'] = Hash::make($data['password']);
            } else {
                unset($data['password']);
            }

            unset($data['password_confirmation']);

            $user->update($data);

            $user->syncRoles([$role]);

            $user->load(['organization', 'roles']);

            return new UserResource($user);
        });
    }

    /**
     * Remove the specified user.
     */
    public function destroy(int $id): bool
    {
        $user = User::findOrFail($id);

        $user->delete();

        return true;
    }
}