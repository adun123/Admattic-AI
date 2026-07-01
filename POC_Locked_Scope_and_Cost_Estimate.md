# POC Locked Scope & Cost Estimate

## 1. POC Objective

POC bertujuan membuktikan bahwa sistem dapat mengubah cerita teks menjadi struktur video yang bisa dipakai creative team:

- Story input
- Script video
- Storyboard scene
- Prompt per scene
- Canvas node workspace
- Generate sample video scene
- Output node
- Timeline sederhana

POC tidak perlu membuktikan full production automation. POC cukup membuktikan workflow dan kualitas dasar.

## 2. Locked POC Scope

### POC Scenario

Use case:

- Video anniversary agency
- Durasi target: 60 detik
- Format: 9:16 Reels
- Bahasa: Indonesia
- Style: cinematic corporate
- Tone: emotional, inspiring, premium

### POC Output

POC akan menghasilkan:

- 1 story input node
- 1 generated script
- 6 generated scene nodes
- 6 prompt scene
- 2 generated video output nodes
- 1 simple timeline
- 1 rough preview atau mock final composition

### POC yang Belum Masuk

- Full 60 detik generated video dari semua scene
- Multi-user collaboration
- Approval workflow
- Complex editor
- Payment system
- Full brand kit
- Perfect face consistency

## 3. Locked POC User Flow

1. User masuk ke workspace.
2. User mengisi story input.
3. User memilih tone, style, duration, dan aspect ratio.
4. User upload optional reference image.
5. User klik Generate Structure.
6. Sistem membuat script dan scene breakdown.
7. Canvas menampilkan 6 scene nodes.
8. User klik salah satu scene.
9. User melihat dan mengedit prompt scene.
10. User generate 1-2 scene video.
11. Output video muncul sebagai node di kanan scene.
12. User approve output.
13. Approved output masuk timeline.

## 4. Locked POC Technical Flow

```text
Story Input
   -> LLM script generation
   -> LLM scene breakdown
   -> Canvas scene nodes
   -> User edit selected scene
   -> Video generation API
   -> Output video node
   -> Timeline preview
```

## 5. Recommended APIs for POC

### LLM

Recommended:

- OpenAI GPT-5.4 mini for cost-efficient script, storyboard, and prompt generation.

Alternative:

- GPT-5.4 for better writing quality.
- GPT-5.5 only if the prompt/story quality needs stronger reasoning.

### Video Generation

Recommended to test:

- Luma Dream Machine API
- Runway API

Optional:

- OpenAI video generation API if account access and pricing are suitable.

### Voice-over

Recommended:

- ElevenLabs for more natural voice-over.

Alternative:

- OpenAI speech/audio if we want fewer vendors.

## 6. Cost Assumptions

Estimates below are planning numbers for POC, not final vendor quotations.

Important:

- LLM cost is token-based.
- Video generation is usually credit/job/duration-based, not token-based.
- TTS is usually character/minute/credit-based, not token-based.
- Final video rendering with FFmpeg has no API cost if run on our own server, but has server compute cost.

## 7. Token & Cost Table - LLM

Pricing reference used:

- GPT-5.4 mini: input $0.75 / 1M tokens, output $4.50 / 1M tokens.
- GPT-5.4: input $2.50 / 1M tokens, output $15.00 / 1M tokens.
- GPT-5.5: input $5.00 / 1M tokens, output $30.00 / 1M tokens.

### Per Action Estimate

| Action | Estimated Input Tokens | Estimated Output Tokens | GPT-5.4 Mini Cost | GPT-5.4 Cost | GPT-5.5 Cost |
|---|---:|---:|---:|---:|---:|
| Generate script from story | 2,000 | 1,500 | $0.0083 | $0.0275 | $0.0550 |
| Generate 6 scene breakdown | 2,500 | 3,000 | $0.0154 | $0.0513 | $0.1025 |
| Generate/refine prompt for 1 scene | 800 | 800 | $0.0042 | $0.0140 | $0.0280 |
| Generate prompts for 6 scenes | 4,800 | 4,800 | $0.0252 | $0.0840 | $0.1680 |
| Regenerate 1 scene prompt | 1,000 | 1,000 | $0.0053 | $0.0175 | $0.0350 |

### LLM Total for POC

Assumption:

- 1 script generation
- 1 scene breakdown
- 6 scene prompt generations
- 2 prompt regenerations

| POC LLM Usage | Input Tokens | Output Tokens | GPT-5.4 Mini Cost | GPT-5.4 Cost | GPT-5.5 Cost |
|---|---:|---:|---:|---:|---:|
| Estimated POC total | 11,300 | 11,300 | $0.0593 | $0.1978 | $0.3955 |

Recommendation:

- Use GPT-5.4 mini for POC by default.
- Upgrade only selected script-writing calls to GPT-5.4 if quality feels weak.

## 8. Cost Table - Video Generation

Video generation usually does not use token pricing. It is typically priced by:

- Credits
- Duration
- Resolution
- Model
- Number of generations
- Number of regenerations

For POC planning, use a budget allocation instead of exact token math until provider account pricing is confirmed.

### POC Video Estimate

| Item | Quantity | Token Count | Cost Model | Planning Cost |
|---|---:|---:|---|---:|
| Generate sample clip, 5-10s | 1 | N/A | Provider credits/job | $1-$5 |
| Generate 2 sample clips | 2 | N/A | Provider credits/job | $2-$10 |
| Regenerate 2 clips once | 2 | N/A | Provider credits/job | $2-$10 |
| POC video generation buffer | - | N/A | Safety buffer | $10-$30 |

Recommended POC allocation:

- Minimum: $10 video generation budget
- Safer: $30-$50 video generation budget

## 9. Cost Table - Voice-over

For POC, voice-over is optional but useful for demo.

### ElevenLabs Estimate

ElevenLabs pricing is credit/minute based depending on plan. Public pricing shows included monthly credits and estimated per-minute rates by plan.

| Item | Quantity | Token Count | Cost Model | Planning Cost |
|---|---:|---:|---|---:|
| 60s Indonesian voice-over | 1 minute | N/A | Credits/minute | ~$0.17-$0.36 |
| 3 voice-over attempts | 3 minutes | N/A | Credits/minute | ~$0.51-$1.08 |

Recommendation:

- Allocate $1-$3 for voice-over testing in POC.

## 10. Cost Table - Storage & Rendering

| Item | Quantity | Token Count | Cost Model | Planning Cost |
|---|---:|---:|---|---:|
| Upload reference images | 1-5 files | N/A | Storage | Very low |
| Store 2-6 generated clips | 2-6 files | N/A | Storage | Very low |
| FFmpeg local render | 1 rough preview | N/A | Server compute | $0 if local |
| Cloud render buffer | Optional | N/A | Server compute | $1-$5 |

For POC, storage and rendering cost is negligible compared to video generation.

## 11. Total POC Cost Estimate

### Minimal POC

Assumption:

- GPT-5.4 mini
- 2 video generations
- No heavy regenerate
- 1 voice-over

| Cost Component | Estimated Cost |
|---|---:|
| LLM script/storyboard/prompt | ~$0.06 |
| Video generation | $2-$10 |
| Voice-over | ~$0.17-$0.36 |
| Storage/rendering | ~$0-$1 |
| Total | ~$3-$12 |

### Safer POC Budget

Assumption:

- Some regenerate
- Multiple video attempts
- Voice-over retries
- Provider cost variation

| Cost Component | Estimated Cost |
|---|---:|
| LLM script/storyboard/prompt | $0.06-$0.40 |
| Video generation | $10-$50 |
| Voice-over | $1-$3 |
| Storage/rendering | $0-$5 |
| Total | ~$15-$60 |

Recommended allocation:

- Put aside $50-$100 for POC AI usage so the demo is not blocked by regenerate attempts.

## 12. Estimated Cost for One Full 60s Video

Assumption:

- 6 scenes
- Each scene 5-10 seconds
- 1 regenerate average per scene
- 1 voice-over
- LLM generation and prompt refinements

| Component | Estimated Usage | Estimated Cost |
|---|---:|---:|
| LLM | 15k-30k total tokens | ~$0.08-$0.60 |
| Video generation | 6 clips + 6 regenerates | ~$12-$60 |
| Voice-over | 1-3 minutes | ~$0.17-$1.08 |
| Storage/rendering | 1 final MP4 | ~$0-$5 |
| Estimated total per full video | - | ~$15-$70 |

Planning recommendation:

- For production budgeting, assume $25-$100 AI usage per finished 60s video until real provider pricing is confirmed.

## 13. Cost Controls for MVP

To keep cost predictable:

- Limit each project to 6 scenes in MVP.
- Limit each scene to 1-2 regenerations.
- Show estimated cost before generate.
- Track cost per project.
- Require user confirmation before video generation.
- Use cheap LLM model for structure, stronger model only for final script polish.
- Cache generated script and prompt results.
- Do not auto-generate all scenes without review.

## 14. Locked Recommendation

For POC, use this scope:

- 6 scene nodes
- Generate only 2 real video clips
- Allow 1 regenerate per generated clip
- Use GPT-5.4 mini for LLM
- Use ElevenLabs or OpenAI audio for voice-over
- Use Luma or Runway for video generation test
- Allocate $50-$100 AI usage budget

This keeps POC realistic, demoable, and financially controlled.

