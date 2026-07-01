import { useEffect, useState } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Check, Download, Edit3, Mic2, Music2, Sparkles, X } from "lucide-react";
import type { FinalAssemblyNodeData, StudioNode } from "../types";
import { InfoPill, NodeActionButton, NodeSelect, NodeTextArea } from "./NodeControls";
import { NodeShell } from "./NodeShell";

export function FinalAssemblyNode({ data, selected }: NodeProps<StudioNode>) {
  const final = data as FinalAssemblyNodeData;
  const [isEditing, setIsEditing] = useState(false);
  const totalDuration = final.clips.reduce((sum, clip) => sum + clip.duration, 0);
  const [draft, setDraft] = useState({
    transitionStyle: final.transitionStyle,
    musicDirection: final.musicDirection,
    voiceOverScript: final.voiceOverScript,
    soundNotes: final.soundNotes
  });

  useEffect(() => {
    if (isEditing) return;
    setDraft({
      transitionStyle: final.transitionStyle,
      musicDirection: final.musicDirection,
      voiceOverScript: final.voiceOverScript,
      soundNotes: final.soundNotes
    });
  }, [
    final.musicDirection,
    final.soundNotes,
    final.transitionStyle,
    final.voiceOverScript,
    isEditing
  ]);

  const saveDraft = () => {
    final.onUpdate?.(draft);
    setIsEditing(false);
  };

  return (
    <NodeShell selected={selected} accent="blue">
      <Handle type="target" position={Position.Left} />
      <div className="border-b border-studio-line p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Sparkles size={16} className="text-studio-blue" />
              Final Assembly
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-400">
              {final.clips.length} clip approved / {totalDuration}s timeline
            </p>
          </div>
          <button
            className="nodrag grid h-8 w-8 shrink-0 place-items-center rounded-md border border-studio-line bg-studio-panelSoft text-slate-200 transition hover:border-studio-blue/70"
            onClick={() => setIsEditing((current) => !current)}
            title={isEditing ? "Close editor" : "Edit final assembly"}
            type="button"
          >
            {isEditing ? <X size={15} /> : <Edit3 size={15} />}
          </button>
        </div>
      </div>
      <div className="space-y-3 p-4 text-xs">
        {isEditing ? (
          <div className="nodrag space-y-3">
            <NodeSelect
              label="Transisi"
              value={draft.transitionStyle}
              options={[
                { label: "Cinematic dissolve", value: "Cinematic dissolve" },
                { label: "Clean cut", value: "Clean cut" },
                { label: "Fade through black", value: "Fade through black" },
                { label: "Motion blur match cut", value: "Motion blur match cut" }
              ]}
              onChange={(transitionStyle) =>
                setDraft((current) => ({ ...current, transitionStyle }))
              }
            />
            <NodeTextArea
              label="Voice over"
              rows={6}
              value={draft.voiceOverScript}
              onChange={(voiceOverScript) =>
                setDraft((current) => ({ ...current, voiceOverScript }))
              }
            />
            <NodeTextArea
              label="Music bed"
              value={draft.musicDirection}
              onChange={(musicDirection) =>
                setDraft((current) => ({ ...current, musicDirection }))
              }
            />
            <NodeTextArea
              label="Sound notes"
              value={draft.soundNotes}
              onChange={(soundNotes) => setDraft((current) => ({ ...current, soundNotes }))}
            />
            <div className="grid grid-cols-2 gap-2">
              <NodeActionButton icon={<X size={14} />} label="Cancel" onClick={() => setIsEditing(false)} />
              <NodeActionButton icon={<Check size={14} />} label="Apply" onClick={saveDraft} primary />
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              {final.clips.map((clip, index) => (
                <div
                  key={`${clip.sceneId}-${index}`}
                  className="rounded-md border border-emerald-400/25 bg-emerald-400/10 px-3 py-2"
                >
                  <p className="truncate font-semibold text-emerald-100">
                    {index + 1}. {clip.sceneTitle}
                  </p>
                  <p className="mt-1 text-[10px] text-emerald-200/70">{clip.duration}s</p>
                </div>
              ))}
            </div>
            <InfoPill label="Transisi" value={final.transitionStyle} />
            <div className="rounded-md border border-studio-line bg-slate-950/30 p-3">
              <p className="flex items-center gap-2 font-medium text-slate-200">
                <Mic2 size={14} className="text-studio-cyan" />
                Voice over
              </p>
              <p className="mt-2 line-clamp-5 leading-5 text-slate-400">{final.voiceOverScript}</p>
            </div>
            <div className="rounded-md border border-studio-line bg-slate-950/30 p-3">
              <p className="flex items-center gap-2 font-medium text-slate-200">
                <Music2 size={14} className="text-studio-cyan" />
                Music bed
              </p>
              <p className="mt-2 line-clamp-3 leading-5 text-slate-400">{final.musicDirection}</p>
            </div>
            <NodeActionButton
              icon={<Download size={14} />}
              label={final.clips.length >= 2 ? "Render Final MP4" : "Min. 2 scene approved"}
              onClick={final.onRenderFinal}
              disabled={!final.onRenderFinal || final.clips.length < 2}
              primary
            />
          </>
        )}
      </div>
    </NodeShell>
  );
}

