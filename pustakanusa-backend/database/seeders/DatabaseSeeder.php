<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
use App\Models\Ebook;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
        ]);





        // 3. Buat 5 Kategori
        $kategoriList = [
            ['nama_kategori' => 'Teknologi Informasi', 'slug' => 'teknologi-informasi'],
            ['nama_kategori' => 'Sains & Fisika', 'slug' => 'sains-fisika'],
            ['nama_kategori' => 'Ekonomi & Bisnis', 'slug' => 'ekonomi-bisnis'],
            ['nama_kategori' => 'Sastra & Fiksi', 'slug' => 'sastra-fiksi'],
            ['nama_kategori' => 'Sejarah', 'slug' => 'sejarah'],
        ];

        foreach ($kategoriList as $kategori) {
            Category::create($kategori);
        }

        // 4. Buat 10 Ebooks Dummy
        $categories = Category::all();
        $dummyEbooks = [];

        for ($i = 1; $i <= 10; $i++) {
            // Ambil kategori secara acak
            $randomCategory = $categories->random();
            
            $dummyEbooks[] = [
                'category_id' => $randomCategory->id,
                'judul' => 'Buku Panduan ' . $randomCategory->nama_kategori . ' Volume ' . $i,
                'penulis' => 'Penulis ' . $i,
                'deskripsi' => 'Ini adalah deskripsi dummy untuk buku berjudul Panduan ' . $randomCategory->nama_kategori . '. Buku ini membahas konsep dasar hingga lanjutan.',
                'file_pdf' => 'ebooks/pdfs/dummy.pdf', // Asumsi ada file dummy.pdf di storage
                'cover_image' => 'ebooks/covers/dummy-cover.jpg', // Asumsi ada gambar dummy di storage
                'status' => 'tersedia',
                'jumlah_unduh' => rand(10, 500),
            ];
        }

        foreach ($dummyEbooks as $ebook) {
            Ebook::create($ebook);
        }
    }
}
