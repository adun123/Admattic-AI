# POC Build Spec - AI Video Canvas Workspace

## 1. Purpose

Dokumen ini mengunci scope teknis POC untuk AI Video Storytelling System.

Tujuan POC adalah membuat demo internal yang menunjukkan workflow:

```text
Story input -> AI scene breakdown -> canvas nodes -> prompt editing -> video output node -> simple timeline
```

POC ini belum perlu menjadi sistem produksi penuh. Fokus utama adalah membuktikan experience canvas workspace dan alur kerja AI-assisted video production.

## 2. POC Version Plan

### POC v0.1 - Canvas Prototype

Fokus:

- UI canvas workspace
- Story input node
- Generate scene nodes dengan mock data
- Drag and move nodes
- Select node and edit details
- Simple timeline

Belum ada API AI asli.

### POC v0.2 - AI Script and Scene Generation

Fokus:

- Integrasi LLM untuk generate script dan scene breakdown
- Story input asli diproses menjadi 5-6 scene
- Scene nodes dibuat otomatis dari response AI
- Prompt per scene bisa diedit

### POC v0.3 - Video Output Demo

Fokus:

- Integrasi video provider atau mock video provider
- Generate 1-2 video output node
- Approve output
- Masukkan approved scene ke timeline
- Optional rough export MP4

## 3. Recommended Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- React Flow

### Backend

- Next.js API Routes untuk POC

### Database

Untuk POC awal:

- Local JSON/mock state atau SQLite

Untuk POC yang lebih dekat MVP:

- Supabase PostgreSQL

### Storage

Untuk POC awal:

- Local/public folder atau mock video URL

Untuk POC lebih serius:

- Supabase Storage

### AI APIs

- OpenAI API untuk script, storyboard, scene breakdown, prompt generation
- Luma/Runway/OpenAI video generation untuk video clip jika akses tersedia
- ElevenLabs/OpenAI TTS optional untuk voice-over

## 4. Main Screens

### 4.1 Project Dashboard

Purpose:

- Menampilkan daftar project video.
- Membuat project baru.

Minimal components:

- Header: AI Video Studio
- Button: New Project
- Project cards/table
- Project status
- Last updated

POC status:

- Optional untuk v0.1
- Bisa langsung masuk ke workspace jika ingin cepat demo

### 4.2 Canvas Workspace

Purpose:

- Area utama untuk membangun video dari cerita menjadi scene dan output.

Layout:

```text
Top Bar
Project Name | Save | Preview | Export

Left Sidebar
Project Settings
Tone
Style
Duration
Aspect Ratio
Reference Upload

Center
React Flow Canvas
Story Node -> Scene Nodes -> Output Nodes

Right Sidebar
Selected Node Detail
Edit text/prompt/duration/camera/mood

Bottom Bar
Simple Timeline
```

## 5. Canvas Node Types

### 5.1 Story Input Node

Purpose:

- Tempat user memasukkan cerita utama.

Fields:

- story_text
- tone
- visual_style
- duration_target
- aspect_ratio
- language
- reference_images

Actions:

- Generate Structure
- Clear
- Add Reference

UI example:

```text
[ Story Input ]
Paste story here...

Tone: Emotional
Style: Cinematic Corporate
Duration: 60s
Aspect Ratio: 9:16

[Generate Structure]
```

### 5.2 Scene Prompt Node

Purpose:

- Merepresentasikan satu scene dari video.

Fields:

- scene_number
- title
- duration
- narration
- visual_description
- camera_direction
- mood
- prompt
- status

Actions:

- Edit
- Generate Video
- Duplicate
- Delete

Status:

- Prompt Ready
- Generating
- Generated
- Approved
- Failed

### 5.3 Video Output Node

Purpose:

- Menampilkan hasil video dari satu scene.

Fields:

- scene_id
- video_url
- thumbnail_url
- provider
- prompt_version
- status

Actions:

- Play
- Regenerate
- Approve
- Download Clip

### 5.4 Timeline Node or Bottom Timeline

Purpose:

- Menampilkan scene yang sudah approved untuk final video.

Fields:

- ordered_scene_ids
- total_duration
- aspect_ratio
- render_status

Actions:

- Reorder scene
- Remove scene
- Preview
- Render Final

## 6. Minimal Data Model

### Project

```ts
type Project = {
  id: string;
  title: string;
  videoType: "anniversary" | "founder_story" | "campaign" | "reels";
  durationTarget: 30 | 60 | 90;
  aspectRatio: "9:16" | "16:9" | "1:1";
  visualStyle: string;
  tone: string;
  language: "id" | "en";
  status: "draft" | "storyboard_ready" | "generating" | "review" | "completed";
  createdAt: string;
  updatedAt: string;
};
```

### StoryInput

```ts
type StoryInput = {
  id: string;
  projectId: string;
  text: string;
  referenceImages: string[];
};
```

### Scene

```ts
type Scene = {
  id: string;
  projectId: string;
  sceneNumber: number;
  title: string;
  duration: number;
  narration: string;
  visualDescription: string;
  cameraDirection: string;
  mood: string;
  prompt: string;
  status: "prompt_ready" | "generating" | "generated" | "approved" | "failed";
};
```

### VideoOutput

```ts
type VideoOutput = {
  id: string;
  projectId: string;
  sceneId: string;
  videoUrl: string;
  thumbnailUrl?: string;
  provider: "mock" | "luma" | "runway" | "openai";
  promptVersion: number;
  status: "generating" | "ready" | "approved" | "failed";
  createdAt: string;
};
```

### CanvasNode

```ts
type CanvasNode = {
  id: string;
  type: "storyInput" | "scenePrompt" | "videoOutput";
  position: {
    x: number;
    y: number;
  };
  data: unknown;
};
```

## 7. API Endpoints

### POST /api/projects

Create new project.

Request:

```json
{
  "title": "Agency Anniversary 2026",
  "videoType": "anniversary",
  "durationTarget": 60,
  "aspectRatio": "9:16",
  "visualStyle": "cinematic_corporate",
  "tone": "emotional"
}
```

### POST /api/generate-structure

Generate script and scene breakdown from story.

Request:

```json
{
  "projectId": "project_123",
  "story": "Kami memulai sebagai tim kecil...",
  "durationTarget": 60,
  "sceneCount": 6,
  "tone": "emotional",
  "visualStyle": "cinematic_corporate",
  "aspectRatio": "9:16",
  "language": "id"
}
```

Response:

```json
{
  "script": {
    "title": "Perjalanan yang Tumbuh Bersama",
    "narration": "..."
  },
  "scenes": [
    {
      "sceneNumber": 1,
      "title": "Awal Perjalanan",
      "duration": 8,
      "narration": "Kami memulai dari tim kecil dengan mimpi besar.",
      "visualDescription": "Small creative team working in a modest office.",
      "cameraDirection": "Slow dolly-in, warm cinematic lighting.",
      "mood": "Warm, nostalgic",
      "prompt": "Cinematic corporate video..."
    }
  ]
}
```

### POST /api/generate-video

Generate video output from selected scene.

Request:

```json
{
  "projectId": "project_123",
  "sceneId": "scene_001",
  "prompt": "Cinematic corporate video...",
  "duration": 8,
  "aspectRatio": "9:16",
  "provider": "mock"
}
```

Response:

```json
{
  "outputId": "output_001",
  "status": "ready",
  "videoUrl": "/sample-videos/scene-001.mp4",
  "provider": "mock"
}
```

### POST /api/approve-output

Approve selected video output.

Request:

```json
{
  "projectId": "project_123",
  "sceneId": "scene_001",
  "outputId": "output_001"
}
```

### POST /api/render-final

Render final video from approved outputs.

POC status:

- Optional
- Can return mock final video URL

## 8. AI Prompt Requirements

The LLM should return structured JSON only.

Required output:

- script title
- full narration
- scenes array
- each scene has narration, visual description, camera direction, mood, prompt, and duration

Prompt must instruct AI to:

- Use Bahasa Indonesia narration.
- Keep tone emotional, inspiring, and premium.
- Produce 6 scenes.
- Total duration must be close to 60 seconds.
- Avoid overly abstract visuals.
- Make each scene suitable for AI video generation.

## 9. Mock Data for v0.1

Use this story:

```text
Kami memulai perjalanan sebagai tim kecil dengan mimpi besar. Dari ruang kerja sederhana, kami belajar membangun kepercayaan, bekerja bersama client, dan menghadapi berbagai tantangan. Tahun demi tahun, kami tumbuh bukan hanya sebagai agency, tetapi sebagai keluarga kreatif yang percaya bahwa kolaborasi dapat menciptakan dampak besar. Hari ini, kami merayakan perjalanan itu dan menatap masa depan dengan semangat baru.
```

Expected scenes:

1. Awal Perjalanan
2. Ruang Kerja Pertama
3. Kolaborasi dengan Client
4. Tantangan dan Pertumbuhan
5. Perayaan Anniversary
6. Masa Depan Agency

## 10. UI Behavior Acceptance Criteria

POC v0.1 is successful if:

- User can see canvas workspace.
- User can edit story input.
- User can click Generate Structure.
- Scene nodes appear automatically.
- Scene nodes can be dragged.
- User can click scene node and edit details in right panel.
- User can click Generate Video on a scene.
- Output video node appears next to selected scene.
- User can approve output.
- Approved scene appears in timeline.

## 11. AI Behavior Acceptance Criteria

POC v0.2 is successful if:

- AI returns valid JSON.
- AI generates 5-6 usable scenes.
- Each scene has narration, visual description, camera direction, mood, prompt, and duration.
- Total duration is close to selected target.
- Scene prompt is specific enough for video generation.

## 12. Video Behavior Acceptance Criteria

POC v0.3 is successful if:

- System can generate or mock 1-2 video output nodes.
- Output node includes playable video preview.
- User can approve one output per scene.
- Approved outputs can be shown in timeline.

## 13. Development Order

Recommended order:

1. Setup Next.js, Tailwind, TypeScript.
2. Install and configure React Flow.
3. Build canvas layout with top bar, sidebars, and bottom timeline.
4. Build Story Input Node.
5. Build mock Generate Structure action.
6. Render Scene Prompt Nodes.
7. Build right panel node editor.
8. Build mock Generate Video action.
9. Render Video Output Node.
10. Add approve-to-timeline behavior.
11. Add real LLM API integration.
12. Add real or semi-real video provider integration.

## 14. Development Time Estimate

### Fast Prototype

Estimated: 3-5 days

Includes:

- Canvas UI
- Mock scene generation
- Mock video output
- Timeline behavior

### AI-Connected POC

Estimated: 5-8 days

Includes:

- Real LLM scene generation
- Better prompt handling
- API endpoint integration

### Video-Connected POC

Estimated: 7-12 days

Includes:

- Real video provider test
- Output storage
- Basic render/export behavior

## 15. Current Locked Recommendation

Build first:

- Next.js + React Flow canvas
- One workspace screen
- Mock AI data first
- Then connect LLM
- Then connect video provider

This keeps the demo moving quickly while reducing risk from unstable video generation API.

