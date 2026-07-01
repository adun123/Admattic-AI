import type React from "react";
import clsx from "clsx";
import { BadgeCheck, Film, ImagePlus, Loader2, PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen, Plus, RefreshCw, Wand2 } from "lucide-react";
import type { OutputNodeData, SceneNodeData, StoryNodeData, StudioNode } from "../types";

function CanvasCommandBar({
  isGeneratingStructure,
  onGenerateStructure
}: {
  isGeneratingStructure: boolean;
  onGenerateStructure: () => void;
}) {
  return (
    <div className="absolute left-1/2 top-4 z-20 flex w-[min(620px,calc(100%-32px))] -translate-x-1/2 items-center justify-between gap-3 rounded-lg border border-studio-line bg-studio-panel/92 px-3 py-2 shadow-glow backdrop-blur-xl">
      <div className="min-w-0">
        <p className="text-xs font-semibold text-slate-100">Canvas Actions</p>
        <p className="truncate text-[11px] text-slate-400">Reference assets and AI structure live with the canvas.</p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <button
          className="flex h-9 items-center justify-center gap-2 rounded-md border border-studio-line bg-studio-panelSoft px-3 text-xs font-semibold text-slate-200 transition hover:border-studio-cyan/70"
          type="button"
        >
          <ImagePlus size={15} />
          <span className="hidden sm:inline">Add Reference</span>
        </button>
        <button
          className="flex h-9 items-center justify-center gap-2 rounded-md bg-studio-cyan px-3 text-xs font-bold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
          onClick={onGenerateStructure}
          disabled={isGeneratingStructure}
          type="button"
        >
          {isGeneratingStructure ? <Loader2 size={15} className="animate-spin" /> : <Wand2 size={15} />}
          <span>{isGeneratingStructure ? "Generating" : "Generate"}</span>
        </button>
      </div>
    </div>
  );
}

function FloatingPanel({
  side,
  title,
  subtitle,
  icon,
  isOpen,
  onToggle,
  children
}: {
  side: "left" | "right";
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  const ToggleIcon =
    side === "left"
      ? isOpen
        ? PanelLeftClose
        : PanelLeftOpen
      : isOpen
        ? PanelRightClose
        : PanelRightOpen;

  return (
    <aside
      className={clsx(
        "absolute top-4 z-20 flex max-h-[calc(100%-112px)] flex-col rounded-lg border border-studio-line bg-studio-panel/92 shadow-glow backdrop-blur-xl transition-all duration-200",
        side === "left" ? "left-4" : "right-4",
        isOpen ? "w-[min(340px,calc(100vw-32px))]" : "w-12 overflow-hidden"
      )}
    >
      <div
        className={clsx(
          "flex h-12 shrink-0 items-center border-b border-studio-line",
          isOpen ? "gap-3 px-3" : "justify-center px-2"
        )}
      >
        <div
          className={clsx(
            "grid h-7 w-7 shrink-0 place-items-center rounded-md bg-studio-panelSoft text-studio-cyan",
            !isOpen && "hidden"
          )}
        >
          {icon}
        </div>
        <div className={clsx("min-w-0 flex-1", !isOpen && "hidden")}>
          <h2 className="truncate text-sm font-semibold">{title}</h2>
          <p className="truncate text-xs text-slate-400">{subtitle}</p>
        </div>
        <button
          className="grid h-8 w-8 shrink-0 place-items-center rounded-md border border-studio-line bg-studio-panelSoft text-slate-200 transition hover:border-studio-cyan/70"
          onClick={onToggle}
          title={isOpen ? `Collapse ${title}` : `Expand ${title}`}
          type="button"
        >
          <ToggleIcon size={15} />
        </button>
      </div>
      <div className={clsx("min-h-0 overflow-y-auto p-4", !isOpen && "hidden")}>{children}</div>
    </aside>
  );
}

function LeftPanel({
  isGeneratingStructure,
  onGenerateStructure
}: {
  isGeneratingStructure: boolean;
  onGenerateStructure: () => void;
}) {
  return (
    <div>
      <div className="mb-5 flex items-center justify-end">
        <button
          className="grid h-8 w-8 place-items-center rounded-md border border-studio-line bg-studio-panelSoft"
          title="New project"
          type="button"
        >
          <Plus size={15} />
        </button>
      </div>
      <div className="space-y-4">
        <Field label="Video Type" value="Anniversary" />
        <Field label="Tone" value="Emotional" />
        <Field label="Visual Style" value="Cinematic Corporate" />
        <Field label="Duration" value="60 seconds" />
        <Field label="Aspect Ratio" value="9:16 Reels" />
        <button
          className="flex h-10 w-full items-center justify-center gap-2 rounded-md border border-studio-line bg-studio-panelSoft text-xs font-semibold text-slate-200 hover:border-studio-cyan/70"
          type="button"
        >
          <ImagePlus size={15} />
          Add Reference
        </button>
        <button
          className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-studio-cyan text-sm font-bold text-slate-950 hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
          onClick={onGenerateStructure}
          disabled={isGeneratingStructure}
          type="button"
        >
          {isGeneratingStructure ? <Loader2 size={17} className="animate-spin" /> : <Wand2 size={17} />}
          {isGeneratingStructure ? "Generating" : "Generate Structure"}
        </button>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </span>
      <div className="mt-2 rounded-md border border-studio-line bg-slate-950/20 px-3 py-2.5 text-sm text-slate-200">
        {value}
      </div>
    </label>
  );
}

function RightPanel({
  selectedNode,
  onGenerateVideo,
  onApproveOutput,
  onUpdate
}: {
  selectedNode?: StudioNode;
  onGenerateVideo: () => void;
  onApproveOutput: () => void;
  onUpdate: (patch: Partial<SceneNodeData> | Partial<StoryNodeData>) => void;
}) {
  return (
    <div>
      {!selectedNode ? (
        <p className="text-sm text-slate-400">Select a node to edit details.</p>
      ) : selectedNode.data.kind === "story" ? (
        <StoryEditor data={selectedNode.data} onUpdate={onUpdate} />
      ) : selectedNode.data.kind === "scene" ? (
        <SceneEditor data={selectedNode.data} onUpdate={onUpdate} onGenerateVideo={onGenerateVideo} />
      ) : selectedNode.data.kind === "output" ? (
        <OutputEditor data={selectedNode.data} onApproveOutput={onApproveOutput} />
      ) : (
        <p className="text-sm text-slate-400">Final assembly settings live on the canvas.</p>
      )}
    </div>
  );
}

function StoryEditor({
  data,
  onUpdate
}: {
  data: StoryNodeData;
  onUpdate: (patch: Partial<StoryNodeData>) => void;
}) {
  return (
    <div className="space-y-4">
      <TextArea label="Story" value={data.story} onChange={(story) => onUpdate({ story })} rows={8} />
      <div className="grid grid-cols-2 gap-3">
        <Input label="Tone" value={data.tone} onChange={(tone) => onUpdate({ tone })} />
        <Input label="Style" value={data.style} onChange={(style) => onUpdate({ style })} />
      </div>
    </div>
  );
}

function SceneEditor({
  data,
  onUpdate,
  onGenerateVideo
}: {
  data: SceneNodeData;
  onUpdate: (patch: Partial<SceneNodeData>) => void;
  onGenerateVideo: () => void;
}) {
  return (
    <div className="space-y-4">
      <Input label="Title" value={data.title} onChange={(title) => onUpdate({ title })} />
      <TextArea
        label="Narration"
        value={data.narration}
        onChange={(narration) => onUpdate({ narration })}
        rows={3}
      />
      <TextArea
        label="Visual Description"
        value={data.visualDescription}
        onChange={(visualDescription) => onUpdate({ visualDescription })}
        rows={3}
      />
      <Input
        label="Camera"
        value={data.cameraDirection}
        onChange={(cameraDirection) => onUpdate({ cameraDirection })}
      />
      <TextArea label="Prompt" value={data.prompt} onChange={(prompt) => onUpdate({ prompt })} rows={5} />
      <button
        className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-studio-violet text-sm font-bold text-white hover:bg-violet-500"
        onClick={onGenerateVideo}
        type="button"
      >
        {data.status === "generating" ? <Loader2 size={17} className="animate-spin" /> : <Film size={17} />}
        Generate Video Node
      </button>
    </div>
  );
}

function OutputEditor({
  data,
  onApproveOutput
}: {
  data: OutputNodeData;
  onApproveOutput: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-md border border-studio-line bg-slate-950/30 p-3">
        <p className="text-xs uppercase tracking-wide text-slate-500">Scene</p>
        <p className="mt-1 text-sm font-semibold">{data.sceneTitle}</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button
          className="flex h-10 items-center justify-center gap-2 rounded-md border border-studio-line bg-studio-panelSoft text-xs font-semibold hover:border-studio-cyan/70"
          type="button"
        >
          <RefreshCw size={15} />
          Regenerate
        </button>
        <button
          className="flex h-10 items-center justify-center gap-2 rounded-md bg-emerald-400 text-xs font-bold text-emerald-950 hover:bg-emerald-300"
          onClick={onApproveOutput}
          type="button"
        >
          <BadgeCheck size={15} />
          Approve
        </button>
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </span>
      <input
        className="mt-2 w-full rounded-md border border-studio-line bg-slate-950/30 px-3 py-2 text-sm outline-none focus:border-studio-cyan"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  rows
}: {
  label: string;
  value: string;
  rows: number;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </span>
      <textarea
        className="mt-2 w-full resize-none rounded-md border border-studio-line bg-slate-950/30 px-3 py-2 text-sm leading-5 outline-none focus:border-studio-cyan"
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}
