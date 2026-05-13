<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('ebooks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained('categories')->onDelete('cascade');
            $table->string('judul');
            $table->string('penulis');
            $table->text('deskripsi');
            $table->string('file_pdf');
            $table->string('cover_image');
            $table->enum('status', ['tersedia', 'dipinjam'])->default('tersedia');
            $table->integer('jumlah_unduh')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ebooks');
    }
};
