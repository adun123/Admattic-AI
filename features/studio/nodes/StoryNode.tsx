import { useEffect, useRef, useState } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Check, Edit3, FileText, ImagePlus, Loader2, Wand2, X } from "lucide-react";
import { aspectRatioOptions, durationOptions, renderQualityOptions, sceneCountOptions, styleOptions, toneOptions } from "../constants";
import type { StoryNodeData, StudioNode } from "../types";
import { InfoPill, NodeActionButton, NodeInput, NodeSelect, NodeTextArea } from "./NodeControls";
import { NodeShell } from "./NodeShell";

export function StoryNode({ data, selected }: NodeProps<StudioNode>) {
  const story = data as StoryNodeData;
  const referenceInputRef = useRef<HTMLInputElement | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isUploadingReference, setIsUploadingReference] = useState(false);
  const [draft, setDraft] = useState({
    story: story.story,
    protagonist: story.protagonist,
    tone: story.tone,
    style: story.style,
    styleDirection: story.styleDirection,
    duration: story.duration ? String(story.duration) : "",
    aspectRatio: story.aspectRatio,
    sceneCount: story.sceneCount ? String(story.sceneCount) : "",
    renderQuality: story.renderQuality
  });

  useEffect(() => {
    if (isEditing) return;
    setDraft({
      story: story.story,
      protagonist: story.protagonist,
      tone: story.tone,
      style: story.style,
      styleDirection: story.styleDirection,
      duration: story.duration ? String(story.duration) : "",
      aspectRatio: story.aspectRatio,
      sceneCount: story.sceneCount ? String(story.sceneCount) : "",
      renderQuality: story.renderQuality
    });
  }, [
    isEditing,
    story.aspectRatio,
    story.duration,
    story.protagonist,
    story.renderQuality,
    story.sceneCount,
    story.story,
    story.style,
    story.styleDirection,
    story.tone
  ]);

  const saveDraft = () => {
    story.onUpdate?.({
      story: draft.story,
      protagonist: draft.protagonist,
      tone: draft.tone || toneOptions[0],
      style: draft.style || styleOptions[0],
      styleDirection: draft.styleDirection,
      duration: Number.parseInt(draft.duration, 10) || durationOptions[3],
      aspectRatio: draft.aspectRatio || aspectRatioOptions[0],
      sceneCount: Number.parseInt(draft.sceneCount, 10) || sceneCountOptions[2],
      renderQuality: draft.renderQuality || renderQualityOptions[0]
    });
    setIsEditing(false);
  };

  const uploadReference = async (file?: File) => {
    if (!file || !story.onAddReference) return;
    setIsUploadingReference(true);
    try {
      await story.onAddReference(file);
    } finally {
      setIsUploadingReference(false);
      if (referenceInputRef.current) referenceInputRef.current.value = "";
    }
  };

  return (
    <NodeShell selected={selected}>
      <div className="border-b border-studio-line p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <FileText size={16} className="text-studio-cyan" />
              Story Input
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-400">
              Source story and production settings for the canvas.
            </p>
          </div>
          <button
            className="nodrag grid h-8 w-8 shrink-0 place-items-center rounded-md border border-studio-line bg-studio-panelSoft text-slate-200 transition hover:border-studio-cyan/70"
            onClick={() => setIsEditing((current) => !current)}
            title={isEditing ? "Close editor" : "Edit story"}
            type="button"
          >
            {isEditing ? <X size={15} /> : <Edit3 size={15} />}
          </button>
        </div>
      </div>
      <div className="space-y-3 p-4 text-xs">
        {isEditing ? (
          <div className="nodrag space-y-3">
            <div>
              <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Cerita <span className="text-red-400">*</span>
              </label>
              <textarea
                className={
                  "h-32 w-full resize-none rounded-md border bg-slate-950/30 px-3 py-2 text-sm leading-5 text-slate-100 outline-none " +
                  (draft.story.trim().length > 0 && draft.story.trim().length < 50
                    ? "border-red-400/60 focus:border-red-400"
                    : "border-studio-line focus:border-studio-cyan")
                }
                placeholder="Tulis singkat cerita atau ide videomu di sini (min. 50 karakter)."
                value={draft.story}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, story: event.target.value }))
                }
              />
              {draft.story.trim().length > 0 && draft.story.trim().length < 50 ? (
                <p className="mt-1 text-[10px] text-red-300">
                  Terlalu pendek ({draft.story.trim().length}/50 karakter).
                </p>
              ) : null}
            </div>
            <div>
              <NodeInput
                label="Karakter utama *"
                value={draft.protagonist}
                onChange={(protagonist) =>
                  setDraft((current) => ({ ...current, protagonist }))
                }
              />
              {draft.protagonist.trim().length === 0 ? null : null}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <NodeSelect
                label="Tone"
                value={draft.tone}
                options={toneOptions.map((tone) => ({ label: tone, value: tone }))}
                onChange={(tone) => setDraft((current) => ({ ...current, tone }))}
              />
              <NodeSelect
                label="Style"
                value={draft.style}
                options={styleOptions.map((style) => ({ label: style, value: style }))}
                onChange={(style) => setDraft((current) => ({ ...current, style }))}
              />
              <div className="col-span-2">
                <NodeTextArea
                  label="Manual style"
                  rows={3}
                  value={draft.styleDirection}
                  onChange={(styleDirection) =>
                    setDraft((current) => ({ ...current, styleDirection }))
                  }
                />
              </div>
              <NodeSelect
                label="Duration"
                value={draft.duration}
                options={durationOptions.map((duration) => ({
                  label: `${duration}s`,
                  value: String(duration)
                }))}
                onChange={(duration) => setDraft((current) => ({ ...current, duration }))}
              />
              <NodeSelect
                label="Format"
                value={draft.aspectRatio}
                options={aspectRatioOptions.map((aspectRatio) => ({
                  label: aspectRatio,
                  value: aspectRatio
                }))}
                onChange={(aspectRatio) => setDraft((current) => ({ ...current, aspectRatio }))}
              />
              <NodeSelect
                label="Scene"
                value={draft.sceneCount}
                options={sceneCountOptions.map((sceneCount) => ({
                  label: `${sceneCount} scene`,
                  value: String(sceneCount)
                }))}
                onChange={(sceneCount) => setDraft((current) => ({ ...current, sceneCount }))}
              />
              <NodeSelect
                label="Quality"
                value={draft.renderQuality}
                options={renderQualityOptions.map((quality) => ({
                  label: quality,
                  value: quality
                }))}
                onChange={(renderQuality) =>
                  setDraft((current) => ({ ...current, renderQuality }))
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <NodeActionButton icon={<X size={14} />} label="Cancel" onClick={() => setIsEditing(false)} />
              <NodeActionButton
                icon={<Check size={14} />}
                label="Apply"
                onClick={saveDraft}
                primary
                disabled={draft.story.trim().length < 50 || !draft.protagonist.trim()}
              />
            </div>
            {draft.story.trim().length < 50 || !draft.protagonist.trim() ? (
              <div className="rounded-md border border-amber-500/30 bg-amber-950/20 px-2.5 py-1.5 text-[10px] leading-snug text-amber-200">
                Kolom wajib: <strong>Cerita</strong> (min. 50 karakter) dan <strong>Karakter utama</strong> harus diisi. Sisanya opsional.
              </div>
            ) : null}
          </div>
        ) : (
          <>
            <div className="min-h-24 rounded-md border border-dashed border-studio-line bg-slate-950/20 p-3">
              {story.story ? (
                <p className="line-clamp-5 leading-5 text-slate-200">{story.story}</p>
              ) : null}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <InfoPill label="Karakter" value={story.protagonist || "Belum diisi"} />
              <InfoPill label="Tone" value={story.tone || "-"} />
              <InfoPill label="Style" value={story.style || "-"} />
              <InfoPill label="Manual style" value={story.styleDirection || "-"} />
              <InfoPill label="Duration" value={story.duration ? `${story.duration}s` : "-"} />
              <InfoPill label="Format" value={story.aspectRatio || "-"} />
              <InfoPill label="Scene" value={story.sceneCount ? `${story.sceneCount}` : "-"} />
              <InfoPill label="Quality" value={story.renderQuality || "-"} />
            </div>
            {(story.referenceAssets ?? []).length > 0 ? (
              <div className="space-y-2 rounded-md border border-studio-line bg-slate-950/30 p-3">
                <p className="text-[10px] uppercase tracking-wider text-slate-500">References</p>
                {(story.referenceAssets ?? []).map((asset) => (
                  <div
                    key={asset.id}
                    className="flex items-center justify-between gap-2 rounded-md bg-studio-panelSoft px-2 py-2"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-slate-100">{asset.name}</p>
                      <p className="mt-0.5 text-[10px] uppercase tracking-wider text-cyan-200">
                        {asset.purpose} / {asset.type}
                      </p>
                    </div>
                    <button
                      className="nodrag grid h-7 w-7 shrink-0 place-items-center rounded-md border border-studio-line text-slate-400 transition hover:border-red-400/60 hover:text-red-200"
                      onClick={() =>
                        story.onUpdate?.({
                          referenceAssets: (story.referenceAssets ?? []).filter(
                            (reference) => reference.id !== asset.id
                          )
                        })
                      }
                      title="Remove reference"
                      type="button"
                    >
                      <X size={13} />
                    </button>
                  </div>
                ))}
              </div>
            ) : null}
          </>
        )}
        <div className="nodrag grid grid-cols-2 gap-2">
          <input
            ref={referenceInputRef}
            className="hidden"
            type="file"
            accept="image/*,video/*,audio/*,.pdf"
            onChange={(event) => uploadReference(event.target.files?.[0])}
          />
           <NodeActionButton
            icon={
              isUploadingReference ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <ImagePlus size={14} />
              )
            }
            label={isUploadingReference ? "Uploading" : "Reference"}
            onClick={() => referenceInputRef.current?.click()}
            disabled={isUploadingReference}
          />
          {(story.referenceAssets ?? []).length > 0 ? (
            <div className="col-span-2 rounded-md border border-slate-600/40 bg-slate-800/30 px-2.5 py-1.5 text-[10px] leading-snug text-slate-300">
              Reference image dipakai untuk menjaga wajah/identitas karakter antar scene. Gunakan foto original yang kamu miliki hak pakainya.
            </div>
          ) : null}
          {(story.story.trim().length < 50 || !story.protagonist.trim()) ? (
            <div className="col-span-2 rounded-md border border-amber-500/30 bg-amber-950/20 px-2.5 py-1.5 text-[10px] leading-snug text-amber-200">
              Isi <strong>Cerita</strong> (min. 50 karakter) dan <strong>Karakter utama</strong> sebelum generate.
            </div>
          ) : null}
          <NodeActionButton
            icon={
              story.isGeneratingStructure ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Wand2 size={14} />
              )
            }
            label={story.isGeneratingStructure ? "Generating" : "Generate"}
            onClick={story.onGenerateStructure}
            disabled={
              story.isGeneratingStructure ||
              story.story.trim().length < 50 ||
              !story.protagonist.trim()
            }
            primary
          />
        </div>
      </div>
      <Handle type="source" position={Position.Right} />
    </NodeShell>
  );
}

