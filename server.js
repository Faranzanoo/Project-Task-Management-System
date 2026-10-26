/**
 * Server pengembangan lokal (static file server).
 *
 * Situs ini murni statis dan di-deploy ke GitHub Pages, jadi server ini hanya
 * untuk pengembangan lokal. Hanya file yang dibutuhkan aplikasi yang dilayani
 * (bukan seluruh folder project), supaya package.json, node_modules, dan tes
 * tidak ikut terbuka.
 */

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Folder source aplikasi (model, controller, view, dst.)
app.use('/src', express.static(path.join(__dirname, 'src')));

// File di akar yang dibutuhkan index.html
app.get(['/app.js', '/styles.css'], (req, res) => {
    res.sendFile(path.join(__dirname, req.path));
});

// Semua route lain menampilkan halaman utama
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Jalankan server hanya jika file ini dieksekusi langsung (bukan saat di-require)
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server pengembangan berjalan di http://localhost:${PORT}`);
        console.log('Tekan Ctrl+C untuk menghentikan server');
    });

    process.on('SIGINT', () => {
        console.log('\nServer dihentikan.');
        process.exit(0);
    });
}

module.exports = app;
