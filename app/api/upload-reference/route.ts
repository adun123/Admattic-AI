import { fal } from "@fal-ai/client";
import { NextResponse } from "next/server";

fal.config({
  credentials: process.env.FAL_KEY
});

function getReferenceAssetType(file: File) {
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";
  if (file.type.startsWith("audio/")) return "audio";
  return "file";
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No reference file was uploaded." }, { status: 400 });
    }

    if (file.type.startsWith("image/") && file.size > 8 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Reference images must be 8MB or smaller." },
        { status: 400 }
      );
    }

    const url = await fal.storage.upload(file);

    return NextResponse.json({
      asset: {
        id: `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`,
        name: file.name,
        type: getReferenceAssetType(file),
        url,
        purpose: file.type.startsWith("image/") ? "character" : "other"
      }
    });
  } catch (error) {
    console.error("Failed to upload reference", error);
    const apiError = error as {
      status?: number;
      message?: string;
    };

    return NextResponse.json(
      {
        error: "Failed to upload reference.",
        message: apiError.message ?? "fal storage upload failed."
      },
      { status: apiError.status ?? 500 }
    );
  }
}
