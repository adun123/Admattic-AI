# POC UI Concept - Canvas Workspace AI Video

## 1. Core UI Idea

Konsep UI yang diusulkan adalah workspace berbasis canvas seperti Figma atau Miro, bukan form linear biasa.

User bekerja di satu area besar yang berisi node/container. Setiap container merepresentasikan bagian dari proses produksi video:

- Input cerita
- Pengaturan style
- Referensi gambar
- Prompt per paragraf
- Scene per durasi
- Output video per scene
- Final timeline

Dengan model ini, user dapat melihat hubungan antara cerita, prompt, scene, dan hasil video secara visual.

## 2. Main Workspace Layout

### Area Utama

Canvas besar yang bisa:

- Pan
- Zoom
- Drag container
- Reorder scene
- Connect antar container
- Duplicate scene
- Delete scene
- Group scene

### Sidebar Kiri

Berisi project-level controls:

- Project name
- Video type
- Duration target
- Aspect ratio
- Visual style
- Tone
- Language
- Generate button

### Sidebar Kanan

Berisi detail dari container yang sedang dipilih:

- Edit text
- Edit prompt
- Edit camera direction
- Edit mood
- Upload reference image
- Regenerate selected scene
- Approve output

## 3. Initial Canvas State

Saat user membuat project baru, canvas menampilkan container utama:

```text
[ Story Input Container ]
| Paste your story here |
| Tone: Emotional       |
| Style: Cinematic      |
| Duration: 60s         |
| Reference Images      |
| [Generate Structure]  |
```

Di dalam container ini user bisa:

- Menulis cerita panjang
- Memilih tone
- Memilih visual style
- Menentukan durasi
- Menambahkan gambar wajah/founder
- Menambahkan logo
- Menambahkan referensi visual

## 4. Story Input Options

Opsi yang tersedia di prompt area:

- Tone: emotional, inspiring, premium, energetic, documentary
- Visual style: cinematic corporate, documentary, futuristic, realistic, social media dynamic
- Duration: 30s, 60s, 90s
- Aspect ratio: 9:16, 16:9, 1:1
- Language: Bahasa Indonesia, English
- Voice-over tone: warm, confident, cinematic, youthful
- Target audience: internal team, client, public audience
- Reference image upload: face, company logo, office, product, event photos

## 5. Auto Breakdown Behavior

Setelah user memasukkan cerita dan klik generate, sistem otomatis:

1. Membaca cerita.
2. Memecah cerita per paragraf atau per beat narasi.
3. Mengubah setiap bagian menjadi scene.
4. Menentukan durasi per scene.
5. Membuat prompt visual per scene.
6. Membuat voice-over line per scene.
7. Membuat node/container scene di canvas.

Contoh:

Cerita panjang 3 paragraf dapat dipecah menjadi 6 scene:

- Scene 01: Opening memory - 7 detik
- Scene 02: Small team beginning - 8 detik
- Scene 03: Collaboration journey - 10 detik
- Scene 04: Challenge and growth - 10 detik
- Scene 05: Milestone celebration - 12 detik
- Scene 06: Future vision - 13 detik

## 6. Generated Scene Containers

Setelah breakdown, sistem membuat container ke samping dari Story Input Container.

```text
[ Story Input ]
      |
      +--> [ Scene 01 Prompt ]
      +--> [ Scene 02 Prompt ]
      +--> [ Scene 03 Prompt ]
      +--> [ Scene 04 Prompt ]
      +--> [ Scene 05 Prompt ]
      +--> [ Scene 06 Prompt ]
```

Setiap scene container berisi:

- Scene number
- Scene title
- Duration
- Narration
- Visual description
- Camera direction
- Mood
- Prompt
- Reference image
- Status
- Generate button

## 7. Scene Container Example

```text
[ Scene 02 - Small Team Beginning ]

Duration: 8s
Tone: Warm, nostalgic

Narration:
"Kami memulai dari tim kecil dengan mimpi besar."

Visual:
Small creative team working late in a modest office, warm cinematic lighting.

Camera:
Slow dolly-in, medium wide shot.

Status: Prompt Ready

[Edit Prompt] [Generate Video]
```

## 8. Output Video Containers

Ketika sebuah scene digenerate, sistem membuat output container di sebelah kanan scene prompt.

```text
[ Scene 02 Prompt ] ---> [ Scene 02 Video Output ]
```

Output container berisi:

- Video preview
- Thumbnail
- Generation status
- Provider used
- Prompt version
- Regenerate button
- Approve button
- Download clip

Jika user regenerate, bisa muncul beberapa output alternatif:

```text
[ Scene 02 Prompt ] ---> [ Output A ]
                    ---> [ Output B ]
                    ---> [ Output C ]
```

User dapat memilih output terbaik sebagai approved version.

## 9. Timeline Container

Di bagian bawah canvas atau sisi kanan, sistem membuat timeline container.

```text
[ Final Timeline ]
Scene 01 | Scene 02 | Scene 03 | Scene 04 | Scene 05 | Scene 06

[Generate Voice Over]
[Add Subtitle]
[Render Final Video]
```

Scene yang sudah approved otomatis masuk ke timeline.

User bisa:

- Drag scene untuk ubah urutan
- Remove scene
- Duplicate scene
- Adjust duration
- Preview rough cut
- Render final video

## 10. Interaction Model

Interaksi utama:

- Drag container untuk mengatur layout
- Drag scene ke timeline
- Click container untuk edit detail
- Connect container untuk menunjukkan alur
- Generate per scene
- Regenerate per output
- Approve output
- Lock approved scene
- Render final video

## 11. Why Canvas Workspace Works

Canvas workspace cocok untuk creative agency karena:

- Lebih visual daripada form linear
- Mirip cara kerja creative mapping
- Mudah melihat hubungan antara story, scene, prompt, dan output
- Mudah revisi scene tertentu
- Cocok untuk proses human-in-the-loop
- Terasa seperti production board, bukan chatbot

## 12. POC UI Scope

Untuk POC, tidak perlu semua fitur Figma lengkap.

Minimum canvas behavior:

- Story input node
- Auto generate scene nodes
- Scene nodes bisa digeser
- Scene detail bisa diedit
- Generate button per scene
- Output video node muncul setelah generate
- Timeline sederhana

Fitur advanced seperti multiplayer, comment, version history, dan complex grouping bisa ditunda.

## 13. Recommended POC Screen

POC cukup satu layar utama:

```text
Top Bar:
Project name | Save | Preview | Export

Left Panel:
Project settings, visual style, tone, duration, upload references

Canvas:
Story input node -> scene prompt nodes -> video output nodes

Right Panel:
Selected node details

Bottom:
Final timeline
```

## 14. Key Product Differentiator

Pembeda utama produk ini:

User tidak hanya memasukkan prompt lalu menunggu video.

User membangun video melalui visual canvas:

- Cerita menjadi paragraf
- Paragraf menjadi scene
- Scene menjadi prompt
- Prompt menjadi output video
- Output video masuk ke timeline

Ini membuat proses AI video lebih transparan, modular, dan mudah direvisi.

