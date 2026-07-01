# PRD - Text-to-Video Storytelling Platform

## 1. Ringkasan Produk

Produk ini adalah platform AI yang mengubah cerita berbasis teks menjadi video naratif siap pakai. User dapat menulis cerita bebas, memilih gaya visual, lalu sistem membantu menyusun struktur narasi, storyboard, prompt visual, voice-over, musik, dan video final.

Tujuan utama produk bukan hanya membuat video dari prompt singkat, tetapi mengubah cerita mentah menjadi aset video yang lebih rapi, emosional, konsisten, dan layak digunakan untuk kebutuhan campaign, personal branding, company profile, edukasi, maupun konten media sosial.

## 2. Problem Statement

Banyak user memiliki cerita, ide campaign, atau narasi brand, tetapi tidak memiliki kemampuan produksi video profesional. Produksi tradisional membutuhkan biaya tinggi, waktu lama, talent, lokasi, kru, dan proses revisi yang rumit.

Di sisi lain, penggunaan AI video secara mandiri sering menghasilkan visual yang tidak konsisten, karakter berubah-ubah, camera movement kaku, dan kualitas narasi kurang kuat.

Platform ini hadir untuk menjembatani kebutuhan tersebut melalui sistem otomatis berbasis AI dengan workflow yang tetap dapat dikurasi.

## 3. Tujuan Produk

- Mengubah input cerita mentah menjadi video naratif yang terstruktur.
- Mengurangi waktu produksi video dari minggu menjadi hitungan hari atau jam untuk MVP sederhana.
- Membantu user non-teknis membuat video tanpa memahami prompt engineering.
- Menjaga konsistensi karakter, tone, style visual, dan alur cerita.
- Menyediakan workflow revisi modular per scene, bukan generate ulang seluruh video.

## 4. Target User

### Primary User

- Marketing team
- Creative agency
- Founder atau business owner
- Personal branding creator
- Campaign manager

### Secondary User

- Content creator
- HR atau training team
- Educator
- Event organizer

## 5. Use Case Utama

- User membuat video personal journey dari cerita teks.
- Brand membuat video campaign dari brief.
- Company membuat profile video dari deck atau narasi.
- Agency membuat draft video untuk presentasi ke client.
- Creator membuat video pendek untuk TikTok, Reels, Shorts, atau YouTube.

## 6. MVP Scope

### In Scope

- Input cerita teks manual.
- AI story restructuring menjadi script video.
- Scene breakdown otomatis.
- Pilihan style visual.
- Prompt generation per scene.
- Voice-over script generation.
- Storyboard preview berbasis text dan image placeholder.
- Generate video per scene melalui integrasi AI video provider.
- Review dan edit scene.
- Export final video.

### Out of Scope untuk MVP

- Full custom video editor seperti Premiere.
- Real-time collaborative editing.
- Advanced lip-sync karakter.
- Training custom AI model sendiri.
- Marketplace template.
- Mobile app native.
- Multi-user enterprise permission.

## 7. User Journey MVP

1. User login ke platform.
2. User membuat project baru.
3. User memasukkan cerita atau brief.
4. User memilih format video: 16:9, 9:16, atau 1:1.
5. User memilih durasi target: 30 detik, 60 detik, atau 90 detik.
6. User memilih gaya visual: cinematic realistic, anime, futuristic, corporate, documentary, atau abstract.
7. Sistem membuat script narasi.
8. Sistem membagi script menjadi beberapa scene.
9. User melihat storyboard preview.
10. User dapat mengedit script, scene, visual direction, dan voice-over.
11. Sistem generate asset video per scene.
12. User review hasil per scene.
13. User approve atau regenerate scene tertentu.
14. Sistem menyatukan video, voice-over, musik, subtitle, dan transisi.
15. User export video final.

## 8. Fitur Utama

### 8.1 Project Workspace

User dapat membuat dan mengelola project video.

Field utama:

- Project name
- Video objective
- Target audience
- Brand tone
- Duration
- Aspect ratio
- Visual style
- Status

### 8.2 Story Input

User dapat memasukkan cerita bebas dalam bentuk teks panjang.

Contoh input:

"Saya adalah orang biasa yang selalu percaya bahwa kerja sama bisa mengubah hidup. Awalnya saya hanya bekerja sebagai karyawan, tetapi setelah banyak bertemu orang dan melewati kegagalan, saya akhirnya membangun bisnis sendiri."

### 8.3 AI Script Builder

Sistem mengubah cerita mentah menjadi script video yang lebih kuat.

Output:

- Hook
- Main narration
- Emotional arc
- Closing message
- CTA opsional

### 8.4 Scene Breakdown

Sistem membagi script menjadi scene.

Setiap scene memiliki:

- Scene number
- Narration
- Visual description
- Character description
- Location
- Camera direction
- Mood
- Estimated duration
- Prompt

### 8.5 Visual Style Selector

Pilihan awal MVP:

- Cinematic realistic
- Corporate premium
- Documentary
- Stylized anime
- Futuristic abstract
- Social media dynamic

### 8.6 Character Consistency Layer

Sistem menyimpan deskripsi karakter utama agar visual tetap konsisten.

Data karakter:

- Name atau label karakter
- Age range
- Gender presentation
- Outfit
- Face description
- Body type
- Hair
- Key visual traits
- Role in story

### 8.7 Scene Review

User dapat melihat semua scene sebelum generate video.

User dapat mengedit:

- Narasi
- Prompt visual
- Durasi scene
- Camera direction
- Mood
- Style

### 8.8 Video Generation

Sistem mengirim prompt per scene ke AI video provider.

Output per scene:

- Video clip
- Thumbnail
- Generation status
- Provider metadata
- Error message jika gagal

### 8.9 Regenerate Scene

User dapat regenerate scene tertentu tanpa mengulang seluruh project.

Regenerate options:

- Same prompt
- Improve quality
- Change camera
- Change mood
- Change visual style
- Manual prompt edit

### 8.10 Voice-Over

Sistem membuat script voice-over berdasarkan narasi final.

MVP dapat memakai:

- Text-to-speech provider
- Pilihan voice gender/tone
- Speed control sederhana

### 8.11 Subtitle

Sistem membuat subtitle otomatis dari voice-over script.

Fitur MVP:

- Burn-in subtitle
- Bahasa Indonesia
- Simple subtitle style

### 8.12 Final Composer

Sistem menyatukan:

- Video clips
- Voice-over
- Background music
- Subtitle
- Basic transition

Output:

- MP4
- 720p atau 1080p untuk MVP
- Aspect ratio sesuai pilihan user

## 9. Role dan Permission MVP

### User

- Membuat project
- Mengedit input dan scene
- Generate video
- Export final video

### Admin

- Melihat semua project
- Mengelola user
- Mengelola provider API key
- Melihat usage dan error log

## 10. Status Project

- Draft
- Script Generated
- Storyboard Ready
- Generating
- Review
- Rendering Final
- Completed
- Failed

## 11. Requirements Fungsional

### FR-001 - Create Project

User dapat membuat project baru dengan nama, tujuan video, durasi, aspect ratio, dan style visual.

### FR-002 - Submit Story

User dapat memasukkan cerita teks minimal 50 karakter.

### FR-003 - Generate Script

Sistem dapat menghasilkan script video dari input cerita.

### FR-004 - Generate Scene Breakdown

Sistem dapat membagi script menjadi scene terstruktur.

### FR-005 - Edit Scene

User dapat mengedit data scene sebelum video digenerate.

### FR-006 - Generate Video Clip

Sistem dapat generate video clip berdasarkan prompt scene.

### FR-007 - Regenerate Scene

User dapat mengulang generate pada satu scene tertentu.

### FR-008 - Generate Voice-Over

Sistem dapat membuat voice-over dari script final.

### FR-009 - Compose Final Video

Sistem dapat menggabungkan semua scene menjadi satu video final.

### FR-010 - Export Video

User dapat mengunduh video final dalam format MP4.

## 12. Requirements Non-Fungsional

- Sistem harus menyimpan progress project agar user tidak kehilangan pekerjaan.
- Sistem harus menampilkan status generation secara jelas.
- Sistem harus menangani kegagalan provider AI tanpa menghapus progress user.
- Sistem harus menyimpan metadata prompt dan output untuk audit.
- Sistem harus membatasi durasi video MVP agar biaya tetap terkendali.
- Sistem harus memiliki queue untuk proses generate video.

## 13. Integrasi AI

### LLM

Digunakan untuk:

- Memahami cerita
- Membuat script
- Membuat scene breakdown
- Membuat prompt visual
- Membuat voice-over script

### Image/Video Generation Provider

Digunakan untuk:

- Membuat visual reference
- Membuat video clip per scene

Contoh provider yang dapat dievaluasi:

- Veo
- Kling
- Luma
- Runway
- Pika

### Text-to-Speech Provider

Digunakan untuk:

- Voice-over narasi

## 14. Data Model Awal

### Project

- id
- user_id
- title
- objective
- source_story
- target_audience
- duration
- aspect_ratio
- visual_style
- status
- created_at
- updated_at

### Script

- id
- project_id
- hook
- narration
- closing
- language
- version

### Scene

- id
- project_id
- scene_number
- narration
- visual_description
- character_description
- location
- camera_direction
- mood
- prompt
- duration
- status
- video_url
- thumbnail_url

### Character

- id
- project_id
- name
- description
- outfit
- visual_traits
- seed_reference_url

### Render

- id
- project_id
- output_url
- resolution
- aspect_ratio
- duration
- status
- created_at

## 15. Success Metrics

- User dapat membuat video draft pertama dalam kurang dari 30 menit untuk MVP.
- Minimal 70 persen project berhasil mencapai storyboard ready.
- Minimal 50 persen project berhasil mencapai final export.
- Rata-rata regenerate per scene tidak lebih dari 3 kali.
- Waktu final render di bawah 15 menit untuk video pendek.

## 16. Risiko Produk

- Kualitas output video provider tidak selalu stabil.
- Konsistensi wajah dan karakter sulit dijamin penuh.
- Biaya generation bisa tinggi jika tidak ada limit.
- User bisa memasukkan cerita terlalu abstrak atau terlalu panjang.
- Revisi visual bisa memakan waktu jika prompt tidak presisi.

## 17. Mitigasi Risiko

- Batasi durasi video MVP.
- Gunakan scene-based generation agar revisi modular.
- Tambahkan prompt template berdasarkan visual style.
- Simpan character profile untuk menjaga konsistensi.
- Tampilkan preview storyboard sebelum generate video.
- Tambahkan usage quota per user atau per project.

## 18. MVP Acceptance Criteria

MVP dianggap berhasil jika user dapat:

1. Membuat project baru.
2. Memasukkan cerita teks.
3. Mendapatkan script video otomatis.
4. Mendapatkan scene breakdown otomatis.
5. Mengedit scene.
6. Generate minimal satu video clip dari scene.
7. Regenerate scene tertentu.
8. Generate voice-over.
9. Menggabungkan scene menjadi video final.
10. Mengunduh file MP4.

## 19. Future Enhancements

- Upload deck atau PDF sebagai input.
- Brand kit dan style guide.
- AI avatar atau recurring character.
- Team collaboration.
- Template video campaign.
- Multi-language output.
- Auto social media cutdown.
- Advanced timeline editor.
- Analytics performa video.
- API untuk integrasi enterprise.

## 20. Open Questions

- Apakah platform ini untuk internal client saja atau akan menjadi SaaS publik?
- Apakah output utama adalah video pendek social media atau video corporate panjang?
- Apakah client membutuhkan approval workflow?
- Apakah perlu brand guideline per client?
- Apakah human editor tetap masuk dalam proses, atau client ingin self-service penuh?
- Provider AI video mana yang paling cocok dari sisi kualitas, harga, dan API availability?
- Apakah perlu pembayaran/token system sejak MVP?

