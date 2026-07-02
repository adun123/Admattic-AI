import { GoogleGenAI, Type } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

const supportedMimeTypes = new Set([
  "application/pdf",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation"
]);

const auditSchema = {
  type: Type.OBJECT,
  properties: {
    documentType: { type: Type.STRING },
    readiness: {
      type: Type.STRING,
      enum: ["ready", "partial", "needs_input"]
    },
    summary: { type: Type.STRING },
    extractedStory: { type: Type.STRING },
    detected: {
      type: Type.OBJECT,
      properties: {
        protagonist: { type: Type.STRING },
        tone: { type: Type.STRING },
        style: { type: Type.STRING },
        styleDirection: { type: Type.STRING },
        duration: { type: Type.INTEGER },
        aspectRatio: { type: Type.STRING },
        sceneCount: { type: Type.INTEGER }
      }
    },
    foundFields: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    missingFields: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    recommendation: { type: Type.STRING }
  },
  required: [
    "documentType",
    "readiness",
    "summary",
    "extractedStory",
    "detected",
    "foundFields",
    "missingFields",
    "recommendation"
  ]
};

type StoryFileAuditResponse = {
  documentType: string;
  readiness: "ready" | "partial" | "needs_input";
  summary: string;
  extractedStory: string;
  detected?: {
    protagonist?: string;
    tone?: string;
    style?: string;
    styleDirection?: string;
    duration?: number;
    aspectRatio?: string;
    sceneCount?: number;
  };
  foundFields: string[];
  missingFields: string[];
  recommendation: string;
};

function normalizeMimeType(file: File) {
  if (file.type) return file.type;
  const lowerName = file.name.toLowerCase();
  if (lowerName.endsWith(".pdf")) return "application/pdf";
  if (lowerName.endsWith(".ppt")) return "application/vnd.ms-powerpoint";
  if (lowerName.endsWith(".pptx")) {
    return "application/vnd.openxmlformats-officedocument.presentationml.presentation";
  }
  return "";
}

function normalizeAudit(audit: StoryFileAuditResponse): StoryFileAuditResponse {
  const detected = audit.detected ?? {};
  return {
    ...audit,
    summary: audit.summary?.trim() ?? "",
    extractedStory: audit.extractedStory?.trim() ?? "",
    detected: {
      protagonist: detected.protagonist?.trim() || undefined,
      tone: detected.tone?.trim() || undefined,
      style: detected.style?.trim() || undefined,
      styleDirection: detected.styleDirection?.trim() || undefined,
      duration:
        typeof detected.duration === "number" && detected.duration > 0
          ? detected.duration
          : undefined,
      aspectRatio: detected.aspectRatio?.trim() || undefined,
      sceneCount:
        typeof detected.sceneCount === "number" && detected.sceneCount > 0
          ? detected.sceneCount
          : undefined
    },
    foundFields: Array.isArray(audit.foundFields) ? audit.foundFields : [],
    missingFields: Array.isArray(audit.missingFields) ? audit.missingFields : []
  };
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No story file was uploaded." }, { status: 400 });
    }

    const mimeType = normalizeMimeType(file);

    if (!supportedMimeTypes.has(mimeType)) {
      return NextResponse.json(
        { error: "Only PDF, PPT, and PPTX story files are supported." },
        { status: 400 }
      );
    }

    if (file.size > 20 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Story files must be 20MB or smaller." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType,
                data: buffer.toString("base64")
              }
            },
            {
              text: [
                "Analyze this uploaded story/campaign document for an AI video production canvas.",
                "The file may be a pitch deck, storyboard, campaign proposal, script, brand guide, or mixed material.",
                "",
                "Return JSON only. Use Bahasa Indonesia for summary, extractedStory, fields, and recommendation.",
                "",
                "Decide readiness:",
                "- ready: enough information exists to generate scene nodes immediately.",
                "- partial: useful story exists, but user must complete a few creative direction fields.",
                "- needs_input: document is too incomplete or ambiguous; user must fill the story input form first.",
                "",
                "Audit these fields:",
                "story/storyline, scene breakdown, protagonist/main subject, visual style, duration, scene count, tone/mood, aspect ratio, CTA.",
                "",
                "If a field is clearly present, include it in foundFields. If absent or ambiguous, include it in missingFields.",
                "For detected values, only fill fields you can infer confidently from the document.",
                "extractedStory should be a concise production-ready story brief, not a raw full transcript."
              ].join("\n")
            }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: auditSchema
      }
    });

    if (!response.text) {
      throw new Error("Gemini returned an empty audit response.");
    }

    const audit = normalizeAudit(JSON.parse(response.text) as StoryFileAuditResponse);

    return NextResponse.json({
      file: {
        name: file.name,
        type: mimeType,
        size: file.size,
        analyzedAt: new Date().toISOString()
      },
      audit
    });
  } catch (error) {
    console.error("Failed to analyze story file", error);
    const apiError = error as {
      status?: number;
      code?: string | null;
      message?: string;
    };

    return NextResponse.json(
      {
        error: "Failed to analyze story file.",
        code: apiError.code ?? "unknown_error",
        message: apiError.message ?? "Gemini document analysis failed."
      },
      { status: apiError.status ?? 500 }
    );
  }
}
