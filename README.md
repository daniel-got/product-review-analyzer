# Product Review Analyzer (AI-Powered)

Aplikasi analisis ulasan produk cerdas yang menggunakan **Hugging Face** untuk analisis sentimen dan **Google Gemini** untuk ekstraksi poin penting serta penentuan rating otomatis. Dibangun dengan gaya desain **Neo-Brutalism**.

![Tech Stack](https://img.shields.io/badge/Stack-Pyramid%20%7C%20React%20%7C%20PostgreSQL-black?style=for-the-badge)

## Fitur 
1.  **Analisis Sentimen Otomatis**: Mendeteksi apakah ulasan bersifat POSITIVE atau NEGATIVE menggunakan model `DistilBERT` (via Hugging Face).
2.  **Smart Rating Inference**: Menggunakan LLM (Gemini 2.5 Flash) untuk membaca nuansa ulasan dan memberikan rating bintang (1-5) secara otomatis.
3.  **Key Point Extraction**: Meringkas ulasan panjang menjadi 3 poin utama (Bullet points).
4.  **History & Persistence**: Menyimpan semua hasil analisis ke database PostgreSQL.
5.  **Neo-Brutalism UI**: Antarmuka React yang berani, kontras tinggi, dan responsif.

---

## Teknologi yang Digunakan

### Backend (`/backend`)
* **Framework**: Pyramid (Python)
* **Database**: PostgreSQL + SQLAlchemy ORM
* **AI Services**:
    * `huggingface_hub` (Sentiment Analysis)
    * `google-generativeai` (Gemini API)
* **Transaction Manager**: `pyramid_tm`

### Frontend (`/frontend`)
* **Framework**: React + Vite
* **Styling**: Pure CSS (Neo-Brutalism Theme)
* **HTTP Client**: Axios
* **Icons**: Lucide React

---

## Persyaratan Sistem (Prerequisites)
Pastikan di komputer Anda sudah terinstall:
* Python 3.11+
* Node.js 18+ & npm
* PostgreSQL Server

---

## 🚀 Cara Menjalankan Aplikasi

### Langkah 1: Setup Backend
1.  Masuk ke folder backend:
    ```bash
    cd backend
    ```

2.  Buat dan aktifkan virtual environment:
    ```bash
    python -m venv venv
    # Windows:
    venv\Scripts\activate
    # Mac/Linux:
    source venv/bin/activate
    ```

3.  Install dependensi:
    ```bash
    pip install "pyramid==2.0.2" "waitress" "SQLAlchemy" "psycopg2" "zope.sqlalchemy" "pyramid_tm" "requests" "google-generativeai" "python-dotenv" "huggingface_hub"
    ```

4.  Konfigurasi Environment Variables:
    Buat file `.env` di dalam folder `backend/` dan isi dengan:
    ```ini
    DATABASE_URL=postgresql://user:password@localhost:5432/review_db
    GEMINI_API_KEY=masukkan_api_key_gemini_disini
    HUGGINGFACE_API_TOKEN=masukkan_token_hf_disini
    ```

5.  Inisialisasi Database (Reset & Create Tables):
    ```bash
    python reset_db.py
    ```

6.  Jalankan Server:
    ```bash
    python -m backend.main
    ```
    *Server akan berjalan di `http://0.0.0.0:6543`*

---

### Langkah 2: Setup Frontend
1.  Buka terminal baru dan masuk ke folder frontend:
    ```bash
    cd frontend
    ```

2.  Install dependensi (Node Modules):
    ```bash
    npm install
    ```

3.  Jalankan Development Server:
    ```bash
    npm run dev
    ```

4.  Buka browser dan akses:
    `http://localhost:5173`

---

## Pengujian API (Optional)
Jika ingin menguji backend tanpa frontend, gunakan cURL:

**Analyze Review (POST):**
```bash
curl -X POST http://localhost:6543/api/analyze-review \
-H "Content-Type: application/json" \
-d '{"product_name": "Kopi Kenangan", "review_text": "Rasanya enak tapi pengiriman lama.", "rating": 0}'

```

## Dokumentasi Frontend

