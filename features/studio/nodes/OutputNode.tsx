import { useState } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { BadgeCheck, Download, Film, History as HistoryIcon, Play, RefreshCw } from "lucide-react";
import type { OutputNodeData, StudioNode } from "../types";
import { downloadVideo } from "../utils/downloadVideo";
import { NodeActionButton, StatusBadge } from "./NodeControls";
import { NodeShell } from "./NodeShell";

export function OutputNode({ data, selected }: NodeProps<StudioNode>) {
  const output = data as OutputNodeData;
  const [activeVersion, setActiveVersion] = useState<number>(0);

  const hasVersions = (output.versions?.length ?? 0) > 0;
  const totalVersions = hasVersions ? (output.versions?.length ?? 0) + 1 : 1;

  const activeVideoUrl =
    hasVersions && activeVersion > 0
      ? output.versions?.[activeVersion - 1]?.videoUrl
      : output.videoUrl;
  const activeProvider =
    hasVersions && activeVersion > 0
      ? output.versions?.[activeVersion - 1]?.provider
      : output.provider;

  return (
    <NodeShell selected={selected} accent="blue">
      <Handle type="target" position={Position.Left} />
      <div className="border-b border-studio-line p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-white">
          <Film size={16} className="text-studio-blue" />
          Video Output
        </div>
        <p className="mt-2 text-xs text-slate-400">{output.sceneTitle}</p>
      </div>
      <div className="space-y-3 p-4">
        {activeVideoUrl ? (
          <video
            className="nodrag w-full rounded-md border border-studio-line bg-slate-950 object-contain"
            style={{
              aspectRatio:
                output.aspectRatio === "16:9" ? "16 / 9" : "9 / 16",
              maxHeight: "60vh"
            }}
            controls
            src={activeVideoUrl}
          />
        ) : (
          <div
            className="flex items-center justify-center rounded-md border border-studio-line bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950"
            style={{
              aspectRatio:
                output.aspectRatio === "16:9" ? "16 / 9" : "9 / 16",
              maxHeight: "60vh"
            }}
          >
            <div className="grid h-12 w-12 place-items-center rounded-full bg-white/10">
              <Play size={22} className="text-studio-cyan" />
            </div>
          </div>
        )}
        {hasVersions ? (
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-slate-500">
              <HistoryIcon size={11} />
              Versi ({totalVersions})
            </div>
            <div className="nodrag flex flex-wrap gap-1">
              <button
                type="button"
                onClick={() => setActiveVersion(0)}
                className={
                  activeVersion === 0
                    ? "rounded border border-studio-blue bg-studio-blue/20 px-2 py-0.5 text-[10px] font-semibold text-studio-blue"
                    : "rounded border border-studio-line bg-studio-panelSoft px-2 py-0.5 text-[10px] text-slate-400 hover:border-slate-400 hover:text-slate-200"
                }
              >
                V{totalVersions}
              </button>
              {output.versions
                ?.map((_, index) => index)
                .reverse()
                .map((versionIndex) => (
                  <button
                    key={versionIndex}
                    type="button"
                    onClick={() => setActiveVersion(versionIndex + 1)}
                    className={
                      activeVersion === versionIndex + 1
                        ? "rounded border border-studio-blue bg-studio-blue/20 px-2 py-0.5 text-[10px] font-semibold text-studio-blue"
                        : "rounded border border-studio-line bg-studio-panelSoft px-2 py-0.5 text-[10px] text-slate-400 hover:border-slate-400 hover:text-slate-200"
                    }
                  >
                    V{versionIndex + 1}
                  </button>
                ))}
            </div>
          </div>
        ) : null}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>{activeProvider}</span>
          <StatusBadge status={output.status} />
        </div>
        <div className="nodrag grid grid-cols-3 gap-2">
          <NodeActionButton
            icon={<Download size={14} />}
            label="Download"
            onClick={
              activeVideoUrl
                ? () => {
                    const safeTitle = output.sceneTitle
                      .replace(/[^a-zA-Z0-9-_]+/g, "-")
                      .toLowerCase()
                      .slice(0, 40);
                    void downloadVideo(activeVideoUrl, `${safeTitle}.mp4`);
                  }
                : undefined
            }
            disabled={!activeVideoUrl}
          />
          <NodeActionButton
                  icon={<RefreshCw size={14} />}
                  label="Retry"
                  onClick={output.onRetry}
                  disabled={!output.onRetry}
                />
          <NodeActionButton
            icon={<BadgeCheck size={14} />}
            label={output.status === "approved" ? "Approved" : "Approve"}
            onClick={output.onApprove}
            disabled={output.status === "approved"}
            primary
          />
        </div>
      </div>
    </NodeShell>
  );
}

