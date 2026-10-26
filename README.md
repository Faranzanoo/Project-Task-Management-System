# ✅ Task Management System

Aplikasi manajemen tugas berbasis web yang berjalan sepenuhnya di browser. Dibangun dengan **vanilla JavaScript (ES6 classes)** memakai arsitektur **MVC + Repository**, menyimpan data di `localStorage`, dan diuji dengan **Jest**.

Setelah GitHub Pages dipastikan aktif, buka komentar ini dan sesuaikan tautannya:
**Demo:** https://faranzanoo.github.io/Project-Task-Management-System/

---

## ✨ Fitur

- **Akun pengguna** — registrasi dan login dengan username (simulasi untuk pembelajaran, tanpa password; lihat [Keterbatasan](#-keterbatasan))
- **Manajemen task** — buat, tandai selesai / belum selesai, dan hapus task
- **Kategori** — Personal, Work, Study, Health, Finance, Other
- **Prioritas** — Low, Medium, High, Urgent
- **Due date, estimasi jam, dan tags** untuk setiap task
- **Assign task** ke pengguna lain
- **Pencarian dan pengurutan** (terbaru, terlama, judul A–Z / Z–A, prioritas, due date)
- **Filter status** — Pending, In Progress, Completed, Blocked
- **Dashboard** — statistik task, daftar **overdue**, dan task yang **jatuh tempo dalam 3 hari**
- **Export data** aplikasi
- **Penyimpanan lokal** — data tetap ada setelah halaman di-refresh

---

## 🏗️ Arsitektur

```
.
├── index.html            # Halaman utama
├── app.js                # Titik masuk: menyusun storage, repository, controller, dan view
├── styles.css
├── server.js             # Server statis untuk pengembangan lokal
├── src/
│   ├── models/           # User, Task, EnhancedTask (validasi dan aturan bisnis)
│   ├── repositories/     # UserRepository, TaskRepository (akses data, query, statistik)
│   ├── controllers/      # UserController, TaskController (alur kerja aplikasi)
│   ├── views/            # TaskView (render DOM, di-escape dari input pengguna)
│   ├── services/         # TaskService
│   └── utils/            # StorageManager, EnhancedStorageManager (localStorage + metadata + export/import)
├── tests/                # Tes Jest (models, repositories, controllers, services, utils)
└── requirements.md       # User story dan acceptance criteria
```

Alurnya: **View** menangkap aksi pengguna → **Controller** memvalidasi dan mengoordinasi → **Repository** membaca/menulis lewat **StorageManager** → **Model** menjaga aturan data.

---

## 🛠️ Teknologi

| Bagian | Yang dipakai |
|---|---|
| Frontend | HTML, CSS, JavaScript (ES6), tanpa framework |
| Penyimpanan | `localStorage` |
| Server dev | Node.js + Express (hanya melayani file statis) |
| Pengujian | Jest + jsdom |
| Kualitas kode | ESLint, Prettier |

---

## 🚀 Menjalankan

Prasyarat: **Node.js 18+**.

```bash
npm install
npm start
```

Buka `http://localhost:3000`.

Perintah lain:

```bash
npm test          # jalankan tes + laporan cakupan
npm run lint      # ESLint
npm run format    # Prettier
```

---

## 🧪 Pengujian

Ada **102 tes** di 8 suite yang mencakup model, repository, controller, service, dan storage. Cakupan saat ini sekitar **60%**. Bagian yang belum diuji adalah `TaskView` (render DOM) dan `UserController`, dan itu menjadi langkah berikutnya.

---

## ⚠️ Keterbatasan

- **Login hanya memakai username, tanpa password.** Ini simulasi autentikasi untuk pembelajaran, bukan sistem keamanan.
- **Data tersimpan di `localStorage` browser**, jadi tidak tersinkron antar perangkat dan bisa dibaca siapa pun yang memakai browser yang sama.
- **Fitur edit task belum diimplementasikan** di antarmuka (tombol edit masih berupa stub).

---

## 🗺️ Pengembangan Selanjutnya

- [ ] Implementasi edit task di antarmuka
- [ ] Tes untuk `TaskView` dan `UserController`
- [ ] Backend dan autentikasi sungguhan (password ter-hash, database)

---

## 📚 Catatan Project

Project ini dikembangkan mengikuti kurikulum kursus **Software Engineering Shortcourse**. Struktur awal (starter project), user story, dan konfigurasi tooling berasal dari materi kursus.

---

© 2026 Titan Faranzano. Source code ditampilkan untuk dilihat dan dipelajari; penggunaan ulang tidak diizinkan tanpa izin tertulis.
