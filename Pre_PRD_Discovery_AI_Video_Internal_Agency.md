# Pre-PRD Discovery - AI Video Internal Agency

## 1. Project Context

Client adalah kantor agency yang ingin memiliki sistem internal untuk membantu tim kreatif membuat video dari cerita teks. Sistem ini akan dipakai oleh internal team, bukan sebagai SaaS publik pada tahap awal.

Use case utama adalah pembuatan video anniversary, campaign internal, company story, founder story, dan konten pendek seperti Reels berdurasi sekitar 1 menit.

Produk ini tetap membutuhkan manusia dalam prosesnya. AI digunakan untuk mempercepat script, storyboard, prompt, dan video generation, sedangkan manusia berperan untuk memperbaiki narasi, memilih visual terbaik, melakukan revisi, dan memastikan hasil akhir tetap berkualitas.

## 2. Client Requirements

### Business Context

- Client: kantor agency
- Pengguna sistem: internal team
- Target penggunaan: video anniversary dan kebutuhan kreatif internal lain
- Target output: video pendek sekitar 1 menit, termasuk format Reels
- Timeline project: sekitar 1 bulan
- Budget range: 25-30
- Kualitas output: cukup layak untuk kebutuhan presentasi, campaign, dan konten internal agency

### User Role

- Agency creative team
- Founder

## 3. Problem Definition

Agency membutuhkan sistem internal yang dapat membantu mengubah cerita teks menjadi draft video anniversary dan konten pendek secara lebih cepat, terstruktur, dan mudah direvisi oleh tim kreatif.

Masalah utama bukan hanya membuat video otomatis, tetapi membantu tim internal mempercepat proses dari ide cerita menjadi script, storyboard, scene visual, dan video final yang tetap dapat dikurasi manusia.

## 4. Product Goal

Membangun MVP sistem internal yang memungkinkan tim agency membuat video pendek dari cerita teks melalui workflow AI-assisted production.

Tujuan MVP:

- Mempercepat proses ide ke video draft.
- Membantu user non-teknis membuat script dan storyboard.
- Membuat scene breakdown yang bisa direvisi.
- Menghasilkan video pendek sekitar 1 menit.
- Memberikan kontrol manusia untuk memperbaiki hasil AI.
- Menjadi fondasi awal untuk sistem produksi video internal agency.

## 5. User Journey

1. User membuat project baru.
2. User input cerita atau brief video.
3. AI membuat script video.
4. AI membuat storyboard dan scene breakdown.
5. User review dan edit script atau scene.
6. Sistem generate video per scene.
7. User review hasil video.
8. User melakukan revisi scene jika diperlukan.
9. Sistem menyusun final video.
10. User export video final.

## 6. Feature Brainstorming

Fitur yang disepakati untuk arah MVP:

- Input cerita teks.
- AI script builder.
- AI storyboard generator.
- Scene breakdown.
- Visual style selector.
- Prompt generator per scene.
- Video generation per scene.
- Manual review oleh creative team.
- Regenerate scene.
- Voice-over script.
- Subtitle sederhana.
- Export video final.

## 7. MVP Scope Recommendation

### MVP yang Disarankan

MVP sebaiknya fokus pada internal workflow sederhana:

- Login sederhana untuk internal user.
- Create project.
- Input cerita.
- Generate script.
- Generate storyboard berbasis text.
- Generate prompt per scene.
- Generate video clip per scene melalui provider AI video.
- Review dan edit scene.
- Regenerate scene tertentu.
- Export final video pendek.

### Batasan MVP

- Durasi video dibatasi sekitar 30-60 detik.
- Output awal fokus pada format 9:16 untuk Reels dan 16:9 untuk presentasi.
- Tidak perlu video editor kompleks.
- Tidak perlu multi-user approval workflow kompleks.
- Tidak perlu custom model training.
- Tidak perlu SaaS billing.
- Tidak perlu mobile app.

## 8. Human-in-the-Loop Workflow

Karena kualitas AI video belum selalu stabil, sistem harus dirancang dengan manusia sebagai reviewer.

Peran manusia:

- Memperbaiki script.
- Memilih gaya visual.
- Mengedit prompt scene.
- Memilih hasil video terbaik.
- Melakukan regenerate jika output kurang cocok.
- Memastikan video final sesuai konteks anniversary atau campaign.

AI berperan sebagai akselerator, bukan pengganti penuh tim kreatif.

## 9. Technical Direction

### Rekomendasi Arsitektur MVP

MVP dapat dibuat sebagai web app internal.

Komponen utama:

- Frontend web app untuk input, review, dan export.
- Backend API untuk project management dan orchestration.
- Database untuk menyimpan project, script, scene, prompt, dan status generation.
- Queue system untuk proses video generation.
- Storage untuk menyimpan clip video dan final render.
- Integrasi LLM untuk script dan storyboard.
- Integrasi AI video provider untuk generate scene.
- Integrasi text-to-speech untuk voice-over.
- Video composer untuk menyatukan clip, audio, subtitle, dan transisi.

### Provider yang Perlu Dievaluasi

AI video provider:

- Kling
- Luma
- Runway
- Pika
- Veo, jika API/access tersedia

LLM:

- OpenAI
- Anthropic
- Gemini

Text-to-speech:

- ElevenLabs
- OpenAI TTS
- Google TTS

Storage:

- Cloudflare R2
- AWS S3
- Supabase Storage

Database:

- PostgreSQL
- Supabase

Video composition:

- FFmpeg
- Remotion, jika ingin rendering berbasis web/component

## 10. Technical Risks

- AI video API belum tentu stabil atau tersedia secara publik.
- Hasil video bisa tidak konsisten antar scene.
- Karakter manusia bisa berubah wajah antar clip.
- Biaya generate bisa membengkak jika regenerate terlalu sering.
- Rendering final video bisa butuh waktu lama.
- Timeline 1 bulan berarti scope harus sangat ketat.

## 11. Technical Recommendations

Untuk timeline 1 bulan, sistem sebaiknya tidak langsung mengejar otomatisasi penuh.

Rekomendasi approach:

1. Buat MVP berbasis project dan scene.
2. Gunakan AI untuk script, storyboard, dan prompt terlebih dahulu.
3. Integrasi video generation sebagai modular provider.
4. Batasi durasi output ke 30-60 detik.
5. Batasi jumlah scene, misalnya 5-8 scene per video.
6. Tambahkan regenerate scene, bukan regenerate full video.
7. Simpan semua prompt agar creative team bisa belajar dan memperbaiki.
8. Prioritaskan workflow review yang nyaman untuk manusia.

## 12. Suggested MVP Timeline - 1 Month

### Week 1 - Discovery and Design

- Finalisasi user flow.
- Finalisasi feature scope.
- Pilih provider AI video.
- Buat wireframe.
- Definisikan data model.

### Week 2 - Core App Development

- Login internal sederhana.
- Project creation.
- Story input.
- Script generation.
- Scene breakdown.
- Prompt generation.

### Week 3 - Video Generation Workflow

- Integrasi AI video provider.
- Scene status tracking.
- Review scene.
- Regenerate scene.
- Storage video clip.

### Week 4 - Final Render and Polish

- Voice-over generation.
- Subtitle sederhana.
- Compose final video.
- Export MP4.
- Testing end-to-end.
- Demo preparation.

## 13. MVP Success Criteria

MVP dianggap berhasil jika:

- Internal user bisa membuat project video baru.
- User bisa memasukkan cerita anniversary.
- AI bisa menghasilkan script dan storyboard.
- User bisa mengedit scene.
- Sistem bisa generate beberapa video clip.
- User bisa regenerate scene tertentu.
- Sistem bisa export video final sekitar 1 menit.
- Creative team merasa workflow ini mempercepat proses produksi draft.

## 14. Open Questions for Client

- Budget 25-30 yang dimaksud apakah juta rupiah?
- Apakah budget tersebut termasuk biaya AI generation/API usage?
- Output video wajib 1 menit penuh atau boleh MVP 30-45 detik dahulu?
- Apakah video anniversary memakai footage/foto asli perusahaan atau full AI visual?
- Apakah sistem perlu upload asset seperti logo, foto founder, atau brand guideline?
- Apakah voice-over harus Bahasa Indonesia saja?
- Apakah hasil video perlu approval founder sebelum export?
- Apakah akan ada lebih dari satu user internal pada MVP?

