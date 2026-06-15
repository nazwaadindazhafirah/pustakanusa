-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.4.3 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for pustaka_db
CREATE DATABASE IF NOT EXISTS `pustaka_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `pustaka_db`;

-- Dumping structure for table pustaka_db.activity_logs
CREATE TABLE IF NOT EXISTS `activity_logs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned DEFAULT NULL,
  `aktivitas` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `keterangan` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `activity_logs_user_id_foreign` (`user_id`),
  CONSTRAINT `activity_logs_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table pustaka_db.activity_logs: ~17 rows (approximately)
INSERT INTO `activity_logs` (`id`, `user_id`, `aktivitas`, `keterangan`, `created_at`, `updated_at`) VALUES
	(1, 9, 'Login', 'admin nazwa berhasil login ke sistem', '2026-05-18 17:38:37', '2026-05-18 17:38:37'),
	(2, 8, 'Login', 'nazwa berhasil login ke sistem', '2026-05-18 17:39:40', '2026-05-18 17:39:40'),
	(3, 9, 'Login', 'admin nazwa berhasil login ke sistem', '2026-05-18 17:46:43', '2026-05-18 17:46:43'),
	(4, 9, 'Login', 'admin nazwa berhasil login ke sistem', '2026-05-19 05:25:34', '2026-05-19 05:25:34'),
	(5, 8, 'Login', 'nazwa berhasil login ke sistem', '2026-05-19 05:25:51', '2026-05-19 05:25:51'),
	(6, 8, 'Login', 'nazwa berhasil login ke sistem', '2026-06-09 19:08:18', '2026-06-09 19:08:18'),
	(7, 9, 'Login', 'admin nazwa berhasil login ke sistem', '2026-06-09 19:17:13', '2026-06-09 19:17:13'),
	(8, 9, 'memperbarui status saran', '"cinta cintaan" → Diterima', '2026-06-09 19:17:29', '2026-06-09 19:17:29'),
	(9, 8, 'Login', 'nazwa berhasil login ke sistem', '2026-06-09 19:17:45', '2026-06-09 19:17:45'),
	(10, 9, 'Login', 'admin nazwa berhasil login ke sistem', '2026-06-09 19:18:09', '2026-06-09 19:18:09'),
	(11, 9, 'memperbarui status saran', '"cinta cintaan" → Diterima', '2026-06-09 19:18:23', '2026-06-09 19:18:23'),
	(12, 9, 'memperbarui status saran', '"cinta cintaan" → Diterima', '2026-06-09 19:41:22', '2026-06-09 19:41:22'),
	(13, 8, 'Login', 'nazwa berhasil login ke sistem', '2026-06-09 19:42:49', '2026-06-09 19:42:49'),
	(14, 9, 'Login', 'admin nazwa berhasil login ke sistem', '2026-06-09 19:49:50', '2026-06-09 19:49:50'),
	(15, 8, 'Login', 'nazwa berhasil login ke sistem', '2026-06-09 20:01:03', '2026-06-09 20:01:03'),
	(16, 8, 'Login', 'nazwa berhasil login ke sistem', '2026-06-09 20:01:21', '2026-06-09 20:01:21'),
	(17, 9, 'Login', 'admin nazwa berhasil login ke sistem', '2026-06-09 20:50:35', '2026-06-09 20:50:35');

-- Dumping structure for table pustaka_db.cache
CREATE TABLE IF NOT EXISTS `cache` (
  `key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table pustaka_db.cache: ~0 rows (approximately)

-- Dumping structure for table pustaka_db.cache_locks
CREATE TABLE IF NOT EXISTS `cache_locks` (
  `key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table pustaka_db.cache_locks: ~0 rows (approximately)

-- Dumping structure for table pustaka_db.categories
CREATE TABLE IF NOT EXISTS `categories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nama_kategori` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `categories_slug_unique` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table pustaka_db.categories: ~7 rows (approximately)
INSERT INTO `categories` (`id`, `nama_kategori`, `slug`, `created_at`, `updated_at`, `status`) VALUES
	(1, 'Teknologi Informasi', 'teknologi-informasi', '2026-05-01 11:18:02', '2026-05-01 11:18:02', 1),
	(2, 'Sains & Fisika', 'sains-fisika', '2026-05-01 11:18:02', '2026-05-01 11:18:02', 1),
	(3, 'Ekonomi & Bisnis', 'ekonomi-bisnis', '2026-05-01 11:18:02', '2026-05-01 11:18:02', 1),
	(4, 'Sastra & Fiksi', 'sastra-fiksi', '2026-05-01 11:18:02', '2026-05-01 11:18:02', 1),
	(5, 'Sejarah', 'sejarah', '2026-05-01 11:18:02', '2026-05-01 11:18:02', 1),
	(7, 'Teknik Informatika', 'teknik-informatika', '2026-05-05 05:33:21', '2026-05-05 05:33:21', 1),
	(8, 'kedoktoran', 'kedoktoran', '2026-05-05 21:45:42', '2026-05-05 21:45:42', 1);

-- Dumping structure for table pustaka_db.downloads
CREATE TABLE IF NOT EXISTS `downloads` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `ebook_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `downloads_ebook_id_foreign` (`ebook_id`),
  CONSTRAINT `downloads_ebook_id_foreign` FOREIGN KEY (`ebook_id`) REFERENCES `ebooks` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table pustaka_db.downloads: ~4 rows (approximately)
INSERT INTO `downloads` (`id`, `ebook_id`, `created_at`, `updated_at`) VALUES
	(1, 12, '2026-05-05 05:12:40', '2026-05-05 05:12:40'),
	(3, 11, '2026-05-05 14:22:31', '2026-05-05 14:22:31'),
	(4, 11, '2026-05-05 21:46:27', '2026-05-05 21:46:27'),
	(5, 15, '2026-05-18 17:41:47', '2026-05-18 17:41:47');

-- Dumping structure for table pustaka_db.ebooks
CREATE TABLE IF NOT EXISTS `ebooks` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `category_id` bigint unsigned NOT NULL,
  `judul` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `penulis` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `deskripsi` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_pdf` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `cover_image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('tersedia','tidak_tersedia') COLLATE utf8mb4_unicode_ci DEFAULT 'tersedia',
  `jumlah_unduh` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `isbn` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `jumlah_halaman` int DEFAULT NULL,
  `tahun_terbit` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bahasa` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tanggal_input` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ebooks_category_id_foreign` (`category_id`),
  CONSTRAINT `ebooks_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table pustaka_db.ebooks: ~3 rows (approximately)
INSERT INTO `ebooks` (`id`, `category_id`, `judul`, `penulis`, `deskripsi`, `file_pdf`, `cover_image`, `status`, `jumlah_unduh`, `created_at`, `updated_at`, `isbn`, `jumlah_halaman`, `tahun_terbit`, `bahasa`, `tanggal_input`) VALUES
	(11, 1, 'algoritma', 'nazwa', 'vggh', 'ebooks/pdfs/gGyOC3G7dOLcS9KylkP2cSRy7CL9PoAzVNiPnyKC.pdf', 'ebooks/covers/qm1O5bHcOft2dytBbYkHjU1yvZjvnqkGRsynFn6U.jpg', 'tersedia', 1, '2026-05-05 02:55:22', '2026-05-05 21:46:27', NULL, NULL, NULL, NULL, NULL),
	(12, 1, 'Teknologi Informasi', 'Juhriyansyah Dalle, A.A Karim, Baharuddin', 'Teknologi Informasi adalah istilah umum untuk teknologi apa pun yang membantu manusia dalam membuat, mengubah, menyimpan, mengomunikasikan dan/atau menyebarkan informasi yang menyatukan komputasi dan komunikasi berkecepatan tinggi untuk data, suara, dan video yang berupa berupa komputer pribadi, telepon, TV, peralatan rumah tangga elektronik, dan peranti genggam modern.\r\n\r\nBuku ini menyajikan pengetahuan dasar tentang teknologi informasi yang dibuat dengan lebih detail, jelas, dan praktis sesuai dengan kehidupan sehari-hari, terdiri dari tiga belas bab bahasan yaitu: Pengenalan Teknologi Informasi; Perangkat Keras dan perangkat lunak Komputer; Data, Informasi, dan Pengetahuan; Sistem Telekomunikasi dan Jaringan; Internet, Intranet, dan Ekstranet; Sistem Fungsional, Perusahaan dan Interorganisasi; E-Commerce; Supply Chain Management; Data, Pengetahuan dan Penunjang Keputusan; Intelligent Systems; Strategic Systems And Reorganization; Pembangunan Sistem Informasi (Information System Development); dan Hak Atas Kekayaan Intelektual dengan pembahasan. Sesuai dengan tingkat kebutuhan praktis, buku ini sangat cocok sebagai bahan referensi awal bagi mereka yang ingin mempelajari dasar-dasar teknologi informasi.', 'ebooks/pdfs/E1mDtxdpJAqhexDlxbspbu4usKSloAeWw6XamdDd.pdf', 'ebooks/covers/wjZ71cyf4ZjfJEAHMZNuCk0UqDulNsFx37jWjkbz.jpg', 'tersedia', 1, '2026-05-05 04:33:06', '2026-05-05 05:12:40', NULL, NULL, NULL, NULL, NULL),
	(15, 1, 'pemrograman', 'nazwa', 'nsjjsjhwjjkw', 'ebooks/pdfs/0peSwZThm8qYVTspGXjY3QXZMu4KHWOSMbdBvMrZ.pdf', 'ebooks/covers/fGtl2Hqz9K2ATee3t2OtDju3wjhuwMme3p53WdBb.jpg', 'tersedia', 1, '2026-05-05 21:45:20', '2026-05-18 17:41:47', NULL, NULL, NULL, NULL, NULL);

-- Dumping structure for table pustaka_db.failed_jobs
CREATE TABLE IF NOT EXISTS `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table pustaka_db.failed_jobs: ~0 rows (approximately)

-- Dumping structure for table pustaka_db.jobs
CREATE TABLE IF NOT EXISTS `jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint unsigned NOT NULL,
  `reserved_at` int unsigned DEFAULT NULL,
  `available_at` int unsigned NOT NULL,
  `created_at` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table pustaka_db.jobs: ~0 rows (approximately)

-- Dumping structure for table pustaka_db.job_batches
CREATE TABLE IF NOT EXISTS `job_batches` (
  `id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table pustaka_db.job_batches: ~0 rows (approximately)

-- Dumping structure for table pustaka_db.migrations
CREATE TABLE IF NOT EXISTS `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table pustaka_db.migrations: ~11 rows (approximately)
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
	(1, '0001_01_01_000000_create_users_table', 1),
	(2, '0001_01_01_000001_create_cache_table', 1),
	(3, '0001_01_01_000002_create_jobs_table', 1),
	(4, '2026_05_01_000000_create_categories_table', 1),
	(5, '2026_05_01_000001_create_ebooks_table', 1),
	(6, '2026_05_01_000002_create_suggestions_table', 1),
	(7, '2026_05_01_000003_create_activity_logs_table', 1),
	(8, '2026_05_01_000004_create_reports_table', 1),
	(9, '2026_05_01_135729_create_personal_access_tokens_table', 1),
	(10, '2026_05_04_173544_add_missing_columns_to_tables', 2),
	(11, '2026_05_05_130358_create_downloads_table', 2);

-- Dumping structure for table pustaka_db.password_reset_tokens
CREATE TABLE IF NOT EXISTS `password_reset_tokens` (
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table pustaka_db.password_reset_tokens: ~0 rows (approximately)

-- Dumping structure for table pustaka_db.personal_access_tokens
CREATE TABLE IF NOT EXISTS `personal_access_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint unsigned NOT NULL,
  `name` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  KEY `personal_access_tokens_expires_at_index` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table pustaka_db.personal_access_tokens: ~0 rows (approximately)

-- Dumping structure for table pustaka_db.reports
CREATE TABLE IF NOT EXISTS `reports` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `jenis_laporan` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `data` json NOT NULL,
  `tanggal` date NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table pustaka_db.reports: ~0 rows (approximately)

-- Dumping structure for table pustaka_db.sessions
CREATE TABLE IF NOT EXISTS `sessions` (
  `id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `ip_address` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table pustaka_db.sessions: ~0 rows (approximately)

-- Dumping structure for table pustaka_db.suggestions
CREATE TABLE IF NOT EXISTS `suggestions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `subjek` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `pesan` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('menunggu','diterima','ditolak') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'menunggu',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `suggestions_user_id_foreign` (`user_id`),
  CONSTRAINT `suggestions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table pustaka_db.suggestions: ~1 rows (approximately)
INSERT INTO `suggestions` (`id`, `user_id`, `subjek`, `pesan`, `status`, `created_at`, `updated_at`) VALUES
	(1, 8, 'cinta cintaan', 'Penulis: nazwa\nAlasan: karna suka', 'diterima', '2026-06-09 19:15:01', '2026-06-09 19:41:20');

-- Dumping structure for table pustaka_db.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('admin','user') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'user',
  `nim` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nidn` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  UNIQUE KEY `users_nim_unique` (`nim`),
  UNIQUE KEY `users_nidn_unique` (`nidn`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table pustaka_db.users: ~7 rows (approximately)
INSERT INTO `users` (`id`, `name`, `email`, `role`, `nim`, `nidn`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`, `status`) VALUES
	(3, 'Mahasiswa 1', 'mahasiswa1@kampus.ac.id', 'user', '20240001', NULL, NULL, '$2y$12$u3nUEXJH7SkY1sZxJL5mqe9TeqbfGxjHvo5X/ax8EiCZJ/P4slnmC', NULL, '2026-05-01 11:18:00', '2026-05-04 20:46:00', 1),
	(4, 'Mahasiswa 2', 'mahasiswa2@kampus.ac.id', 'user', '20240002', NULL, NULL, '$2y$12$3RRPG5nrTnG4NIRJrz7J1utw3Ptq1HDuN6WQdGRs2P3p8Mx7WKv6q', NULL, '2026-05-01 11:18:00', '2026-05-01 11:18:00', 1),
	(5, 'Mahasiswa 3', 'mahasiswa3@kampus.ac.id', 'user', '20240003', NULL, NULL, '$2y$12$XqeRmgrYPN/KdkSDY0rPWu8pxmv459b6HqsKpmhU3tbnOf7Q1hloi', NULL, '2026-05-01 11:18:01', '2026-05-01 11:18:01', 1),
	(6, 'Mahasiswa 4', 'mahasiswa4@kampus.ac.id', 'user', '20240004', NULL, NULL, '$2y$12$4E.FWBjzRPMPpZ496pyXSeiqhEmGrMDFXy/Fqk36sOIPDItid/KVO', NULL, '2026-05-01 11:18:01', '2026-05-01 11:18:01', 1),
	(7, 'Mahasiswa 5', 'mahasiswa5@kampus.ac.id', 'user', '20240005', NULL, NULL, '$2y$12$7mfU9A5VS.G9cS0DGPdrm.KaqYibkE5Edx7EBajrtUDGOaKKGWn1m', NULL, '2026-05-01 11:18:02', '2026-05-01 11:18:02', 1),
	(8, 'nazwa', '202312047@example.com', 'user', '202312047', NULL, NULL, 'nazwa23', NULL, '2026-05-05 05:28:45', '2026-05-05 05:28:45', 1),
	(9, 'admin nazwa', '130305@example.com', 'admin', NULL, '130305', NULL, 'nazwa13', NULL, '2026-05-05 06:24:56', '2026-05-05 06:24:56', 1);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
