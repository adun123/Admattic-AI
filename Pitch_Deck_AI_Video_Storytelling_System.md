# Pitch Deck - AI Video Storytelling System

## Slide 1 - Cover

### AI Video Storytelling System

Sistem internal untuk mengubah cerita teks menjadi video anniversary, campaign, founder story, dan konten pendek berbasis AI.

Prepared for internal agency production.

---

## Slide 2 - Background

Agency sering membutuhkan video dengan tempo produksi cepat untuk berbagai kebutuhan internal maupun client-facing.

Contoh kebutuhan:

- Video anniversary perusahaan
- Founder story
- Company journey
- Campaign internal
- Social media Reels
- Video presentasi singkat

Namun proses produksi video tradisional membutuhkan waktu, biaya, koordinasi, dan proses revisi yang cukup besar.

---

## Slide 3 - Current Challenge

### Produksi video masih berat untuk kebutuhan cepat

Tantangan utama:

- Membutuhkan proses kreatif dari nol
- Script dan storyboard sering memakan waktu
- Produksi visual membutuhkan talent, lokasi, kru, dan jadwal
- Revisi visual sulit dilakukan jika sudah masuk tahap produksi
- Output video pendek tetap membutuhkan banyak tahapan
- AI video mandiri sering menghasilkan visual yang tidak konsisten

Akibatnya, ide kreatif yang sederhana bisa menjadi proses produksi yang panjang.

---

## Slide 4 - Opportunity

### AI dapat mempercepat proses kreatif, bukan menggantikan tim kreatif

Dengan workflow yang tepat, AI dapat membantu agency:

- Mengubah cerita mentah menjadi script
- Membuat storyboard otomatis
- Menyusun prompt visual per scene
- Menghasilkan draft video per scene
- Mempercepat proses revisi
- Membuat variasi visual lebih cepat

Nilai utamanya bukan sekadar otomatisasi, tetapi mempercepat creative production dengan tetap menjaga kontrol manusia.

---

## Slide 5 - Proposed Solution

### Internal AI Video Storytelling System

Sistem internal yang membantu tim agency mengubah cerita teks menjadi video pendek siap pakai.

User cukup memasukkan cerita atau brief, lalu sistem membantu membuat:

- Script video
- Storyboard
- Scene breakdown
- Visual direction
- Prompt video per scene
- Voice-over script
- Subtitle
- Final video export

Creative team tetap dapat mengedit, memilih, dan memperbaiki hasil sebelum video final dibuat.

---

## Slide 6 - Product Positioning

### Dari cerita mentah menjadi video naratif

Platform ini diposisikan sebagai:

**AI-assisted internal video production tool**

Bukan sekadar text-to-video generator.

Perbedaannya:

- Generator biasa hanya menerima prompt dan menghasilkan video
- Sistem ini membangun workflow produksi dari cerita sampai final output
- Setiap scene bisa direview dan direvisi
- Tim kreatif tetap menjadi quality control
- Output lebih cocok untuk kebutuhan agency dan storytelling

---

## Slide 7 - How It Works

### Workflow sederhana

1. User input cerita atau brief
2. AI membuat script video
3. AI membuat storyboard dan scene breakdown
4. User review dan edit
5. Sistem generate video per scene
6. User revisi atau regenerate scene
7. Sistem menambahkan voice-over dan subtitle
8. Sistem export final video

Output akhir berupa video pendek untuk anniversary, campaign, founder story, atau Reels.

---

## Slide 8 - Example Use Case

### Video Anniversary 1 Menit

Input user:

"Kami memulai perjalanan sebagai tim kecil dengan mimpi besar. Selama bertahun-tahun, kami menghadapi tantangan, bertumbuh bersama client, dan terus berinovasi. Hari ini, kami merayakan perjalanan itu sebagai bukti bahwa kolaborasi dapat menciptakan dampak besar."

Sistem menghasilkan:

- Script narasi 60 detik
- 6-8 scene storyboard
- Visual direction cinematic corporate
- Voice-over Bahasa Indonesia
- Subtitle
- Video final 9:16 atau 16:9

---

## Slide 9 - Human-in-the-Loop

### AI mempercepat, manusia menyempurnakan

AI membantu membuat draft awal dengan cepat, tetapi creative team tetap mengontrol kualitas akhir.

Peran AI:

- Membuat struktur narasi
- Membagi cerita menjadi scene
- Membuat prompt visual
- Generate video draft

Peran manusia:

- Memperbaiki script
- Menentukan tone dan style
- Memilih hasil visual terbaik
- Melakukan revisi scene
- Menjamin hasil akhir sesuai brand dan konteks

---

## Slide 10 - MVP Features

### Fitur utama tahap awal

MVP fokus pada workflow inti:

- Login internal sederhana
- Create project
- Input cerita atau brief
- AI script builder
- AI storyboard generator
- Scene breakdown
- Visual style selector
- Prompt generator per scene
- Video generation per scene
- Regenerate scene
- Voice-over script
- Subtitle sederhana
- Export MP4

---

## Slide 11 - MVP Scope

### Fokus agar bisa selesai dalam 1 bulan

Scope yang disarankan:

- Video pendek 30-60 detik
- 5-8 scene per video
- Format 9:16 untuk Reels
- Format 16:9 untuk presentasi
- Bahasa Indonesia
- Review manual oleh creative team
- Export final MP4

Yang belum masuk MVP:

- Mobile app
- Full video editor kompleks
- Multi-user approval besar
- Custom AI model training
- Billing atau token system
- SaaS publik

---

## Slide 12 - POC Plan

### Proof of Concept sebelum full development

POC bertujuan membuktikan bahwa cerita teks bisa diubah menjadi draft video yang layak secara visual dan naratif.

POC output:

- 1 sample cerita anniversary
- 1 script video 60 detik
- 5-8 storyboard scene
- 1-2 generated video scene
- 1 rough preview final

POC ini menjadi dasar untuk menentukan kualitas, provider AI, workflow revisi, dan scope MVP.

---

## Slide 13 - Technical Direction

### Arsitektur awal

Komponen sistem:

- Web app internal
- Backend API
- Database project dan scene
- AI script and storyboard engine
- AI video provider integration
- Text-to-speech integration
- Video storage
- Final video composer

Provider yang perlu dievaluasi:

- AI video: Kling, Luma, Runway, Pika, Veo jika tersedia
- LLM: OpenAI, Gemini, Anthropic
- Voice-over: ElevenLabs, OpenAI TTS, Google TTS
- Storage: Supabase, Cloudflare R2, AWS S3

---

## Slide 14 - Timeline

### Estimasi 1 bulan

Week 1 - Discovery and Prototype Setup

- Finalisasi sample use case
- Finalisasi user flow
- Pilih visual style
- Setup project dan AI workflow awal

Week 2 - Core Workflow

- Story input
- Script generation
- Storyboard generation
- Scene breakdown
- Prompt generation

Week 3 - Video Generation

- Integrasi AI video provider
- Generate scene
- Review scene
- Regenerate scene
- Store output video

Week 4 - Final Output

- Voice-over
- Subtitle
- Compose final video
- Export MP4
- Testing dan demo

---

## Slide 15 - Budget Direction

### Budget range awal: 25-30

Budget digunakan untuk membangun MVP internal dengan scope terbatas dan timeline sekitar 1 bulan.

Catatan penting:

- Perlu dikonfirmasi apakah angka 25-30 sudah termasuk biaya AI API dan video generation.
- Biaya AI video dapat berubah tergantung jumlah generate dan regenerate.
- MVP sebaiknya memiliki limit jumlah scene dan durasi video agar budget tetap terkendali.

---

## Slide 16 - Expected Benefits

### Manfaat untuk agency

- Mempercepat proses produksi video pendek
- Membantu creative team membuat draft lebih cepat
- Mengurangi ketergantungan pada proses shooting awal
- Membuat revisi lebih modular per scene
- Membantu founder dan team menuangkan cerita menjadi video
- Menjadi sistem internal yang bisa dikembangkan untuk kebutuhan campaign berikutnya

---

## Slide 17 - Success Criteria

### MVP dianggap berhasil jika:

- User dapat membuat project video baru
- User dapat memasukkan cerita anniversary
- AI menghasilkan script dan storyboard
- User dapat mengedit scene
- Sistem dapat generate beberapa video clip
- User dapat regenerate scene tertentu
- Sistem dapat export video final MP4
- Creative team merasa workflow ini mempercepat produksi draft video

---

## Slide 18 - Risks and Mitigation

### Risiko utama

- Output AI video belum selalu konsisten
- Karakter bisa berubah antar scene
- Biaya regenerate bisa membesar
- Provider AI video bisa memiliki batasan API
- Timeline 1 bulan membutuhkan scope yang ketat

### Mitigasi

- Gunakan scene-based workflow
- Batasi durasi video dan jumlah scene
- Pakai human review sebelum final render
- Simpan prompt agar bisa diperbaiki
- Mulai dari POC sebelum full MVP

---

## Slide 19 - Recommended Next Step

### Mulai dari POC

Langkah berikutnya:

1. Pilih satu cerita anniversary sebagai sample.
2. Tentukan visual style utama.
3. Buat script dan storyboard.
4. Generate 1-2 scene video.
5. Review hasil bersama client.
6. Finalisasi scope MVP.
7. Masuk development 1 bulan.

POC akan membantu memastikan kualitas output dan arah teknis sebelum budget dan timeline MVP dikunci.

---

## Slide 20 - Closing

### From Story to Video, Faster

Dengan sistem ini, agency dapat mengubah cerita internal menjadi video naratif yang lebih cepat, lebih terstruktur, dan lebih mudah direvisi.

AI menjadi akselerator produksi, sementara creative team tetap memegang kontrol kualitas dan storytelling.

