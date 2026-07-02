import { GoogleGenAI, Type } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

const sceneSchema = {
  type: Type.OBJECT,
  properties: {
    scenes: {
      type: Type.ARRAY,
      minItems: 4,
      maxItems: 8,
      items: {
        type: Type.OBJECT,
        properties: {
          sceneNumber: { type: Type.INTEGER },
          title: { type: Type.STRING },
          duration: { type: Type.INTEGER },
          narration: { type: Type.STRING },
          visualDescription: { type: Type.STRING },
          cameraDirection: { type: Type.STRING },
          mood: { type: Type.STRING },
          prompt: { type: Type.STRING }
        },
        required: [
          "sceneNumber",
          "title",
          "duration",
          "narration",
          "visualDescription",
          "cameraDirection",
          "mood",
          "prompt"
        ]
      }
    }
  },
  required: ["scenes"]
};

type GeneratedStructure = {
  scenes: Array<{
    sceneNumber: number;
    title: string;
    duration: number;
    narration: string;
    visualDescription: string;
    cameraDirection: string;
    mood: string;
    prompt: string;
  }>;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      story?: string;
      protagonist?: string;
      referenceAssets?: Array<{
        name: string;
        type: string;
        url: string;
        purpose: string;
      }>;
      tone?: string;
      style?: string;
      styleDirection?: string;
      duration?: number;
      aspectRatio?: string;
      sceneCount?: number;
    };

    if (!body.story || body.story.trim().length < 20) {
      return NextResponse.json(
        { error: "Story is too short to generate a useful scene structure." },
        { status: 400 }
      );
    }

    const tone = body.tone ?? "Emotional";
    const style = body.style ?? "Cinematic Corporate";
    const styleDirection = body.styleDirection?.trim() || "Ikuti visual style preset secara konsisten.";
    const duration = body.duration ?? 60;
    const aspectRatio = body.aspectRatio ?? "9:16";
    const sceneCount = Math.max(4, Math.min(8, body.sceneCount ?? 6));
    const protagonist =
      body.protagonist?.trim() ||
      "tokoh utama yang sama dari cerita; jangan mengubah gender, usia, profesi, atau identitas visual antar scene";
    const referenceAssets = body.referenceAssets ?? [];
    const hasReferenceAssets = referenceAssets.length > 0;
    const referenceSummary =
      hasReferenceAssets
        ? "\n".concat(
            referenceAssets
              .map(
                (asset, index) =>
                  `${index + 1}. ${asset.name} (${asset.purpose}/${asset.type}) ${asset.url}`
              )
              .join("\n")
          )
          .concat(
            "\n\nIMPORTANT: Reference images already carry the main character's visual identity. " +
              "In every scene prompt, do NOT repeat explicit identity descriptors (age, gender, ethnicity, " +
              "name, profession). Instead write short cues like 'tokoh utama pada referensi' or simply " +
              "describe the setting, action, mood, and camera. The face/identity will come from the reference image.",
            ""
          )
        : "Tidak ada reference asset.";

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        "You are a senior creative director for short-form corporate video.",
        "Return production-ready scene breakdowns in Indonesian.",
        "All returned fields, including the prompt field, must use Bahasa Indonesia.",
        "",
        `Story: ${body.story}`,
        `Main character continuity anchor: ${protagonist}`,
        `Reference assets:\n${referenceSummary}`,
        `Tone: ${tone}`,
        `Visual style: ${style}`,
        `Manual art direction: ${styleDirection}`,
        `Total duration target: ${duration} seconds`,
        `Aspect ratio: ${aspectRatio}`,
        "",
        `Create exactly ${sceneCount} scenes. The sum of scene durations should be close to the total duration.`,
        "If the story is written in first person, treat the narrator as the same main character across all scenes.",
        hasReferenceAssets
          ? [
              "REFERENCE MODE:",
              "The uploaded reference image is the source of truth for the main character's face and visual identity.",
              "Every visualDescription and prompt must refer to the same person as 'tokoh utama dari gambar referensi'.",
              "Do not invent a different face, age, body type, ethnicity, celebrity, public figure, or named real person.",
              "Do not describe facial identity in detail; keep identity cues generic and let the reference image carry the face."
            ].join("\n")
          : [
              "NO-REFERENCE MODE:",
              `Use this exact character continuity anchor in every scene: ${protagonist}.`,
              "Every visualDescription and prompt must preserve the same character identity, wardrobe direction, role, and overall look.",
              "Do not introduce a different protagonist, duplicate protagonist, or change the character's apparent age/persona between scenes."
            ].join("\n"),
        "Keep the selected tone, visual style, and aspect ratio consistent across every scene.",
        "If manual art direction is provided, it overrides generic realism and must appear consistently in every scene.",
        "Every prompt must explicitly preserve the selected tone and visual style.",
        "Keep narration concise and emotional. Prompts must be specific, cinematic, realistic, and safe for commercial production."
      ].join("\n"),
      config: {
        responseMimeType: "application/json",
        responseSchema: sceneSchema
      }
    });

    if (!response.text) {
      throw new Error("Gemini returned an empty response.");
    }

    const parsed = JSON.parse(response.text) as GeneratedStructure;

    return NextResponse.json({
      scenes: parsed.scenes.map((scene, index) => ({
        kind: "scene",
        sceneNumber: index + 1,
        title: scene.title,
        duration: scene.duration,
        narration: scene.narration,
        visualDescription: scene.visualDescription,
        cameraDirection: scene.cameraDirection,
        mood: scene.mood,
        prompt: scene.prompt,
        status: "prompt_ready"
      }))
    });
  } catch (error) {
    console.error("Failed to generate structure", error);
    const apiError = error as {
      status?: number;
      code?: string | null;
      message?: string;
    };

    return NextResponse.json(
      {
        error: "Failed to generate scene structure.",
        code: apiError.code ?? "unknown_error",
        message: apiError.message ?? "Gemini request failed."
      },
      { status: apiError.status ?? 500 }
    );
  }
}
