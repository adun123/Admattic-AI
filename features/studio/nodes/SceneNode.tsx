import { useEffect, useState } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Check, Clapperboard, Edit3, Film, Loader2, X } from "lucide-react";
import type { SceneNodeData, StudioNode } from "../types";
import { InfoPill, NodeActionButton, NodeInput, NodeTextArea, StatusBadge } from "./NodeControls";
import { NodeShell } from "./NodeShell";

export function SceneNode({ data, selected }: NodeProps<StudioNode>) {
  const scene = data as SceneNodeData;
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState({
    title: scene.title,
    duration: String(scene.duration),
    narration: scene.narration,
    visualDescription: scene.visualDescription,
    cameraDirection: scene.cameraDirection,
    mood: scene.mood,
    prompt: scene.prompt
  });

  useEffect(() => {
    if (isEditing) return;
    setDraft({
      title: scene.title,
      duration: String(scene.duration),
      narration: scene.narration,
      visualDescription: scene.visualDescription,
      cameraDirection: scene.cameraDirection,
      mood: scene.mood,
      prompt: scene.prompt
    });
  }, [
    isEditing,
    scene.cameraDirection,
    scene.duration,
    scene.mood,
    scene.narration,
    scene.prompt,
    scene.title,
    scene.visualDescription
  ]);

  const saveDraft = () => {
    scene.onUpdate?.({
      title: draft.title,
      duration: Number.parseInt(draft.duration, 10) || scene.duration,
      narration: draft.narration,
      visualDescription: draft.visualDescription,
      cameraDirection: draft.cameraDirection,
      mood: draft.mood,
      prompt: draft.prompt
    });
    setIsEditing(false);
  };

  return (
    <NodeShell selected={selected} accent="violet">
      <Handle type="target" position={Position.Left} />
      <div className="border-b border-studio-line p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Clapperboard size={16} className="text-studio-violet" />
              Scene {scene.sceneNumber.toString().padStart(2, "0")}
            </div>
            <h3 className="mt-2 text-lg font-semibold leading-6">{scene.title}</h3>
          </div>
          <StatusBadge status={scene.status} />
        </div>
      </div>
      <div className="space-y-3 p-4 text-xs">
        {isEditing ? (
          <div className="nodrag space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <NodeInput
                label="Judul"
                value={draft.title}
                onChange={(title) => setDraft((current) => ({ ...current, title }))}
              />
              <NodeInput
                label="Durasi"
                value={draft.duration}
                onChange={(duration) => setDraft((current) => ({ ...current, duration }))}
              />
            </div>
            <NodeTextArea
              label="Narasi"
              value={draft.narration}
              onChange={(narration) => setDraft((current) => ({ ...current, narration }))}
            />
            <NodeTextArea
              label="Visual"
              value={draft.visualDescription}
              onChange={(visualDescription) =>
                setDraft((current) => ({ ...current, visualDescription }))
              }
            />
            <NodeTextArea
              label="Kamera"
              value={draft.cameraDirection}
              onChange={(cameraDirection) =>
                setDraft((current) => ({ ...current, cameraDirection }))
              }
            />
            <NodeInput
              label="Mood"
              value={draft.mood}
              onChange={(mood) => setDraft((current) => ({ ...current, mood }))}
            />
            <NodeTextArea
              label="Prompt"
              value={draft.prompt}
              rows={6}
              onChange={(prompt) => setDraft((current) => ({ ...current, prompt }))}
            />
            <div className="grid grid-cols-2 gap-2">
              <NodeActionButton icon={<X size={14} />} label="Cancel" onClick={() => setIsEditing(false)} />
              <NodeActionButton icon={<Check size={14} />} label="Apply" onClick={saveDraft} primary />
            </div>
          </div>
        ) : (
          <>
            <InfoPill label="Duration" value={`${scene.duration}s`} />
            <p className="leading-5 text-slate-300">{scene.narration}</p>
            <button
              className="nodrag block w-full rounded-md border border-studio-line bg-slate-950/30 p-3 text-left text-slate-400 transition hover:border-studio-violet/70"
              onClick={() => setIsEditing(true)}
              type="button"
            >
              <p className="font-medium text-slate-200">Prompt</p>
              <p className="mt-1 line-clamp-4 leading-5">{scene.prompt}</p>
            </button>
          </>
        )}
        <div className="nodrag grid grid-cols-2 gap-2">
          <NodeActionButton
            icon={<Edit3 size={14} />}
            label={isEditing ? "Close" : "Edit"}
            onClick={() => setIsEditing((current) => !current)}
          />
          <NodeActionButton
            icon={
              scene.isGeneratingVideo ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Film size={14} />
              )
            }
            label={scene.isGeneratingVideo ? "Generating" : "Generate Video"}
            onClick={scene.onGenerateVideo}
            disabled={scene.isGeneratingVideo}
            primary
          />
        </div>
      </div>
      <Handle type="source" position={Position.Right} />
    </NodeShell>
  );
}

