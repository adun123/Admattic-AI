import { useRef, useState } from "react";
import { Download, Sparkles, X } from "lucide-react";
import type { OutputNodeData } from "../types";

export function RenderFinalModal({
  timeline,
  onClose
}: {
  timeline: OutputNodeData[];
  onClose: () => void;
}) {
  const [status, setStatus] = useState<
    "idle" | "loading-ffmpeg" | "downloading" | "rendering" | "done" | "error"
  >("idle");
  const [progressLabel, setProgressLabel] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const audioInputRef = useRef<HTMLInputElement | null>(null);

  const validClips = timeline.filter((clip) => clip.videoUrl);

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

    try {
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
      setProgressLabel("Menyiapkan daftar scene...");
      const concatList = validClips
        .map((_, i) => `file 'input${i}.mp4'`)
        .join("\n");
      await ffmpegInstance.writeFile(
        "list.txt",
        new TextEncoder().encode(concatList)
      );

      const aspectRatio = validClips[0]?.aspectRatio === "16:9" ? "16:9" : "9:16";
      const [outWidth, outHeight] =
        aspectRatio === "16:9" ? [1920, 1080] : [1080, 1920];
      const videoFilter = [
        `scale=${outWidth}:${outHeight}:force_original_aspect_ratio=decrease`,
        `pad=${outWidth}:${outHeight}:(ow-iw)/2:(oh-ih)/2:color=black`,
        "setsar=1"
      ].join(",");

      const execArgs = audioFile
        ? [
            "-f",
            "concat",
            "-safe",
            "0",
            "-i",
            "list.txt",
            "-i",
            "bgm.mp3",
            "-vf",
            videoFilter,
            "-map",
            "0:v:0",
            "-map",
            "1:a:0",
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
            "-f",
            "concat",
            "-safe",
            "0",
            "-i",
            "list.txt",
            "-vf",
            videoFilter,
            "-map",
            "0:v:0",
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
      setOutputUrl(url);
      setStatus("done");
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
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col gap-4 rounded-xl border border-studio-line bg-studio-panel p-6 text-slate-100 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-base font-semibold">
              <Sparkles size={18} className="text-studio-blue" />
              Render Final MP4
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Menggabungkan {validClips.length} scene yang sudah di-approve jadi 1 file MP4.
              Render dilakukan di browser (no API cost).
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-md border border-studio-line text-slate-300 hover:border-red-400/60 hover:text-red-200"
            title="Close"
          >
            <X size={15} />
          </button>
        </div>

        <div className="max-h-52 space-y-2 overflow-auto rounded-md border border-studio-line bg-slate-950/40 p-3">
          {validClips.map((clip, index) => (
            <div
              key={`${clip.sceneId}-${index}`}
              className="flex items-center justify-between rounded-md border border-emerald-400/25 bg-emerald-400/5 px-3 py-1.5"
            >
              <span className="truncate text-xs font-semibold text-emerald-100">
                {index + 1}. {clip.sceneTitle}
              </span>
              <span className="text-[10px] text-emerald-200/70">{clip.provider}</span>
            </div>
          ))}
          {validClips.length === 0 ? (
            <p className="text-xs text-slate-500">Belum ada scene yang sudah di-approve.</p>
          ) : null}
        </div>

        <div className="rounded-md border border-studio-line bg-slate-950/40 p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-200">Musik BGM (opsional)</p>
              <p className="mt-0.5 text-[10px] text-slate-500">
                Upload file audio untuk dijadikan background music.
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
              className="rounded-md border border-studio-line px-2.5 py-1 text-xs text-slate-300 hover:border-studio-cyan/70"
            >
              {audioFile ? audioFile.name.slice(0, 24) : "Upload audio"}
            </button>
          </div>
          {audioFile ? (
            <button
              type="button"
              onClick={() => setAudioFile(null)}
              className="mt-1 text-[10px] text-red-300 hover:underline"
            >
              Hapus musik
            </button>
          ) : null}
        </div>

        <div className="flex items-center justify-between">
          <div className="text-xs">
            <p className="font-semibold text-slate-200">{statusLabel}</p>
            <p className="text-slate-500">{progressLabel}</p>
          </div>
        </div>

        {errorMessage ? (
          <div className="rounded-md border border-red-400/40 bg-red-950/40 p-3 text-xs text-red-200">
            Error: {errorMessage}
          </div>
        ) : null}

        {status === "done" && outputUrl ? (
          <div className="rounded-md border border-emerald-400/30 bg-emerald-400/10 p-3">
            <video
              className="mb-2 max-h-48 w-full rounded border border-studio-line bg-slate-950 object-cover"
              controls
              src={outputUrl}
            />
            <a
              href={outputUrl}
              download="final-video.mp4"
              className="flex w-full items-center justify-center gap-2 rounded-md border border-studio-cyan bg-studio-cyan px-3 py-2 text-xs font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              <Download size={14} />
              Download final-video.mp4
            </a>
          </div>
        ) : null}

        <div className="flex gap-2">
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
