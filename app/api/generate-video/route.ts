import { fal } from "@fal-ai/client";
import { NextResponse } from "next/server";

type VideoProvider = "veo3.1-fast" | "veo3.1-fast-reference" | "seedance-2.0-fast";

const COST_PER_VIDEO: Record<VideoProvider, number> = {
  "veo3.1-fast": 7.2,
  "veo3.1-fast-reference": 2.4,
  "seedance-2.0-fast": 0
};

type FalVideoResult = {
  video?: {
    url?: string;
    file_name?: string;
    content_type?: string;
  };
  video_url?: string;
  url?: string;
};

function serializeFalErrorBody(body: unknown) {
  if (!body) return null;

  try {
    return JSON.parse(JSON.stringify(body));
  } catch {
    return String(body);
  }
}

function getFalErrorType(body: unknown): string | undefined {
  if (!body || typeof body !== "object") return undefined;
  const detail = (body as { detail?: Array<{ type?: string }> }).detail;
  if (!Array.isArray(detail)) return undefined;
  for (const item of detail) {
    if (item && typeof item.type === "string") return item.type;
  }
  return undefined;
}

function isFalHosted(url: string) {
  return (
    url.includes("fal.run") ||
    url.includes("fal.media") ||
    url.includes("fal.ai") ||
    url.includes("v3.fal.run")
  );
}

async function ensureFalHostedImageUrls(urls: string[]): Promise<string[]> {
  const result: string[] = [];
  for (const url of urls) {
    if (isFalHosted(url)) {
      result.push(url);
      continue;
    }
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const blob = await response.blob();
      const fileName = url.split("?").shift()?.split("/").pop() ?? "reference.jpg";
      const file = new File([blob], fileName, {
        type: blob.type || "image/jpeg"
      });
      const falUrl = await fal.storage.upload(file);
      result.push(falUrl);
    } catch (error) {
      console.error("Failed to re-host reference image", url, error);
      throw new Error(
        `Reference image is not accessible: ${url}. ` +
        "Make sure the image is publicly available or re-upload it through the reference panel."
      );
    }
  }
  return result;
}

const providerConfig: Record<
  VideoProvider,
  {
    endpoint: string;
    label: string;
    input: (params: {
      prompt: string;
      aspectRatio: string;
      resolution: string;
      durationSeconds: number;
      generateAudio: boolean;
      imageUrls: string[];
    }) => Record<string, unknown>;
  }
> = {
  "veo3.1-fast": {
    endpoint: "fal-ai/veo3.1/fast",
    label: "Veo 3.1 Fast",
    input: ({ prompt, aspectRatio, resolution, durationSeconds, generateAudio }) => ({
      prompt,
      aspect_ratio: aspectRatio === "16:9" ? "16:9" : "9:16",
      duration: durationSeconds <= 4 ? "4s" : durationSeconds <= 6 ? "6s" : "8s",
      resolution: resolution === "4K" ? "4k" : ["720p", "1080p"].includes(resolution) ? resolution : "720p",
      generate_audio: generateAudio,
      auto_fix: true,
      safety_tolerance: "4"
    })
  },
  "veo3.1-fast-reference": {
    endpoint: "fal-ai/veo3.1/fast/reference-to-video",
    label: "Veo 3.1 Fast Reference",
    input: ({ prompt, aspectRatio, resolution, durationSeconds, generateAudio, imageUrls }) => ({
      prompt,
      image_urls: imageUrls,
      aspect_ratio: aspectRatio === "16:9" ? "16:9" : "9:16",
      duration: "8s",
      resolution: resolution === "1080p" || resolution === "4K" ? "1080p" : "720p",
      generate_audio: generateAudio,
      auto_fix: true,
      safety_tolerance: "4"
    })
  },
  "seedance-2.0-fast": {
    endpoint: "bytedance/seedance-2.0/fast/text-to-video",
    label: "Seedance 2.0 Fast",
    input: ({ prompt, aspectRatio, resolution, durationSeconds, generateAudio }) => ({
      prompt,
      aspect_ratio: aspectRatio,
      duration: Math.max(4, Math.min(15, durationSeconds)),
      resolution: resolution === "480p" ? "480p" : "720p",
      generate_audio: generateAudio
    })
  }
};

fal.config({
  credentials: process.env.FAL_KEY
});

function getVideoUrl(data: FalVideoResult) {
  return data.video?.url ?? data.video_url ?? data.url;
}

function getDuration(durationSeconds: number) {
  return durationSeconds <= 4 ? "4s" : durationSeconds <= 6 ? "6s" : "8s";
}

function getVeoResolution(resolution: string, allow4k = true) {
  if (allow4k && resolution === "4K") return "4k";
  if (resolution === "1080p" || resolution === "4K") return "1080p";
  return "720p";
}

function buildReferenceSafePrompt(prompt: string) {
  const cleanedPrompt = prompt
    .replace(/\([^)]*(referensi|reference)[^)]*\)/gi, "")
    .replace(/tokoh utama pada referensi/gi, "karakter utama")
    .replace(/pada referensi/gi, "")
    .replace(/reference image/gi, "reference")
    .replace(/versi dirinya yang lebih muda/gi, "karakter dewasa yang sama")
    .replace(/lebih muda/gi, "dewasa dan konsisten")
    .replace(/pak\s*joko/gi, "karakter utama")
    .replace(/jokowi/gi, "karakter utama")
    .replace(/presiden/gi, "pemimpin")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 900);

  return [
    "A safe fictional brand-film scene using the uploaded reference images only as visual inspiration for a consistent adult main character.",
    cleanedPrompt,
    "Keep the character generic and fictional. Do not portray a real public figure, political figure, celebrity, or named person.",
    "Do not change the character's age or identity. Use cinematic lighting, gentle motion, and a clean commercial tone."
  ].join(" ");
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      prompt?: string;
      aspectRatio?: string;
      resolution?: string;
      durationSeconds?: number;
      provider?: VideoProvider;
      generateAudio?: boolean;
      referenceImageUrls?: string[];
    };

    if (!body.prompt || body.prompt.trim().length < 20) {
      return NextResponse.json(
        { error: "Prompt is too short to generate video." },
        { status: 400 }
      );
    }

    const provider = body.provider ?? "veo3.1-fast";
    const selected = providerConfig[provider];
    const durationSeconds = body.durationSeconds ?? 4;
    const generateAudio = body.generateAudio ?? true;
    const imageUrls = body.referenceImageUrls ?? [];

    if (provider === "veo3.1-fast-reference" && imageUrls.length === 0) {
      return NextResponse.json(
        { error: "Reference-to-video requires at least one reference image URL." },
        { status: 400 }
      );
    }

    const falHostedImageUrls =
      imageUrls.length > 0 ? await ensureFalHostedImageUrls(imageUrls) : imageUrls;

    const prompt =
      provider === "veo3.1-fast-reference"
        ? buildReferenceSafePrompt(body.prompt)
        : body.prompt;

    const input = selected.input({
      prompt,
      aspectRatio: body.aspectRatio ?? "9:16",
      resolution: body.resolution ?? "720p",
      durationSeconds,
      generateAudio,
      imageUrls: falHostedImageUrls
    });

    let result;
    try {
      result = await fal.subscribe(selected.endpoint, {
        input,
        logs: true
      });
    } catch (error) {
      const apiError = error as { status?: number; body?: unknown };
      const details = serializeFalErrorBody(apiError.body);
      const falErrorType = getFalErrorType(apiError.body);

      if (falErrorType === "content_policy_violation") {
        return NextResponse.json(
          {
            error: "Content policy violation.",
            code: "content_policy_violation",
            message: "Model AI rejected this prompt or reference image due to content policy.",
            details
          },
          { status: 422 }
        );
      }

      if (falErrorType === "no_media_generated") {
        return NextResponse.json(
          {
            error: "AI model rejected the reference-to-video request.",
            code: "no_media_generated",
            message:
              "AI model refused to generate video from this reference + prompt combination. " +
              "Try removing the reference face, using a different image, or simplifying the prompt to avoid specific identity details.",
            details
          },
          { status: 422 }
        );
      }

      throw error;
    }

    const data = result.data as FalVideoResult;
    const videoUrl = getVideoUrl(data);

    if (!videoUrl) {
      return NextResponse.json(
        {
          error: "Video generation completed but no video URL was returned.",
          provider: selected.label,
          raw: data
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      videoUrl,
      provider: selected.label,
      requestId: result.requestId,
      estimatedCost: COST_PER_VIDEO[provider] ?? 0,
      raw: data
    });
  } catch (error) {
    console.error("Failed to generate video", error);
    const apiError = error as {
      status?: number;
      code?: string | null;
      message?: string;
      body?: unknown;
    };
    const details = serializeFalErrorBody(apiError.body);
    if (details) {
      console.error("fal validation details", details);
    }

    return NextResponse.json(
      {
        error: "Failed to generate video.",
        code: apiError.code ?? "unknown_error",
        message: apiError.message ?? "fal request failed.",
        details
      },
      { status: apiError.status ?? 500 }
    );
  }
}
