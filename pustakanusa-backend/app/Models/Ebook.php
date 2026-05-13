<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ebook extends Model
{
    use HasFactory;

   protected $fillable = [
    'category_id',
    'judul',
    'penulis',
    'deskripsi',
    'file_pdf',
    'cover_image',
    'status',
    'jumlah_unduh',
    'isbn',
    'jumlah_halaman',
    'tahun_terbit',
    'bahasa'
];
    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
