<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ebook;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\Download;

class EbookController extends Controller
{
    public function index()
    {
        $ebooks = Ebook::with('category')->get();

        return response()->json([
            'success' => true,
            'data' => $ebooks
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'category_id' => 'required|exists:categories,id',
            'judul' => 'required|string|max:255',
            'penulis' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'file_pdf' => 'nullable|mimes:pdf|max:20480',
            'cover_image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'status' => 'nullable|in:tersedia,tidak_tersedia',
            'isbn' => 'nullable|string|max:50',
            'jumlah_halaman' => 'nullable|integer',
            'tahun_terbit' => 'nullable|string|max:4',
            'tanggal_input' => 'nullable|date',
            'bahasa' => 'nullable|string|max:50'
        ]);

       $data = $request->only([
    'judul',
    'penulis',
    'deskripsi',
    'category_id',
    'status'
]);

        // default value
        $data['status'] = $data['status'] ?? 'tersedia';
        $data['jumlah_unduh'] = 0;

        // upload PDF
        if ($request->hasFile('file_pdf')) {
            $pdfPath = $request->file('file_pdf')->store('ebooks/pdfs', 'public');
            $data['file_pdf'] = $pdfPath;
        } else {
            $data['file_pdf'] = '';
        }

        // upload cover
        if ($request->hasFile('cover_image')) {
            $coverPath = $request->file('cover_image')->store('ebooks/covers', 'public');
            $data['cover_image'] = $coverPath;
        } else {
            $data['cover_image'] = null;
        }

        $ebook = Ebook::create($data);
        $ebook->load('category');

        return response()->json([
            'success' => true,
            'message' => 'Ebook berhasil ditambahkan',
            'data' => $ebook
        ], 201);
    }

    public function show($id)
    {
        $ebook = Ebook::with('category')->findOrFail($id);

        $ebook->pdf_url = $ebook->file_pdf ? asset('storage/' . $ebook->file_pdf) : null;
        $ebook->cover_url = $ebook->cover_image ? asset('storage/' . $ebook->cover_image) : null;

        return response()->json([
            'success' => true,
            'data' => $ebook
        ]);
    }

    public function update(Request $request, $id)
    {
        $ebook = Ebook::findOrFail($id);

        $request->validate([
            'category_id' => 'sometimes|required|exists:categories,id',
            'judul' => 'sometimes|required|string|max:255',
            'penulis' => 'sometimes|required|string|max:255',
            'deskripsi' => 'sometimes|required|string',
            'file_pdf' => 'nullable|mimes:pdf|max:20480',
            'cover_image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'status' => 'nullable|in:tersedia,tidak_tersedia',
            'isbn' => 'nullable|string|max:50',
            'jumlah_halaman' => 'nullable|integer',
            'tahun_terbit' => 'nullable|string|max:4',
            'tanggal_input' => 'nullable|date',
            'bahasa' => 'nullable|string|max:50'
        ]);

        $data = $request->only([
    'judul',
    'penulis',
    'deskripsi',
    'category_id',
    'status',
    'isbn',
    'jumlah_halaman',
    'tahun_terbit',
    'bahasa'
]);
        // update PDF
        if ($request->hasFile('file_pdf')) {
            if ($ebook->file_pdf && Storage::disk('public')->exists($ebook->file_pdf)) {
                Storage::disk('public')->delete($ebook->file_pdf);
            }

            $pdfPath = $request->file('file_pdf')->store('ebooks/pdfs', 'public');
            $data['file_pdf'] = $pdfPath;
        }

        // update cover
        if ($request->hasFile('cover_image')) {
            if ($ebook->cover_image && Storage::disk('public')->exists($ebook->cover_image)) {
                Storage::disk('public')->delete($ebook->cover_image);
            }

            $coverPath = $request->file('cover_image')->store('ebooks/covers', 'public');
            $data['cover_image'] = $coverPath;
        }

        $ebook->update($data);
        $ebook->load('category');

        return response()->json([
            'success' => true,
            'message' => 'Ebook berhasil diupdate',
            'data' => $ebook
        ]);
    }

    public function destroy($id)
    {
        $ebook = Ebook::findOrFail($id);

        if ($ebook->file_pdf && Storage::disk('public')->exists($ebook->file_pdf)) {
            Storage::disk('public')->delete($ebook->file_pdf);
        }

        if ($ebook->cover_image && Storage::disk('public')->exists($ebook->cover_image)) {
            Storage::disk('public')->delete($ebook->cover_image);
        }

        $ebook->delete();

        return response()->json([
            'success' => true,
            'message' => 'Ebook berhasil dihapus'
        ]);
    }
    public function download(Request $request)
{
    $ebook = Ebook::findOrFail($request->ebook_id);

    // simpan ke tabel downloads
    Download::create([
        'ebook_id' => $ebook->id,
    ]);

    // optional: tambah jumlah unduh
    $ebook->increment('jumlah_unduh');

    return response()->json([
        'success' => true,
        'message' => 'Download berhasil dicatat'
    ]);
}
public function riwayat()
{
    $data = Download::with('ebook')->latest()->get();

    return response()->json($data);
}
}