<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Suggestion;
use Illuminate\Http\Request;

class SuggestionController extends Controller
{
    public function index()
    {
        $suggestions = Suggestion::with('user')->orderBy('created_at', 'desc')->get();
        return response()->json([
            'success' => true,
            'data' => $suggestions
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'subjek' => 'required|string|max:255',
            'pesan' => 'required|string',
        ]);

        $suggestion = Suggestion::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Saran berhasil dikirim',
            'data' => $suggestion
        ], 201);
    }

    public function update(Request $request, string $id)
    {
        $request->validate([
            'status' => 'required|in:Menunggu,Ditinjau,Ditolak,Diterima'
        ]);

        $suggestion = Suggestion::findOrFail($id);
        $suggestion->update(['status' => $request->status]);

        return response()->json([
            'success' => true,
            'message' => 'Status saran berhasil diperbarui',
            'data' => $suggestion
        ]);
    }

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
