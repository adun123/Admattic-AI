import type React from "react";
import clsx from "clsx";

export function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-studio-line bg-slate-950/30 px-3 py-2">
      <p className="text-[10px] uppercase tracking-wider text-slate-500">{label}</p>
      <p className="mt-1 truncate text-xs font-medium text-slate-200">{value}</p>
    </div>
  );
}

export function NodeInput({
  label,
  value,
  onChange
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block rounded-md border border-studio-line bg-slate-950/30 px-3 py-2">
      <span className="text-[10px] uppercase tracking-wider text-slate-500">{label}</span>
      <input
        className="mt-1 w-full bg-transparent text-xs font-medium text-slate-100 outline-none"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

export function NodeTextArea({
  label,
  value,
  rows = 3,
  onChange
}: {
  label: string;
  value: string;
  rows?: number;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block rounded-md border border-studio-line bg-slate-950/30 px-3 py-2">
      <span className="text-[10px] uppercase tracking-wider text-slate-500">{label}</span>
      <textarea
        className="mt-1 w-full resize-none bg-transparent text-xs font-medium leading-5 text-slate-100 outline-none"
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

export function NodeSelect({
  label,
  value,
  options,
  onChange
}: {
  label: string;
  value: string;
  options: Array<{ label: string; value: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block rounded-md border border-studio-line bg-slate-950/30 px-3 py-2">
      <span className="text-[10px] uppercase tracking-wider text-slate-500">{label}</span>
      <select
        className="mt-1 w-full bg-transparent text-xs font-medium text-slate-100 outline-none"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="" className="bg-slate-950 text-slate-400">
          Select
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-slate-950 text-slate-100">
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function NodeActionButton({
  icon,
  label,
  onClick,
  primary,
  disabled
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  primary?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      className={clsx(
        "flex h-9 items-center justify-center gap-2 rounded-md border px-3 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
        primary
          ? "border-studio-cyan bg-studio-cyan text-slate-950 hover:bg-cyan-300"
          : "border-studio-line bg-studio-panelSoft text-slate-200 hover:border-studio-cyan/70"
      )}
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      {icon}
      {label}
    </button>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const label = status.replaceAll("_", " ");
  return (
    <span
      className={clsx(
        "rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide",
        status === "approved"
          ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
          : status === "generating"
            ? "border-amber-400/30 bg-amber-400/10 text-amber-200"
            : "border-studio-cyan/30 bg-studio-cyan/10 text-cyan-100"
      )}
    >
      {label}
    </span>
  );
}
