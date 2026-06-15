<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Suggestion;
use Illuminate\Http\Request;

class SuggestionController extends Controller
{
    // =========================
    // TAMPILKAN SEMUA SARAN
    // =========================
    public function index()
    {
        $suggestions = Suggestion::with('user')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $suggestions
        ]);
    }

    // =========================
    // SIMPAN SARAN BARU
    // =========================
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'subjek' => 'required|string|max:255',
            'pesan' => 'required|string',
        ]);

        $suggestion = Suggestion::create([
            'user_id' => $request->user_id,
            'subjek' => $request->subjek,
            'pesan' => $request->pesan,
            'status' => 'menunggu'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Saran berhasil dikirim',
            'data' => $suggestion
        ], 201);
    }

    // =========================
    // UPDATE STATUS SARAN
    // =========================
 public function update(Request $request, string $id)
{
    try {

        $suggestion = Suggestion::findOrFail($id);

        $suggestion->status = strtolower($request->status);

        $suggestion->save();

        return response()->json([
            'success' => true,
            'data' => $suggestion
        ]);

    } catch (\Exception $e) {

        return response()->json([
            'error' => $e->getMessage(),
            'line' => $e->getLine(),
            'file' => $e->getFile()
        ], 500);
    }
}

    // =========================
    // HAPUS SARAN
    // =========================
    public function destroy(string $id)
    {
        $suggestion = Suggestion::findOrFail($id);

        $suggestion->delete();

        return response()->json([
            'success' => true,
            'message' => 'Saran berhasil dihapus'
        ]);
    }
}
