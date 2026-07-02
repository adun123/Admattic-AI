import { useRef, useState } from "react";
import { Download, History, Sparkles, X } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import type { OutputNodeData } from "../types";

export type FinalRenderVersion = {
  id: string;
  url: string;
  size: number;
  createdAt: string;
  clipCount: number;
  aspectRatio: string;
  hasAudio: boolean;
  storagePath?: string;
  isStored?: boolean;
};

export function RenderFinalModal({
  timeline,
  aspectRatio,
  projectId,
  history,
  onHistoryChange,
  onClose
}: {
  timeline: OutputNodeData[];
  aspectRatio?: string;
  projectId: string | null;
  history: FinalRenderVersion[];
  onHistoryChange: (history: FinalRenderVersion[]) => void;
  onClose: () => void;
}) {
  const [status, setStatus] = useState<
    "idle" | "loading-ffmpeg" | "downloading" | "rendering" | "done" | "error"
  >("idle");
  const [progressLabel, setProgressLabel] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [renderProgress, setRenderProgress] = useState<number>(0);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const audioInputRef = useRef<HTMLInputElement | null>(null);

  const validClips = timeline.filter((clip) => clip.videoUrl);
  const previewAspectRatio =
    aspectRatio === "16:9" || aspectRatio === "9:16"
      ? aspectRatio
      : validClips[0]?.aspectRatio === "16:9"
        ? "16:9"
        : "9:16";
  const activeOutputUrl = outputUrl ?? history[0]?.url ?? null;

  const persistFinalRender = async ({
    blob,
    localUrl,
    finalAspectRatio
  }: {
    blob: Blob;
    localUrl: string;
    finalAspectRatio: string;
  }): Promise<FinalRenderVersion> => {
    const fallbackVersion: FinalRenderVersion = {
      id: `${Date.now()}-${history.length + 1}`,
      url: localUrl,
      size: blob.size,
      createdAt: new Date().toISOString(),
      clipCount: validClips.length,
      aspectRatio: finalAspectRatio,
      hasAudio: Boolean(audioFile),
      isStored: false
    };

    if (!projectId) return fallbackVersion;

    try {
      const storagePath = `${projectId}/${Date.now()}-final-video.mp4`;
      const { error: uploadError } = await supabase.storage
        .from("final-renders")
        .upload(storagePath, blob, {
          contentType: "video/mp4",
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("final-renders")
        .getPublicUrl(storagePath);
      const publicUrl = publicUrlData.publicUrl;

      const { data, error: insertError } = await supabase
        .from("final_renders")
        .insert({
          project_id: projectId,
          storage_path: storagePath,
          public_url: publicUrl,
          aspect_ratio: finalAspectRatio,
          clip_count: validClips.length,
          file_size_bytes: blob.size,
          has_audio: Boolean(audioFile)
        })
        .select("id,created_at")
        .single();

      if (insertError) throw insertError;

      return {
        ...fallbackVersion,
        id: String(data.id),
        url: publicUrl,
        createdAt: String(data.created_at),
        storagePath,
        isStored: true
      };
    } catch (error) {
      console.error("Failed to persist final render to Supabase", error);
      return fallbackVersion;
    }
  };

  const statusLabel =
    status === "idle"
      ? "Siap render"
      : status === "loading-ffmpeg"
        ? "Memuat engine..."
        : status === "downloading"
          ? "Mengunduh video..."
          : status === "rendering"
            ? "Menggabungkan video..."
            : status === "done"
              ? "Selesai"
              : "Gagal";

  const render = async () => {
    if (validClips.length === 0) return;
    const FFmpegModule = await import("@ffmpeg/ffmpeg");
    const UtilModule = await import("@ffmpeg/util");

    const ffmpegInstance = new FFmpegModule.FFmpeg();
    ffmpegInstance.on("log", (message: { message: string }) => {
      console.log("[ffmpeg]", message.message);
    });
    ffmpegInstance.on("progress", ({ progress }: { progress: number }) => {
      if (!Number.isFinite(progress)) return;
      setRenderProgress(Math.max(0, Math.min(100, Math.round(progress * 100))));
    });

    try {
      setErrorMessage(null);
      setOutputUrl(null);
      setRenderProgress(0);
      setStatus("loading-ffmpeg");
      setProgressLabel("Memuat engine FFmpeg...");
      const baseUrl = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
      await ffmpegInstance.load({
        coreURL: await UtilModule.toBlobURL(`${baseUrl}/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await UtilModule.toBlobURL(`${baseUrl}/ffmpeg-core.wasm`, "application/wasm")
      });

      setStatus("downloading");
      setProgressLabel(`Mengunduh ${validClips.length} video...`);
      for (let i = 0; i < validClips.length; i++) {
        const data = await UtilModule.fetchFile(validClips[i].videoUrl);
        await ffmpegInstance.writeFile(`input${i}.mp4`, data);
      }
      if (audioFile) {
        setProgressLabel("Mengunggah musik BGM...");
        await ffmpegInstance.writeFile("bgm.mp3", await UtilModule.fetchFile(audioFile));
      }

      setStatus("rendering");
      setProgressLabel("Menyiapkan canvas final...");
      const finalAspectRatio =
        previewAspectRatio === "16:9" ? "16:9" : "9:16";
      const [outWidth, outHeight] =
        finalAspectRatio === "16:9" ? [1920, 1080] : [1080, 1920];
      const normalizedVideoFilters = validClips
        .map(
          (_, i) =>
            `[${i}:v]scale=${outWidth}:${outHeight}:force_original_aspect_ratio=decrease,` +
            `pad=${outWidth}:${outHeight}:(ow-iw)/2:(oh-ih)/2:color=black,` +
            `setsar=1,fps=30,format=yuv420p[v${i}]`
        )
        .join(";");
      const concatInputs = validClips.map((_, i) => `[v${i}]`).join("");
      const filterComplex = `${normalizedVideoFilters};${concatInputs}concat=n=${validClips.length}:v=1:a=0[vout]`;

      const execArgs = audioFile
        ? [
            ...validClips.flatMap((_, i) => ["-i", `input${i}.mp4`]),
            "-i",
            "bgm.mp3",
            "-filter_complex",
            filterComplex,
            "-map",
            "[vout]",
            "-map",
            `${validClips.length}:a:0`,
            "-c:v",
            "libx264",
            "-preset",
            "ultrafast",
            "-crf",
            "23",
            "-c:a",
            "aac",
            "-b:a",
            "128k",
            "-shortest",
            "-movflags",
            "+faststart",
            "-y",
            "output.mp4"
          ]
        : [
            ...validClips.flatMap((_, i) => ["-i", `input${i}.mp4`]),
            "-filter_complex",
            filterComplex,
            "-map",
            "[vout]",
            "-c:v",
            "libx264",
            "-preset",
            "ultrafast",
            "-crf",
            "23",
            "-movflags",
            "+faststart",
            "-y",
            "output.mp4"
          ];
      setProgressLabel("Merender final MP4...");
      await ffmpegInstance.exec(execArgs);

      const outputData = (await ffmpegInstance.readFile("output.mp4")) as Uint8Array;
      const blob = new Blob([outputData.buffer as ArrayBuffer], { type: "video/mp4" });
      const url = URL.createObjectURL(blob);
      setProgressLabel("Menyimpan riwayat final render...");
      const version = await persistFinalRender({
        blob,
        localUrl: url,
        finalAspectRatio
      });
      setOutputUrl(version.url);
      onHistoryChange([version, ...history]);
      setStatus("done");
      setRenderProgress(100);
      setProgressLabel(`Final MP4 siap diunduh (${(blob.size / (1024 * 1024)).toFixed(1)} MB)`);
    } catch (caught) {
      const errMsg = caught instanceof Error ? caught.message : String(caught);
      setErrorMessage(errMsg);
      setStatus("error");
      setProgressLabel("Render gagal");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-y-auto rounded-lg border border-studio-line bg-studio-panel text-slate-100 shadow-2xl">
        <div className="flex items-start justify-between">
          <div className="p-5 pb-4">
            <h2 className="flex items-center gap-2 text-base font-semibold">
              <Sparkles size={18} className="text-studio-blue" />
              Render Final MP4
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Menggabungkan {validClips.length} scene yang sudah di-approve jadi 1 file MP4.
              Render dilakukan di browser .
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="m-5 grid h-8 w-8 place-items-center rounded-md border border-studio-line text-slate-300 hover:border-red-400/60 hover:text-red-200"
            title="Close"
          >
            <X size={15} />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 border-t border-studio-line p-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section className="flex flex-col gap-4">
            <div className="flex min-h-[360px] items-center justify-center rounded-md border border-studio-line bg-slate-950/50 p-4">
              {activeOutputUrl ? (
                <video
                  className="max-w-full rounded-md border border-studio-line bg-black object-contain"
                  style={{
                    aspectRatio: previewAspectRatio === "16:9" ? "16 / 9" : "9 / 16",
                    width: previewAspectRatio === "16:9" ? "min(100%, 680px)" : "auto",
                    height: previewAspectRatio === "16:9" ? "auto" : "min(52vh, 440px)",
                    maxHeight: "52vh"
                  }}
                  controls
                  src={activeOutputUrl}
                />
              ) : (
                <div className="flex flex-col items-center gap-3 text-center text-slate-500">
                  <Sparkles size={26} className="text-slate-600" />
                  <div>
                    <p className="text-sm font-semibold text-slate-300">Belum ada final render</p>
                    <p className="mt-1 text-xs">Klik Mulai render untuk membuat MP4 final.</p>
                  </div>
                </div>
              )}
            </div>
            {activeOutputUrl ? (
              <a
                href={activeOutputUrl}
                download="final-video.mp4"
                className="flex w-full items-center justify-center gap-2 rounded-md border border-studio-cyan bg-studio-cyan px-3 py-2 text-xs font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                <Download size={14} />
                Download final-video.mp4
              </a>
            ) : null}
          </section>

          <aside className="flex flex-col gap-3">
            <div className="rounded-md border border-studio-line bg-slate-950/40 p-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Approved scenes
              </p>
              <div className="mt-2 max-h-32 space-y-1.5 overflow-auto">
                {validClips.map((clip, index) => (
                  <div
                    key={`${clip.sceneId}-${index}`}
                    className="rounded-md border border-emerald-400/25 bg-emerald-400/5 px-2.5 py-1.5"
                  >
                    <p className="truncate text-xs font-semibold text-emerald-100">
                      {index + 1}. {clip.sceneTitle}
                    </p>
                  </div>
                ))}
                {validClips.length === 0 ? (
                  <p className="text-xs text-slate-500">Belum ada scene yang sudah di-approve.</p>
                ) : null}
              </div>
            </div>

            <div className="rounded-md border border-studio-line bg-slate-950/40 p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-200">Musik BGM</p>
                  <p className="mt-0.5 truncate text-[10px] text-slate-500">
                    {audioFile ? audioFile.name : "Opsional"}
                  </p>
                </div>
                <input
                  ref={audioInputRef}
                  type="file"
                  accept="audio/*"
                  className="hidden"
                  onChange={(event) => setAudioFile(event.target.files?.[0] ?? null)}
                />
                <button
                  type="button"
                  onClick={() => audioInputRef.current?.click()}
                  className="shrink-0 rounded-md border border-studio-line px-2.5 py-1 text-xs text-slate-300 hover:border-studio-cyan/70"
                >
                  Upload
                </button>
              </div>
              {audioFile ? (
                <button
                  type="button"
                  onClick={() => setAudioFile(null)}
                  className="mt-2 text-[10px] text-red-300 hover:underline"
                >
                  Hapus musik
                </button>
              ) : null}
            </div>

            <div className="rounded-md border border-studio-line bg-slate-950/40 p-3">
              <p className="text-xs font-semibold text-slate-200">{statusLabel}</p>
              <p className="mt-1 min-h-4 text-[10px] text-slate-500">{progressLabel}</p>
              {status === "loading-ffmpeg" || status === "downloading" || status === "rendering" ? (
                <div className="mt-3 space-y-1.5">
                  <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-studio-cyan transition-all"
                      style={{
                        width: `${status === "rendering" ? renderProgress : status === "downloading" ? 25 : 8}%`
                      }}
                    />
                  </div>
                  <p className="text-right text-[10px] text-slate-500">
                    {status === "rendering" ? `${renderProgress}%` : "Preparing"}
                  </p>
                </div>
              ) : null}
            </div>

            {errorMessage ? (
              <div className="rounded-md border border-red-400/40 bg-red-950/40 p-3 text-xs text-red-200">
                Error: {errorMessage}
              </div>
            ) : null}

            {history.length > 0 ? (
              <div className="min-h-0 flex-1 space-y-2 rounded-md border border-studio-line bg-slate-950/40 p-3">
                <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  <History size={12} />
                  Render history
                </div>
              <div className="max-h-44 space-y-1.5 overflow-auto">
                  {history.map((item, index) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-2 rounded-md border border-studio-line bg-studio-panelSoft px-2 py-1.5"
                    >
                      <button
                        type="button"
                        onClick={() => setOutputUrl(item.url)}
                        className="min-w-0 flex-1 text-left"
                        title="Preview render ini"
                      >
                        <p className="truncate text-xs font-semibold text-slate-200">
                          Render {history.length - index} / {item.aspectRatio}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          {item.clipCount} scene, {(item.size / (1024 * 1024)).toFixed(1)} MB
                          {item.hasAudio ? ", BGM" : ""}
                          {item.isStored ? ", Supabase" : ", local"}
                        </p>
                      </button>
                      <a
                        href={item.url}
                        download={`final-video-v${history.length - index}.mp4`}
                        className="grid h-7 w-7 shrink-0 place-items-center rounded border border-studio-line text-slate-300 hover:border-studio-cyan/70 hover:text-studio-cyan"
                        title="Download render ini"
                      >
                        <Download size={13} />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </aside>
        </div>

        <div className="flex gap-2 border-t border-studio-line p-5 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-md border border-studio-line px-3 py-2 text-xs font-semibold text-slate-300 hover:border-slate-400"
            >
              {status === "done" ? "Tutup" : "Batal"}
            </button>
            {status === "idle" || status === "error" ? (
              <button
                type="button"
                onClick={render}
                disabled={validClips.length === 0}
                className="flex flex-1 items-center justify-center gap-2 rounded-md border border-studio-cyan bg-studio-cyan px-3 py-2 text-xs font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Sparkles size={14} />
                {status === "error" ? "Coba ulang" : "Mulai render"}
              </button>
            ) : null}
        </div>
      </div>
    </div>
  );
}
