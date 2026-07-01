# Pitch Deck PoC - AI Video Storytelling Studio

## Konsep Visual Deck

**Arah desain:** cinematic, premium, dark UI, modern agency-tech. Deck harus terasa seperti produk kreatif untuk tim campaign, bukan SaaS generic.

**Mood:** dark studio, neon cyan, violet accent, video editing interface, AI canvas, campaign production.

**Warna utama:**
- Background: near black / deep navy `#070B14`
- Panel: dark slate `#101624`
- Line: muted blue-gray `#253047`
- Accent cyan: `#16C7D8`
- Accent violet: `#8B5CF6`
- Accent blue: `#4F7CFF`

**Tipografi:**
- Heading: bold, clean, modern
- Body: small, concise, high contrast
- Hindari paragraf panjang. Maksimal 3-5 bullet per slide.

**Asset utama:**
- Gunakan foto `public/images/login-background.png` sebagai hero/background di beberapa slide.
- Screenshot app dipakai sebagai visual utama pada slide produk.
- Pakai diagram alur sederhana untuk workflow.

**Gaya layout:**
- Full-bleed image background untuk opening dan closing.
- Dark panel/glass overlay untuk teks.
- Screenshot besar sebagai fokus, bukan banyak card kecil.
- Gunakan node/canvas visual sebagai motif utama.

---

## Slide 1 - Cover

**Judul:**  
AI Video Storytelling Studio

**Subtitle:**  
PoC for Campaign Video Creation Workflow

**Copy kecil:**  
From story input to AI-generated video timeline.

**Layout:**  
Full-screen hero. Background pakai `login-background.png`. Judul besar di kiri bawah atau kanan tengah, dengan overlay gelap tipis agar teks terbaca.

**Background:**  
Full-bleed cinematic editing desk image. Tambahkan gradient gelap dari kanan/kiri.

**Visual:**  
Logo/icon sederhana Sparkles atau Clapperboard. Tidak perlu banyak elemen.

**Presenter note:**  
Slide ini menjual kesan: produk ini adalah studio produksi video berbasis AI, bukan sekadar generator prompt.

---

## Slide 2 - Problem

**Judul:**  
Campaign Video Production Is Still Fragmented

**Isi:**
- Story, storyboard, prompt, asset reference, review, dan final render sering tersebar.
- Proses revisi lambat karena output AI tidak terhubung ke struktur campaign.
- Tim butuh cara cepat membuat versi video yang tetap konsisten secara visual.
- Client review butuh alur yang jelas dari ide sampai final timeline.

**Layout:**  
Kiri: teks problem. Kanan: visual pipeline yang putus-putus.

**Background:**  
Dark solid dengan subtle grid/canvas pattern.

**Visual:**  
Diagram horizontal terputus:
Brief → Script → Prompt → Video → Review → Render  
Berikan broken line atau gap antar proses.

**Presenter note:**  
Tekankan pain point workflow, bukan hanya "AI video mahal/lama".

---

## Slide 3 - Opportunity

**Judul:**  
A Studio Workflow for AI-Native Campaign Production

**Isi:**
- Brand story bisa langsung diubah menjadi scene structure.
- Setiap scene punya prompt, narration, camera direction, dan mood.
- Output video bisa di-review, di-retry, dan di-approve.
- Final timeline dirakit dari scene yang sudah lolos review.

**Layout:**  
Tengah: big statement. Bawah: 4 capability blocks kecil.

**Background:**  
Dark gradient atau crop dari background login yang dibuat lebih blur/dim.

**Visual:**  
4 icon: FileText, Clapperboard, Film, CheckCircle.

**Presenter note:**  
Ini transisi dari problem ke solusi: bukan generator satu-shot, tapi workflow produksi.

---

## Slide 4 - Product Concept

**Judul:**  
One Canvas: Story, Scenes, Outputs, Final Assembly

**Isi:**
- Story input menjadi sumber utama semua scene.
- AI menghasilkan scene nodes.
- Tiap scene bisa generate video output.
- Approved outputs masuk ke final timeline.

**Layout:**  
Screenshot canvas besar memenuhi 70% slide. Teks pendek di sisi kanan/kiri.

**Background:**  
Dark app UI background.

**Visual:**  
Screenshot workspace utama React Flow canvas.

**Presenter note:**  
Tunjukkan bahwa canvas adalah pusat kerja, bukan halaman form biasa.

---

## Slide 5 - User Flow

**Judul:**  
PoC User Flow

**Isi diagram:**
Login → Story Input → Generate Structure → Generate Scene Videos → Approve Outputs → Render Final MP4

**Layout:**  
Flow horizontal besar di tengah. Setiap step berupa node kecil dengan icon.

**Background:**  
Dark navy dengan garis cyan seperti connection line.

**Visual:**  
Gunakan style node graph/canvas. Bisa pakai connector line animated look.

**Presenter note:**  
Slide ini harus paling mudah dimengerti oleh stakeholder non-teknis.

---

## Slide 6 - Story Input & Reference Assets

**Judul:**  
Start From a Story and Production Direction

**Isi:**
- Input cerita dan karakter utama.
- Pilih tone, style, duration, aspect ratio, scene count, render quality.
- Upload reference image/video/audio untuk menjaga arah visual.
- Validasi input sebelum generate.

**Layout:**  
Kiri: screenshot Story Input node. Kanan: bullet pendek.

**Background:**  
Dark solid dengan highlight cyan pada area screenshot.

**Visual:**  
Screenshot node Story Input dalam mode edit atau filled.

**Presenter note:**  
Tekankan bahwa PoC sudah punya production settings, bukan cuma text prompt.

---

## Slide 7 - AI Scene Structure

**Judul:**  
AI Turns the Brief Into Production-Ready Scenes

**Isi:**
- Scene title
- Duration
- Narration
- Visual description
- Camera direction
- Mood
- Video prompt

**Layout:**  
Kiri: screenshot beberapa scene nodes. Kanan: daftar field scene.

**Background:**  
Dark canvas background.

**Visual:**  
Gunakan 2-3 scene node screenshot atau mock node cards.

**Presenter note:**  
Ini bagian yang menunjukkan nilai AI sebagai assistant creative director.

---

## Slide 8 - Video Generation & Versioning

**Judul:**  
Generate, Retry, and Compare Video Outputs

**Isi:**
- Generate video per scene.
- Output disimpan sebagai node video.
- Retry menghasilkan versi baru.
- User bisa download atau approve output.

**Layout:**  
Screenshot video output node besar di kanan. Kiri: compact bullet + cost/version callout.

**Background:**  
Dark with blue/violet accent.

**Visual:**  
Video output node dengan preview player dan tombol Approve/Retry/Download.

**Presenter note:**  
Jelaskan bahwa retry/versioning penting untuk workflow kreatif.

---

## Slide 9 - Final Timeline & Render

**Judul:**  
Approved Clips Become a Final Timeline

**Isi:**
- Approved scene otomatis masuk timeline.
- Final assembly menggabungkan clip.
- Optional BGM upload.
- Render final MP4 di browser menggunakan FFmpeg.

**Layout:**  
Atas: final timeline bar screenshot. Bawah kanan: render modal screenshot. Kiri: summary.

**Background:**  
Dark studio panel background.

**Visual:**  
Timeline approved clips + Render Final MP4 modal.

**Presenter note:**  
Ini menunjukkan end-to-end PoC: bukan berhenti di generate, tapi sampai file final.

---

## Slide 10 - Technical Architecture

**Judul:**  
PoC Architecture

**Isi:**
- Frontend: Next.js, React, Tailwind, React Flow
- Auth & Storage: Supabase
- AI Structure: Gemini / GenAI endpoint
- Video Generation: Veo/Fal provider endpoint
- Final Render: FFmpeg in browser
- Persistence: local workspace history + Supabase save

**Layout:**  
Diagram arsitektur sederhana.

**Background:**  
Dark solid. Gunakan box dan connector line.

**Visual diagram:**
User Browser → Next.js App → API Routes → AI Providers  
Next.js App → Supabase Auth/DB/Storage  
Browser → FFmpeg WASM → Final MP4

**Presenter note:**  
Jangan terlalu teknis. Fokus bahwa PoC sudah modular dan expandable.

---

## Slide 11 - PoC Scope Completed

**Judul:**  
What the PoC Already Demonstrates

**Isi:**
- Login/signup flow
- Story input and production settings
- Reference asset upload
- AI scene generation
- Scene-level video generation
- Output approval and timeline
- Final MP4 render
- Local workspace history
- Cost tracking

**Layout:**  
Checklist 2 kolom. Kanan bisa pakai screenshot kecil dashboard/workspace.

**Background:**  
Dark with subtle cyan glow.

**Visual:**  
Checklist dengan check icons. Jangan terlalu ramai.

**Presenter note:**  
Slide ini untuk membuktikan PoC sudah nyata dan testable.

---

## Slide 12 - Business Value

**Judul:**  
Why This Matters for Campaign Teams

**Isi:**
- Faster concept-to-video iteration.
- More structured AI video workflow.
- Easier internal and client review.
- Repeatable production template for campaign videos.
- Lower friction for producing multiple creative directions.

**Layout:**  
Big statement di kiri. 5 value points di kanan.

**Background:**  
Full-bleed image crop, lebih gelap dari cover.

**Visual:**  
Campaign production timeline / video editing image.

**Presenter note:**  
Bahasa slide ini boleh lebih bisnis daripada teknis.

---

## Slide 13 - Risks & Limitations

**Judul:**  
Known Risks and Constraints

**Isi:**
- AI policy can reject certain reference images or identity-specific prompts.
- Video quality depends on model, prompt clarity, and source references.
- Browser-based final render has file size and performance limits.
- AI generation cost needs budget controls and queue management.
- Collaboration and permissions are not yet production-grade.

**Layout:**  
Risk table dengan 2 kolom: Risk dan Mitigation.

**Background:**  
Dark plain, lebih serius.

**Mitigation examples:**
- Prompt sanitization
- Reference usage guidance
- Cost tracker
- Server-side render queue
- Role-based access

**Presenter note:**  
Slide ini membuat PoC terasa kredibel karena tidak overclaim.

---

## Slide 14 - Next Steps

**Judul:**  
Path From PoC to MVP

**Isi roadmap:**
1. Improve visual QA and prompt templates.
2. Add project collaboration and approval roles.
3. Add asset library and brand kit.
4. Add render queue and server-side final assembly.
5. Add export formats: storyboard PDF, pitch preview, client review link.

**Layout:**  
Roadmap horizontal 5 tahap.

**Background:**  
Dark gradient with cyan line path.

**Visual:**  
Milestone dots / roadmap line.

**Presenter note:**  
Tutup dengan arah pengembangan yang realistis dan bisa diestimasi.

---

## Slide 15 - Closing

**Judul:**  
From One Story to a Campaign-Ready Video Workflow

**Subtitle:**  
AI Video Storytelling Studio PoC

**CTA:**  
Next: validate with real campaign brief and production assets.

**Layout:**  
Full-screen image background. Judul besar di tengah/kiri. CTA kecil di bawah.

**Background:**  
Pakai `login-background.png`, crop berbeda dari cover.

**Visual:**  
Minimal. Bisa tambah small product UI screenshot sebagai floating preview.

**Presenter note:**  
Ending harus terasa confident dan siap demo.

---

## Prompt Singkat untuk Generate Deck

Gunakan prompt ini kalau mau minta AI bikin PPT:

```text
Create a 15-slide pitch deck for "AI Video Storytelling Studio", a PoC web app for campaign video production. Style: cinematic dark premium agency-tech, using deep navy/black backgrounds, cyan/violet accents, modern clean typography, glass UI panels, and video editing/AI canvas visual language. Use a full-bleed hero image concept based on an AI video editing studio background. The deck should be visual-heavy, concise, and suitable for presenting a working PoC to agency stakeholders.

Follow this slide outline exactly:
1. Cover
2. Problem
3. Opportunity
4. Product Concept
5. User Flow
6. Story Input & Reference Assets
7. AI Scene Structure
8. Video Generation & Versioning
9. Final Timeline & Render
10. Technical Architecture
11. PoC Scope Completed
12. Business Value
13. Risks & Limitations
14. Next Steps
15. Closing

For each slide, use short copy, strong hierarchy, and clear visual layout. Include placeholders for screenshots from the app: login page, canvas workspace, story node, scene nodes, video output node, final timeline, and render modal.
```

