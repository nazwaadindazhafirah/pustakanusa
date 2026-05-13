<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'password' => 'required|string',
        ]);

        $identifier = $request->nim ?? $request->nidn ?? $request->email;

        $user = User::where(function ($query) use ($identifier) {
            $query->where('nim', $identifier)
                  ->orWhere('nidn', $identifier)
                  ->orWhere('email', $identifier)
                  ->orWhere('name', 'like', '%' . $identifier . '%');
        })->first();

        // 🔥 TANPA HASH
        if ($user && $request->password === $user->password) {
            return response()->json([
                'success' => true,
                'message' => 'Login berhasil',
                'data' => $user
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Kredensial tidak valid'
        ], 401);
    }
}