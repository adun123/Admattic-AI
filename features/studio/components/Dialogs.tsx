"use client";

import { useEffect } from "react";
import { AlertTriangle, Info, X, AlertOctagon } from "lucide-react";

type AlertVariant = "danger" | "warning" | "info";

const variantConfig: Record<
  AlertVariant,
  {
    borderColor: string;
    bgColor: string;
    headerColor: string;
    buttonColor: string;
    buttonHover: string;
    Icon: typeof AlertTriangle;
    defaultMessage: string;
  }
> = {
  danger: {
    borderColor: "border-red-400/50",
    bgColor: "bg-red-950",
    headerColor: "text-red-200",
    buttonColor: "bg-red-700",
    buttonHover: "hover:bg-red-600",
    Icon: AlertOctagon,
    defaultMessage: "Terjadi kesalahan"
  },
  warning: {
    borderColor: "border-amber-400/50",
    bgColor: "bg-amber-950",
    headerColor: "text-amber-200",
    buttonColor: "bg-amber-700",
    buttonHover: "hover:bg-amber-600",
    Icon: AlertTriangle,
    defaultMessage: "Perhatian"
  },
  info: {
    borderColor: "border-sky-400/50",
    bgColor: "bg-sky-950",
    headerColor: "text-sky-200",
    buttonColor: "bg-sky-700",
    buttonHover: "hover:bg-sky-600",
    Icon: Info,
    defaultMessage: "Informasi"
  }
};

export function AlertDialog({
  isOpen,
  onClose,
  title,
  message,
  variant = "danger",
  closeLabel = "Tutup"
}: {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  variant?: AlertVariant;
  closeLabel?: string;
}) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const config = variantConfig[variant];
  const { Icon } = config;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      role="alertdialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className={`relative max-h-[80vh] w-full max-w-md overflow-auto rounded-xl border ${config.borderColor} ${config.bgColor} p-6 text-slate-100 shadow-2xl`}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 grid h-7 w-7 place-items-center rounded-md text-slate-400 transition hover:border hover:border-red-400/60 hover:text-red-200"
          title={closeLabel}
          aria-label="Close"
        >
          <X size={14} />
        </button>
        <div className="flex items-start gap-3">
          <div
            className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${config.bgColor} ${config.borderColor} border`}
          >
            <Icon size={20} className={config.headerColor} />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className={`text-base font-semibold ${config.headerColor}`}>
              {title ?? config.defaultMessage}
            </h3>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-200">
              {message}
            </p>
          </div>
        </div>
        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className={`rounded-md ${config.buttonColor} px-4 py-2 text-sm font-semibold text-white transition ${config.buttonHover}`}
          >
            {closeLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export function ConfirmDialog({
  isOpen,
  onCancel,
  onConfirm,
  title,
  message,
  confirmLabel = "Ya, lanjutkan",
  cancelLabel = "Batal",
  variant = "warning",
  loading = false
}: {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: Extract<AlertVariant, "warning" | "danger">;
  loading?: boolean;
}) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const config = variantConfig[variant];
  const { Icon } = config;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      role="alertdialog"
      aria-modal="true"
      onClick={onCancel}
    >
      <div
        className={`max-h-[80vh] w-full max-w-md overflow-auto rounded-xl border ${config.borderColor} ${config.bgColor} p-6 text-slate-100 shadow-2xl`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <div
            className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${config.bgColor} ${config.borderColor} border`}
          >
            <Icon size={20} className={config.headerColor} />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className={`text-base font-semibold ${config.headerColor}`}>
              {title}
            </h3>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-200">
              {message}
            </p>
          </div>
        </div>
        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 rounded-md border border-studio-line bg-studio-panelSoft px-3 py-2 text-sm font-semibold text-slate-300 transition hover:border-slate-400 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`flex flex-1 items-center justify-center gap-2 rounded-md border ${config.borderColor} ${config.buttonColor} px-3 py-2 text-sm font-semibold text-white transition ${config.buttonHover} disabled:cursor-not-allowed disabled:opacity-60`}
          >
            {loading ? "Sedang diproses..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
