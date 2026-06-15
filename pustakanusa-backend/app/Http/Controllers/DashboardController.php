<?php

namespace App\Http\Controllers;

use App\Models\Ebook;
use App\Models\User;
use App\Models\Download;
use App\Models\Suggestion;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        return response()->json([
            'books' => Ebook::count(),
            'users' => User::count(),
            'downloads' => Download::count(),
            'saran' => Suggestion::count(),
        ]);
    }
  public function monthly()
{
    $monthly = DB::table('downloads')
        ->selectRaw("
            YEAR(created_at) as tahun,
            MONTH(created_at) as bulan,
            COUNT(DISTINCT ebook_id) as buku,
            COUNT(*) as unduh,
            COUNT(*) as user
        ")
        ->groupByRaw("YEAR(created_at), MONTH(created_at)")
        ->orderByRaw("YEAR(created_at), MONTH(created_at)")
        ->get();

    return response()->json($monthly);
}
}