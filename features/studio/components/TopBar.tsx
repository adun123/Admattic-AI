import { useState } from "react";
import type React from "react";
import clsx from "clsx";
import { CheckCircle2, Download, History as HistoryIcon, Loader2, Play, Plus, Save, X } from "lucide-react";
import type { CostEntry, SaveState, StoredWorkspace } from "../types";

export function TopBar({
  isLoadingProject,
  saveState,
  history,
  onSave,
  onLoadHistory,
  onNewWorkspace,
  onDeleteHistory,
  onPreview,
  onExport,
  canPreview,
  canExport,
  userEmail,
  onLogout,
  costLog,
  onResetCostLog
}: {
  isLoadingProject: boolean;
  saveState: SaveState;
  history: StoredWorkspace[];
  onSave: () => void;
  onLoadHistory: (workspace: StoredWorkspace) => void;
  onNewWorkspace: () => void;
  onDeleteHistory?: (workspace: StoredWorkspace) => void;
  onPreview?: () => void;
  onExport?: () => void;
  canPreview?: boolean;
  canExport?: boolean;
  userEmail: string | null;
  onLogout: () => void;
  costLog: CostEntry[];
  onResetCostLog?: () => void;
}) {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const saveLabel =
    saveState === "saving"
      ? "Saving"
      : saveState === "saved"
        ? "Saved"
        : saveState === "error"
          ? "Save failed"
          : "Save";
  const saveIcon =
    saveState === "saving" ? (
      <Loader2 size={16} className="animate-spin" />
    ) : saveState === "saved" ? (
      <CheckCircle2 size={16} />
    ) : (
      <Save size={16} />
    );

  const totalSpent = costLog.reduce((sum, entry) => sum + entry.cost, 0);
  const totalSpentIdr = costLog.reduce(
    (sum, entry) => sum + (entry.costIdr ?? Math.round(entry.cost * 18000)),
    0
  );
  const videoCount = costLog.length;

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-studio-line bg-studio-panel px-5">
      <div className="flex items-center gap-3">
        <div className="grid h-9 w-9 place-items-center overflow-hidden rounded-md border border-studio-line bg-white">
          <img
            alt="Admattic"
            className="h-full w-full object-contain p-1"
            src="/images/lgo-admattic.jpg"
          />
        </div>
        <div>
          <h1 className="text-sm font-semibold">Admattic AI Studio</h1>
          <p className="text-xs text-slate-400">Agency Anniversary POC</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative">
          <IconButton
            label="History"
            icon={<HistoryIcon size={16} />}
            onClick={() => setIsHistoryOpen((current) => !current)}
          />
          {isHistoryOpen ? (
            <div className="absolute right-0 top-11 z-30 w-72 rounded-lg border border-studio-line bg-studio-panel p-2 shadow-glow">
              <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Riwayat draft
              </div>
              {history.length > 0 ? (
                <div className="mt-1 max-h-72 space-y-1 overflow-auto">
                  {history.map((item) => (
                    <div
                      key={`${item.id}-${item.updatedAt}`}
                      className="flex items-center gap-1 rounded-md px-2 py-2 text-xs transition hover:bg-studio-panelSoft"
                    >
                      <button
                        className="min-w-0 flex-1 rounded-md text-left"
                        onClick={() => {
                          onLoadHistory(item);
                          setIsHistoryOpen(false);
                        }}
                        type="button"
                      >
                        <span className="block truncate font-semibold text-slate-100">
                          {item.title}
                        </span>
                        <span className="mt-1 block text-[10px] text-slate-500">
                          {new Date(item.updatedAt).toLocaleString("id-ID")}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          onDeleteHistory?.(item);
                        }}
                        className="grid h-7 w-7 shrink-0 place-items-center rounded-md border border-transparent text-slate-500 transition hover:border-red-400/40 hover:text-red-300"
                        title="Hapus riwayat"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-2 py-3 text-xs text-slate-500">Belum ada draft.</div>
              )}
            </div>
          ) : null}
        </div>
        <IconButton label="New" icon={<Plus size={16} />} onClick={onNewWorkspace} />
        <IconButton
          label={isLoadingProject ? "Loading" : saveLabel}
          icon={isLoadingProject ? <Loader2 size={16} className="animate-spin" /> : saveIcon}
          onClick={onSave}
          disabled={isLoadingProject || saveState === "saving"}
        />
        <IconButton label="Preview" icon={<Play size={16} />} onClick={onPreview} disabled={!canPreview} />
        <IconButton
          label="Export"
          icon={<Download size={16} />}
          onClick={onExport}
          disabled={!canExport}
          primary
        />
      </div>
      <div className="flex items-center gap-3">
        {videoCount > 0 ? (
          <div className="flex items-center gap-2 rounded-md border border-studio-line bg-studio-panelSoft px-2.5 py-1 text-xs text-slate-300">
            <span className="font-semibold text-emerald-300">${totalSpent.toFixed(2)}</span>
            <span className="text-slate-500">
              ~Rp{totalSpentIdr.toLocaleString("id-ID")} ({videoCount} video)
            </span>
            {onResetCostLog ? (
              <button
                type="button"
                onClick={onResetCostLog}
                className="ml-1 text-slate-500 transition hover:text-red-300"
                title="Reset tracker"
              >
                <X size={12} />
              </button>
            ) : null}
          </div>
        ) : null}
        {userEmail ? (
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="hidden md:inline">{userEmail}</span>
            <button
              type="button"
              onClick={onLogout}
              className="rounded-md border border-studio-line px-2 py-1 text-xs text-slate-300 transition hover:border-red-400/60 hover:text-red-200"
            >
              Keluar
            </button>
          </div>
        ) : null}
      </div>
    </header>
  );
}

function IconButton({
  label,
  icon,
  primary,
  onClick,
  disabled
}: {
  label: string;
  icon: React.ReactNode;
  primary?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      className={clsx(
        "flex h-9 items-center gap-2 rounded-md border px-3 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
        primary
          ? "border-studio-cyan bg-studio-cyan text-slate-950 hover:bg-cyan-300"
          : "border-studio-line bg-studio-panelSoft text-slate-200 hover:border-studio-cyan/70"
      )}
      title={label}
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
