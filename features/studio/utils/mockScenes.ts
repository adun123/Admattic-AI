import type { SceneNodeData } from "../types";

export function createMockScenes(): SceneNodeData[] {
  const basePrompt =
    "video brand korporat sinematik, tokoh utama yang sama di setiap scene, pencahayaan realistis, gerakan kamera elegan, tone emosional hangat";

  return [
    {
      kind: "scene",
      sceneNumber: 1,
      title: "Awal Perjalanan",
      duration: 8,
      narration: "Kami memulai dari tim kecil dengan mimpi besar.",
      visualDescription: "Tokoh utama memulai perjalanan di ruang kerja sederhana bersama tim kecil.",
      cameraDirection: "Dolly-in perlahan, medium wide shot, cahaya pagi hangat.",
      mood: "Hangat, nostalgia",
      prompt: `${basePrompt}, tokoh utama yang sama memulai dari kantor kecil, cahaya pagi, ekspresi penuh harapan`,
      status: "prompt_ready"
    },
    {
      kind: "scene",
      sceneNumber: 2,
      title: "Ruang Kerja Pertama",
      duration: 9,
      narration: "Dari ruang kerja sederhana, kami belajar membangun kepercayaan.",
      visualDescription: "Tokoh utama yang sama bekerja hingga malam dengan laptop, catatan, dan papan campaign.",
      cameraDirection: "Gerakan handheld lembut, close-up detail kolaborasi.",
      mood: "Fokus, intim",
      prompt: `${basePrompt}, tokoh utama yang sama bekerja malam di ruang kreatif, laptop, sticky notes, kolaborasi tim`,
      status: "prompt_ready"
    },
    {
      kind: "scene",
      sceneNumber: 3,
      title: "Kolaborasi Client",
      duration: 10,
      narration: "Kami tumbuh bersama client melalui ide, diskusi, dan kolaborasi.",
      visualDescription: "Tokoh utama yang sama mempresentasikan ide campaign di ruang meeting modern.",
      cameraDirection: "Side tracking shot, framing presentasi yang percaya diri.",
      mood: "Profesional, optimistis",
      prompt: `${basePrompt}, tokoh utama yang sama presentasi ke client, ruang meeting modern, kerja tim percaya diri`,
      status: "prompt_ready"
    },
    {
      kind: "scene",
      sceneNumber: 4,
      title: "Tantangan dan Tumbuh",
      duration: 10,
      narration: "Setiap tantangan mengajarkan kami untuk menjadi lebih kuat.",
      visualDescription: "Montage cepat tokoh utama yang sama melewati revisi, brainstorm, dan momen produksi malam.",
      cameraDirection: "Dynamic cuts, push-in shots, motion blur halus.",
      mood: "Tangguh, energik",
      prompt: `${basePrompt}, montage cepat revisi agency, papan brainstorm, tokoh utama yang sama tetap tangguh`,
      status: "prompt_ready"
    },
    {
      kind: "scene",
      sceneNumber: 5,
      title: "Perayaan Anniversary",
      duration: 11,
      narration: "Hari ini, kami merayakan perjalanan dan orang-orang di baliknya.",
      visualDescription: "Tokoh utama yang sama merayakan pencapaian bersama tim dengan confetti lembut dan signage anniversary.",
      cameraDirection: "Wide reveal shot, gerakan crane sinematik perlahan.",
      mood: "Meriah, menyentuh",
      prompt: `${basePrompt}, perayaan anniversary agency, tokoh utama yang sama bersama tim tersenyum, confetti elegan, lighting premium`,
      status: "prompt_ready"
    },
    {
      kind: "scene",
      sceneNumber: 6,
      title: "Masa Depan Agency",
      duration: 12,
      narration: "Kami menatap masa depan dengan semangat baru untuk menciptakan dampak lebih besar.",
      visualDescription: "Tokoh utama yang sama berdiri bersama tim menghadap skyline kota dan papan campaign masa depan.",
      cameraDirection: "Slow pull-back ending, komposisi skyline sinematik.",
      mood: "Visioner, inspiratif",
      prompt: `${basePrompt}, tokoh utama yang sama menghadap skyline kota cerah, visi masa depan, ending premium inspiratif`,
      status: "prompt_ready"
    }
  ];
}

