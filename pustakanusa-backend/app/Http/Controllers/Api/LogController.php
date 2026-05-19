<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LogController extends Controller
{
    // =========================
    // AMBIL SEMUA LOG
    // =========================
    public function index()
    {
        $logs = DB::table('activity_logs')
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $logs
        ]);
    }

    // =========================
    // SIMPAN LOG BARU
    // =========================
    public function store(Request $request)
    {
        DB::table('activity_logs')->insert([

            'user_id' => $request->user_id,

            'aktivitas' => $request->action,

            'keterangan' => $request->detail,

            'created_at' => now(),

            'updated_at' => now(),

        ]);

        return response()->json([

            'success' => true,

            'message' => 'Log berhasil disimpan'

        ]);
    }
}