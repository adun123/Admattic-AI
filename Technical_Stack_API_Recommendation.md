# Technical Stack & API Recommendation

## 1. Recommended Direction

Untuk POC dan MVP 1 bulan, produk sebaiknya dibangun sebagai web app internal dengan canvas workspace.

Prioritas utama:

- Cepat dibangun.
- Mudah demo ke client.
- Bisa integrasi AI secara modular.
- Bisa ganti provider video AI tanpa bongkar sistem besar.
- Fokus ke workflow: story -> scene -> prompt -> video output -> timeline.

## 2. Recommended POC Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- React Flow

Alasan:

- Next.js cocok untuk full-stack web app cepat.
- React Flow cocok untuk canvas node-based seperti Figma/Miro-lite.
- TypeScript membantu menjaga struktur data scene, prompt, dan output.
- Tailwind cepat untuk membuat UI dashboard dan workspace.

### Backend

- Next.js API Routes atau NestJS

Rekomendasi POC:

- Gunakan Next.js API Routes terlebih dahulu agar development lebih cepat.

Rekomendasi MVP lebih serius:

- Pisahkan backend menjadi NestJS jika logic queue, provider integration, dan rendering mulai kompleks.

### Database

- PostgreSQL
- Supabase sebagai opsi cepat

Rekomendasi:

- Untuk POC: Supabase PostgreSQL
- Untuk MVP: tetap bisa lanjut dengan Supabase atau pindah ke managed PostgreSQL

### Storage

- Supabase Storage untuk POC
- Cloudflare R2 atau AWS S3 untuk MVP

Digunakan untuk:

- Reference image
- Logo
- Uploaded asset
- Generated video clip
- Final rendered video

### Queue / Background Job

Untuk POC:

- Simple database status polling
- Cron/background worker sederhana

Untuk MVP:

- BullMQ + Redis
- Inngest
- Trigger.dev

Digunakan untuk:

- Video generation job
- Voice-over generation
- Final video rendering
- Retry jika provider gagal

### Video Composition

- FFmpeg

Digunakan untuk:

- Merge clips
- Add voice-over
- Add background music
- Add subtitles
- Export MP4

Alternatif jika butuh rendering UI-based:

- Remotion

## 3. AI APIs Needed

### 3.1 LLM API

Digunakan untuk:

- Rewrite cerita menjadi script
- Membuat struktur narasi
- Membuat scene breakdown
- Membuat prompt per scene
- Membuat camera direction
- Membuat subtitle text

Rekomendasi:

- OpenAI API

Output dari LLM sebaiknya structured JSON, contoh:

```json
{
  "title": "Anniversary Journey",
  "duration": 60,
  "scenes": [
    {
      "scene_number": 1,
      "duration": 8,
      "narration": "Kami memulai dari tim kecil dengan mimpi besar.",
      "visual_description": "Small creative team working late in a modest office.",
      "camera_direction": "Slow dolly-in, medium wide shot.",
      "mood": "Warm, nostalgic",
      "prompt": "Cinematic corporate video..."
    }
  ]
}
```

### 3.2 Video Generation API

Digunakan untuk:

- Generate video per scene.
- Generate alternative output saat regenerate.
- Membuat clip 5-10 detik per scene.

Provider yang layak dievaluasi:

#### Option A - OpenAI Sora API

Kegunaan:

- Text-to-video.
- Cocok jika akses API tersedia.
- Bisa menjadi opsi utama jika ingin satu ekosistem dengan LLM dan TTS.

Catatan:

- Perlu validasi akses akun dan pricing.
- Cocok untuk pipeline yang ingin sederhana.

#### Option B - Luma Dream Machine API

Kegunaan:

- Text-to-video.
- Mendukung model Ray.
- Mendukung duration, resolution, aspect ratio, keyframes, dan camera motion.

Catatan:

- Bagus untuk POC karena API video generation cukup eksplisit.
- Perlu tes hasil untuk corporate anniversary style.

#### Option C - Runway API

Kegunaan:

- Generative video model via API.
- Cocok untuk creative production.
- Bisa dipakai sebagai provider alternatif atau premium.

Catatan:

- Perlu cek pricing dan akses developer account.

## 4. Text-to-Speech API

Digunakan untuk:

- Voice-over Bahasa Indonesia.
- Narasi final per video.

Rekomendasi:

- OpenAI TTS untuk integrasi sederhana.
- ElevenLabs jika butuh suara yang lebih cinematic atau banyak pilihan voice.

Untuk POC:

- Gunakan satu voice Bahasa Indonesia yang stabil.
- Voice-over bisa dibuat setelah script final approved.

## 5. Image / Reference Asset Handling

User dapat upload:

- Foto founder
- Foto team
- Logo agency
- Foto kantor
- Referensi visual

Untuk POC, reference image digunakan sebagai:

- Asset yang disimpan di project.
- Panduan prompt.
- Input image-to-video jika provider mendukung.

Catatan penting:

- Konsistensi wajah tidak boleh dijanjikan 100 persen pada MVP.
- Lebih aman pitch sebagai "visual reference assisted", bukan "perfect face cloning".

## 6. Suggested Architecture

```text
Frontend Canvas Workspace
        |
        v
Backend API
        |
        +--> PostgreSQL
        +--> Storage
        +--> LLM API
        +--> Video Generation Provider
        +--> TTS Provider
        +--> FFmpeg Renderer
```

## 7. Data Flow

1. User membuat project.
2. User input cerita, style, tone, duration, dan reference image.
3. Backend mengirim cerita ke LLM.
4. LLM mengembalikan script dan scene breakdown.
5. Frontend membuat node scene di canvas.
6. User edit scene jika perlu.
7. User klik generate pada scene.
8. Backend membuat video generation job.
9. Provider AI video mengembalikan video URL atau asset.
10. Backend menyimpan output ke storage.
11. Output node muncul di canvas.
12. User approve output.
13. Approved clips masuk timeline.
14. Backend generate voice-over.
15. FFmpeg compose final video.
16. User download MP4.

## 8. POC Feature Stack

Untuk POC, cukup bangun:

- Login sederhana atau tanpa login dulu jika demo lokal.
- Project create.
- Canvas workspace.
- Story input node.
- Generate scene nodes via LLM.
- Edit scene detail.
- Upload reference image.
- Generate 1-2 video scene via provider.
- Output video node.
- Simple timeline.
- Mock export atau FFmpeg export sederhana.

## 9. MVP Feature Stack

Untuk MVP 1 bulan:

- Internal login.
- Project dashboard.
- Canvas workspace.
- Scene and output versioning.
- Queue generation.
- Provider API wrapper.
- TTS.
- Subtitle.
- FFmpeg final render.
- Export MP4.
- Basic admin usage log.

## 10. Recommended Provider Strategy

Jangan hardcode satu provider video.

Buat abstraction:

```text
VideoProvider.generateVideo(scenePrompt)
VideoProvider.getStatus(jobId)
VideoProvider.downloadResult(jobId)
```

Dengan begitu sistem bisa mulai dari Luma atau Runway, lalu pindah ke Sora atau provider lain jika akses, harga, atau kualitas lebih baik.

## 11. Recommended Stack Summary

### POC

- Next.js
- React
- TypeScript
- Tailwind CSS
- React Flow
- Supabase PostgreSQL
- Supabase Storage
- OpenAI API untuk script/storyboard/prompt
- Luma atau Runway untuk video generation
- OpenAI TTS atau ElevenLabs untuk voice-over
- FFmpeg untuk final composition

### MVP

- Next.js frontend
- NestJS backend atau Next.js API jika scope tetap kecil
- PostgreSQL
- Cloudflare R2 atau S3
- BullMQ + Redis atau Inngest
- OpenAI LLM
- Pluggable video provider: Sora, Luma, Runway
- TTS provider
- FFmpeg/Remotion renderer

## 12. Main Technical Risks

- Akses video generation API belum tentu langsung tersedia.
- Biaya video generation bisa mahal.
- Output AI video tidak selalu stabil.
- Consistency character masih sulit.
- Render final video butuh job queue.
- Timeline 1 bulan berarti canvas workspace harus dibuat minimal dulu.

## 13. Recommendation for Next Step

Next step teknis:

1. Pilih 2 provider video untuk diuji.
2. Buat 1 sample anniversary prompt.
3. Generate 2-3 clip pendek dari provider berbeda.
4. Bandingkan kualitas, harga, durasi generate, dan API flow.
5. Setelah provider dipilih, baru kunci POC architecture.

