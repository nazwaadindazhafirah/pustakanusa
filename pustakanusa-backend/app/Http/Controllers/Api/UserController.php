<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::all();
        return response()->json([
            'success' => true,
            'data' => $users
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
{
    try {
        $user = \App\Models\User::create([
            'name' => $request->name ?? 'User Baru',
            'email' => $request->email ?? uniqid().'@mail.com',
            'password' => $request->password ?? '123456',
            'role' => $request->role ?? 'user',
            'nim' => $request->nim,
            'nidn' => $request->nidn,
        ]);

        return response()->json([
            'success' => true,
            'data' => $user
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => $e->getMessage()
        ], 500);
    }
}

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|string|email|max:255|unique:users,email,' . $id,
            'password' => 'nullable|string|min:8',
            'role' => 'sometimes|required|in:admin,user',
            'nim' => 'nullable|string|unique:users,nim,' . $id,
            'nidn' => 'nullable|string|unique:users,nidn,' . $id,
        ]);

        $data = $request->all();
        
        if ($request->filled('password')) {
            // $data['password'] = Hash::make($data['password']); // Hashing removed
            $data['password'] = $data['password'];
        } else {
            unset($data['password']);
        }

        $user->update($data);

        return response()->json([
            'success' => true,
            'message' => 'User berhasil diperbarui',
            'data' => $user
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'User berhasil dihapus'
        ]);
    }
}
