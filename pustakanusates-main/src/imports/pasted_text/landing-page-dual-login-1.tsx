1. Master Prompt: Landing Page & Dual-Login Entry
Prompt: "Create an ultra-modern and minimalist landing page for 'Pustaka Nusa', a university digital library. The layout must be clean with 80px padding and a soft white background. The hero section features a dual-card login system.
Card 1 (Student/Staff): Label it 'Portal Mahasiswa & Dosen'. It must have a single prominent input field with a placeholder 'Masukkan NIM atau NIDN'. No password field is required. Below it, a large action button with hex #4475F2, rounded 12px, containing the text 'Masuk ke Pustaka'. Add a small caption: 'Akun dikelola oleh Admin Perpustakaan'.
Card 2 (Admin): Label it 'Portal Pengelola'. It must include two input fields: 'Username' and 'Password' (masked). The login button uses a secondary blue hex #789DFC.
Design Style: Use 'Plus Jakarta Sans' for typography. Background should have subtle abstract geometric shapes in hex #D9E3FC to give a 'tech' feel for Gen Z. In the top right corner, include a high-fidelity 'Theme Toggle' switch (Sun and Moon icons). The footer must be simple with 'Tentang Pustaka Nusa' and 'STITEK Library Team 2026'."

2. Master Prompt: User Dashboard (The "Search Engine" Core)
Prompt: "Design the main User Dashboard for Pustaka Nusa with a focus on 'Search-First' UX, inspired by Z-Library.
Header: Sticky header with a logo 'Pustaka Nusa' on the left. On the right, a Notification Bell with a red dot badge and a Hamburger Menu icon.
Hero Search Section: In the center of the page, place a massive search bar (height 64px, rounded 32px) with a subtle drop shadow. Include a search icon inside and a 'Filter' button. Below the search bar, display 'Popular Categories' as pill-shaped tags (e.g., Teknik Informatika, Sistem Informasi, Manajemen, etc.) using hex #D9E3FC for the background.
E-book Grid: A 4-column responsive grid showing e-book cards. Each card has a fixed-ratio book cover (shadowed), a bold title in hex #1A202C, and a subtitle for the author.
Interaction: Add a 'Favorite' heart icon on the top right corner of each book cover. Use a theme toggle that instantly switches the entire background to #0F172A and text to white. Use 'Inter' font for body text to ensure readability for lecturers. Footer must include 'Pustaka Nusa © 2026' and links to 'Bantuan' and 'Kontak Perpustakaan'."

3. Master Prompt: Book Detail & Online PDF Reader View
Prompt: "Design a high-fidelity 'Book Detail' page for an e-book application. The page is split into two main columns.
Left Column (40%): Displays a large, high-resolution book cover with a 'Premium' feel. Below the cover, two primary buttons: 'Baca Online' (Background #4475F2, White text) and 'Unduh PDF' (Border #4475F2, Blue text).
Right Column (60%): Displays the Book Title in size 32px, Author name in gray. Add a 'Sinopsis' section with a clean 1.6 line-height paragraph. Below it, a 'Detail Informasi' grid containing: Kategori, Tahun Terbit, Bahasa, dan ISBN.
Navigation: Include a 'Breadcrumb' (Home > Category > Title) and a prominent 'Kembali ke Dashboard' button with a left arrow.
UX Feature: Include a small 'History' section at the bottom showing 'Buku Terkait' (Related Books) in a horizontal scrollable list. The design must be extremely clean, using white space to separate sections, ensuring it is friendly for both students and elderly lecturers."

4. Master Prompt: Admin Management & Analytics (Full CRUD UI)
Prompt: "Design a comprehensive Admin Dashboard for 'Pustaka Nusa'.
Sidebar: Vertical dark-themed sidebar containing icons for 'Statistik', 'Manajemen User', 'Katalog Buku', 'Kategori', and 'Laporan'.
Overview Section: 4 KPI Cards displaying: 'Total Buku' (Blue), 'User Aktif' (Green), 'Unduhan Hari Ini' (Orange), and 'E-book Terpopuler'. Use Chart.js-style line graphs inside the cards for visual data.
Management Table: A sophisticated data table for E-books. Columns: Cover, Judul, Kategori, Status (Active/Inactive Toggle), and 'Aksi' (Edit, Delete, View). Include a 'Tambah Buku Baru' button that opens a modal with a Dropzone.js area for PDF uploads.
Report Section: A specific area with a 'Cetak Laporan' title. Provide two large cards for 'Export PDF' and 'Export Excel' with their respective icons.
Visual Identity: Ensure the colors align with #4475F2. The layout should feel like a 'Professional Dashboard' (similar to Bootstrap/CoreUI) but with modern Gen Z aesthetics like 16px border-radius and soft blurs (glassmorphism) on the cards."

Instruksi Tambahan untuk Hasil Terbaik di Figma:
Untuk Dark Mode: Jika kamu ingin Figma langsung membuatkan variasi gelap, tambahkan kalimat: "Generate a secondary version for Dark Mode using background #0F172A and card surface #1E293B with light blue accents #789DFC" di akhir setiap prompt.

Kesesuaian Tech Stack: Karena kamu menggunakan Laravel + React (Tanpa Inertia), pastikan elemen seperti Dropzone dan Search Bar digambarkan sebagai komponen terpisah agar nanti saat kamu copy CSS-nya, kamu bisa langsung membungkusnya menjadi komponen React.

Font & Scaling: Prompt ini sudah menyertakan Inter dan Plus Jakarta Sans. Pastikan kamu memiliki font tersebut di sistem kamu agar Figma bisa merendernya dengan tepat.