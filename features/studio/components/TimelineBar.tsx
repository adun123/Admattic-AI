import { Film, X } from "lucide-react";
import type { OutputNodeData } from "../types";

export function TimelineBar({
  timeline,
  onGenerateAll,
  onRemoveClip,
  pendingCount
}: {
  timeline: OutputNodeData[];
  onGenerateAll?: () => void;
  onRemoveClip?: (sceneId: string) => void;
  pendingCount: number;
}) {
  return (
    <div className="absolute bottom-4 left-1/2 z-10 flex w-[min(920px,calc(100%-32px))] -translate-x-1/2 items-center gap-3 rounded-lg border border-studio-line bg-studio-panel/95 p-3 shadow-glow backdrop-blur">
      <div className="flex w-36 shrink-0 items-center gap-2 text-xs font-semibold text-slate-200">
        <Film size={16} className="text-studio-cyan" />
        Final Timeline
      </div>
      <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto">
        {timeline.length === 0 && pendingCount === 0 ? (
          <div className="rounded-md border border-dashed border-studio-line px-4 py-2 text-xs text-slate-500">
            Approve output scene untuk membangun final timeline.
          </div>
        ) : (
          timeline.map((item, index) => (
            <div
              key={`${item.sceneId}-${index}`}
              className="group flex min-w-40 items-start gap-2 rounded-md border border-emerald-400/30 bg-emerald-400/10 px-3 py-2"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-emerald-100">{item.sceneTitle}</p>
                <p className="mt-1 text-[10px] text-emerald-200/70">Approved clip</p>
              </div>
              <button
                type="button"
                onClick={() => onRemoveClip?.(item.sceneId)}
                className="grid h-6 w-6 shrink-0 place-items-center rounded border border-emerald-300/20 text-emerald-100/70 transition hover:border-red-300/60 hover:bg-red-400/10 hover:text-red-200"
                title="Remove from final timeline"
                disabled={!onRemoveClip}
              >
                <X size={12} />
              </button>
            </div>
          ))
        )}
      </div>
      {onGenerateAll && pendingCount > 0 ? (
        <button
          type="button"
          onClick={onGenerateAll}
          className="shrink-0 rounded-md border border-studio-cyan/70 bg-studio-cyan/10 px-3 py-1.5 text-xs font-semibold text-studio-cyan transition hover:bg-studio-cyan/20"
        >
          Generate All ({pendingCount})
        </button>
      ) : null}
    </div>
  );
}
