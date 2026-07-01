import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { OutputNodeData } from "../types";

export function PreviewPlaylist({
  timeline,
  onClose
}: {
  timeline: OutputNodeData[];
  onClose: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const clip = timeline[currentIndex];

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight")
        setCurrentIndex((i) => Math.min(i + 1, timeline.length - 1));
      if (event.key === "ArrowLeft") setCurrentIndex((i) => Math.max(i - 1, 0));
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, timeline.length]);

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-black/95 text-slate-100">
      <div className="flex items-center justify-between border-b border-studio-line px-5 py-3">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-semibold">Timeline Preview</h2>
          <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">
            {currentIndex + 1} / {timeline.length}
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="grid h-8 w-8 place-items-center rounded-md border border-studio-line text-slate-300 transition hover:border-red-400/60 hover:text-red-200"
          title="Close preview"
        >
          <X size={15} />
        </button>
      </div>
      <div className="flex min-h-0 flex-1 items-center justify-center gap-4 p-6">
        <button
          type="button"
          onClick={() => setCurrentIndex((i) => Math.max(i - 1, 0))}
          disabled={currentIndex === 0}
          className="grid h-12 w-12 place-items-center rounded-full border border-studio-line text-slate-300 transition hover:border-studio-cyan/70 hover:text-studio-cyan disabled:cursor-not-allowed disabled:opacity-40"
        >
          ←
        </button>
        <div className="flex h-full max-h-[70vh] w-full max-w-4xl flex-col items-center justify-center gap-3">
          {clip?.videoUrl ? (
            <video
              key={`${clip.sceneId}-${currentIndex}`}
              className="max-h-full w-full rounded-lg border border-studio-line bg-slate-950 object-contain"
              style={{
                aspectRatio: clip.aspectRatio === "16:9" ? "16 / 9" : "9 / 16"
              }}
              controls
              autoPlay
              src={clip.videoUrl}
            />
          ) : (
            <div
              className="grid h-full w-full place-items-center rounded-lg border border-studio-line bg-slate-900 text-slate-500"
              style={{
                aspectRatio: clip?.aspectRatio === "16:9" ? "16 / 9" : "9 / 16"
              }}
            >
              No video yet
            </div>
          )}
          <div className="text-center">
            <h3 className="text-base font-semibold">{clip?.sceneTitle ?? ""}</h3>
            <p className="mt-1 text-xs text-slate-400">{clip?.provider}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() =>
            setCurrentIndex((i) => Math.min(i + 1, timeline.length - 1))
          }
          disabled={currentIndex >= timeline.length - 1}
          className="grid h-12 w-12 place-items-center rounded-full border border-studio-line text-slate-300 transition hover:border-studio-cyan/70 hover:text-studio-cyan disabled:cursor-not-allowed disabled:opacity-40"
        >
          →
        </button>
      </div>
      <div className="border-t border-studio-line px-5 py-3">
        <div className="flex gap-2 overflow-x-auto">
          {timeline.map((item, index) => (
            <button
              key={`${item.sceneId}-${index}`}
              type="button"
              onClick={() => setCurrentIndex(index)}
              className={
                index === currentIndex
                  ? "shrink-0 rounded-md border border-studio-cyan bg-studio-cyan/20 px-3 py-1.5 text-xs font-semibold text-studio-cyan"
                  : "shrink-0 rounded-md border border-studio-line bg-studio-panelSoft px-3 py-1.5 text-xs text-slate-400 hover:border-slate-400 hover:text-slate-200"
              }
            >
              {index + 1}. {item.sceneTitle}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
