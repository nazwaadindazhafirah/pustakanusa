<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class LogController extends Controller
{
    public function index()
    {
        $logs = DB::table('activity_logs')
            ->latest()
            ->get();

        return response()->json([
            'data' => $logs
        ]);
    }
}