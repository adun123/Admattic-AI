import type { FinalAssemblyNodeData, OutputNodeData, StudioNode } from "../types";

export function buildFinalAssemblyData(
  timeline: OutputNodeData[],
  nodes: StudioNode[],
  existing?: FinalAssemblyNodeData
): FinalAssemblyNodeData {
  const clips = timeline.map((item) => {
    const sceneNode = nodes.find(
      (node) => node.id === item.sceneId && node.data.kind === "scene"
    );

    return {
      sceneId: item.sceneId,
      sceneTitle: item.sceneTitle,
      duration: sceneNode?.data.kind === "scene" ? sceneNode.data.duration : 0
    };
  });

  const voiceOverScript = timeline
    .map((item, index) => {
      const sceneNode = nodes.find(
        (node) => node.id === item.sceneId && node.data.kind === "scene"
      );
      if (!sceneNode || sceneNode.data.kind !== "scene") return "";
      return `${index + 1}. ${sceneNode.data.narration}`;
    })
    .filter(Boolean)
    .join("\n");

  return {
    kind: "final",
    clips,
    transitionStyle: existing?.transitionStyle || "Cinematic dissolve",
    musicDirection:
      existing?.musicDirection ||
      "Musik instrumental sinematik yang konsisten dari awal sampai akhir, mulai lembut, naik emosional di tengah, lalu berakhir inspiratif.",
    voiceOverScript: existing?.voiceOverScript || voiceOverScript,
    soundNotes:
      existing?.soundNotes ||
      "Abaikan audio bawaan tiap clip saat final render. Gunakan satu voice over global, satu music bed global, ambience halus, dan loudness yang rata."
  };
}

