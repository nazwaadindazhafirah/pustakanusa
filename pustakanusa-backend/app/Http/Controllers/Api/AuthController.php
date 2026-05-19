<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'password' => 'required|string',
        ]);

        // ambil input login
        $identifier = $request->nim 
                    ?? $request->nidn 
                    ?? $request->email;

        // cari user
        $user = User::where(function ($query) use ($identifier) {

            $query->where('nim', $identifier)
                  ->orWhere('nidn', $identifier)
                  ->orWhere('email', $identifier)
                  ->orWhere('name', 'like', '%' . $identifier . '%');

        })->first();

        // LOGIN TANPA HASH
        if ($user && $request->password === $user->password) {

            // =========================
            // SIMPAN LOG AKTIVITAS
            // =========================
            DB::table('activity_logs')->insert([

                'user_id' => $user->id,

                'aktivitas' => 'Login',

                'keterangan' => $user->name . ' berhasil login ke sistem',

                'created_at' => now(),

                'updated_at' => now(),

            ]);

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