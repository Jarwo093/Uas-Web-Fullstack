# Task Management API - UTS Pemrograman Web Fullstack

## 👨‍💻 Developer Identity
* **Nama:** Mohammad syfa eka cahyo
* **Universitas:** Universitas PGRI Madiun
* **Program Studi:** Teknik Informatika
* **Semester:** 6
* **Kelas:** B

## 📝 Deskripsi Project
Project ini adalah RESTful API untuk Sistem Manajemen Tugas (Task Management) yang dibangun menggunakan framework Laravel. API ini memfasilitasi pembuatan, pengelolaan, dan pelacakan status tugas dengan menerapkan sistem keamanan Role-Based Access Control (RBAC) menggunakan Laravel Sanctum.

## 🚀 Fitur Utama
* **Authentication & Authorization:** Register, Login, dan Logout menggunakan token Sanctum.
* **Role-Based Access Control (RBAC):** Pemisahan hak akses antara `Admin` (akses penuh) dan `User` (akses terbatas).
* **Project Management:** CRUD data proyek (Khusus Admin).
* **Task Management:** * Admin dapat membuat tugas dan mengalokasikannya ke pengguna tertentu.
  * Pengguna hanya dapat melihat tugas yang ditugaskan kepada mereka.
  * Pengguna dapat memperbarui status tugas mereka (contoh: todo, in_progress, done).
* **Database & Relasi:** Menggunakan Eloquent ORM dengan relasi antar tabel (Users, Projects, Tasks).

## 📸 Dokumentasi Postman (Screenshots)

1. **Register Sukses**
![Screenshot Register](public/assets/screenshots/1.png)

2. **Register Gagal (Email Duplikat)**
![Screenshot Register Gagal](public/assets/screenshots/2.png)

3. **Login Berhasil**
![Screenshot Login Berhasil](public/assets/screenshots/3.png)

4. **Login Gagal (Kredensial Salah)**
![Screenshot Login Gagal](public/assets/screenshots/4.png)

5. **Akses Ditolak Tanpa Token**
![Screenshot Ditolak Tanpa Token](public/assets/screenshots/5.png)

6. **User Melihat Daftar Task**
![Screenshot Get Tasks User](public/assets/screenshots/6.png)

7. **User Ditolak Masuk Area Admin**
![Screenshot Create Task Forbidden](public/assets/screenshots/7.png)

8. **Admin Berhasil Membuat Task**
![Screenshot Create Task Success](public/assets/screenshots/8.png)

9. **Update Status Task**
![Screenshot Update Status](public/assets/screenshots/9.png)

10. **Logout Berhasil**
![Screenshot Logout](public/assets/screenshots/10.png)

📁 **File Export Postman Collection:** [Download JSON disini](public/assets/Task-Management.postman_collection.json)

## 🛠️ Cara Instalasi & Menjalankan Project (Untuk Dosen/Penguji)
1. Clone repository ini.
2. Jalankan perintah `composer install`
3. Copy file `.env.example` menjadi `.env` lalu sesuaikan konfigurasi database.
4. Jalankan `php artisan key:generate`
5. Jalankan migrasi dan seeder: `php artisan migrate:fresh --seed`
6. Jalankan server lokal: `php artisan serve`