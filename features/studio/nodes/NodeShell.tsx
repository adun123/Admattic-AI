import type React from "react";
import clsx from "clsx";

export function NodeShell({
  children,
  selected,
  accent = "cyan"
}: {
  children: React.ReactNode;
  selected?: boolean;
  accent?: "cyan" | "violet" | "blue";
}) {
  return (
    <div
      className={clsx(
        "w-[320px] rounded-lg border bg-studio-panel/95 shadow-glow backdrop-blur",
        selected ? "border-studio-cyan" : "border-studio-line",
        accent === "violet" && "shadow-[0_0_34px_rgba(139,92,246,0.13)]",
        accent === "blue" && "shadow-[0_0_34px_rgba(79,124,255,0.13)]"
      )}
    >
      {children}
    </div>
  );
}
