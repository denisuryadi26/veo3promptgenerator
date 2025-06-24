# Veo3 Prompt Generator

Generator prompt video sinematik untuk Veo 3 dalam Bahasa Indonesia dan Inggris dengan integrasi Gemini AI.

## Setup

### 1. Konfigurasi API Key

Sebelum menggunakan aplikasi, Anda perlu mengatur API key Gemini:

1. Copy file `config.template.js` menjadi `config.js`:
   ```bash
   cp config.template.js config.js
   ```

2. Edit file `config.js` dan ganti `YOUR_GEMINI_API_KEY_HERE` dengan API key Gemini Anda:
   ```javascript
   const CONFIG = {
     GEMINI_API_KEY: 'AIzaSyDO65JAzRl0aEry-xxxxxxxxxxxxxxxx', // Ganti dengan API key Anda
     GEMINI_MODEL: 'gemini-1.5-flash-latest'
   };
   ```

3. **PENTING**: File `config.js` sudah ditambahkan ke `.gitignore` untuk keamanan. Jangan commit file ini ke repository.

### 2. Mendapatkan API Key Gemini

1. Kunjungi [Google AI Studio](https://aistudio.google.com/)
2. Login dengan akun Google Anda
3. Buat API key baru
4. Copy API key dan masukkan ke file `config.js`

## Fitur

- ✅ Generator prompt video sinematik
- ✅ Terjemahan otomatis Indonesia ↔ Inggris
- ✅ Analisis gambar untuk deskripsi subjek dan tempat
- ✅ Perbaikan prompt otomatis
- ✅ Sistem koin untuk penggunaan API
- ✅ Simpan/muat karakter dan tempat favorit
- ✅ Integrasi langsung dengan Gemini

## Keamanan

- API key disimpan dalam file konfigurasi terpisah
- File konfigurasi tidak di-commit ke repository
- Template konfigurasi disediakan untuk setup mudah

## Penggunaan

1. Buka `index.html` di browser
2. Isi form dengan detail video yang diinginkan
3. Klik "Generate Prompt" untuk membuat prompt
4. Gunakan fitur "Perbaiki" jika prompt ditolak Veo
5. Copy prompt dan gunakan di Veo 3

## Troubleshooting

Jika muncul error "API key tidak ditemukan":
1. Pastikan file `config.js` sudah dibuat
2. Pastikan API key sudah diisi dengan benar
3. Refresh halaman browser
Sebuah generator prompt AI untuk berbagai kebutuhan menggunakan model bahasa.
