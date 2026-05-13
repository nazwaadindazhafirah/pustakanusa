<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ebooks', function (Blueprint $table) {

            if (!Schema::hasColumn('ebooks', 'isbn')) {
                $table->string('isbn')->nullable();
            }

            if (!Schema::hasColumn('ebooks', 'jumlah_halaman')) {
                $table->integer('jumlah_halaman')->nullable()->default(0);
            }

            if (!Schema::hasColumn('ebooks', 'tahun_terbit')) {
                $table->string('tahun_terbit')->nullable();
            }

            if (!Schema::hasColumn('ebooks', 'tanggal_input')) {
                $table->date('tanggal_input')->nullable();
            }

            if (!Schema::hasColumn('ebooks', 'bahasa')) {
                $table->string('bahasa')->nullable()->default('Indonesia');
            }
        });

        // Ubah enum status (AMAN)
        DB::statement("ALTER TABLE ebooks MODIFY COLUMN status ENUM('tersedia', 'tidak_tersedia') DEFAULT 'tersedia'");

        Schema::table('categories', function (Blueprint $table) {
            if (!Schema::hasColumn('categories', 'status')) {
                $table->boolean('status')->default(true);
            }
        });

        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'status')) {
                $table->boolean('status')->default(true);
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'status')) {
                $table->dropColumn('status');
            }
        });

        Schema::table('categories', function (Blueprint $table) {
            if (Schema::hasColumn('categories', 'status')) {
                $table->dropColumn('status');
            }
        });

        DB::statement("ALTER TABLE ebooks MODIFY COLUMN status ENUM('tersedia', 'dipinjam') DEFAULT 'tersedia'");

        Schema::table('ebooks', function (Blueprint $table) {
            $columns = ['isbn', 'jumlah_halaman', 'tahun_terbit', 'tanggal_input', 'bahasa'];

            foreach ($columns as $column) {
                if (Schema::hasColumn('ebooks', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};