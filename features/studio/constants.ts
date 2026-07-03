import type { Edge } from "@xyflow/react";
import type { StudioNode } from "./types";

export const emptyStory = "";
export const currentWorkspaceKey = "campaign-video-ai:current-workspace";
export const historyWorkspaceKey = "campaign-video-ai:workspace-history";
export const COST_STORAGE_KEY = "campaign-video-ai:cost-log";

export const toneOptions = [
  "Emotional",
  "Inspirational",
  "Professional",
  "Energetic",
  "Luxury",
  "Documentary",
  "Friendly",
  "Dramatic"
];

export const styleOptions = [
  "Cinematic Corporate",
  "Documentary Brand Film",
  "Luxury Brand Film",
  "Social Media Ad",
  "Product Showcase",
  "Event Recap",
  "Wax Figure Animation",
  "LEGO-style Miniature",
  "Clay Stop Motion",
  "Paper Cutout Animation",
  "3D Animated Character",
  "Isometric Miniature"
];

export const durationOptions = [8, 15, 30, 45, 60, 90, 120];

export const aspectRatioOptions = ["9:16", "16:9"];

export const sceneCountOptions = [1, 2, 3, 4, 5, 6, 7, 8];

export const renderQualityOptions = ["720p", "1080p", "4K"];

export const initialNodes: StudioNode[] = [
  {
    id: "story-input",
    type: "story",
    position: { x: 80, y: 140 },
    data: {
      kind: "story",
      story: emptyStory,
      protagonist: "",
      referenceAssets: [],
      tone: "",
      style: "",
      styleDirection: "",
      duration: 0,
      aspectRatio: "",
      sceneCount: 0,
      renderQuality: ""
    }
  }
];

export const initialEdges: Edge[] = [];
