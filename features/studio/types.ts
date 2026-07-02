import type { Edge, Node } from "@xyflow/react";

export type StoryNodeData = {
  kind: "story";
  story: string;
  protagonist: string;
  referenceAssets: ReferenceAsset[];
  storyFile?: StoryFileSummary;
  documentAudit?: StoryDocumentAudit;
  tone: string;
  style: string;
  styleDirection: string;
  duration: number;
  aspectRatio: string;
  sceneCount: number;
  renderQuality: string;
  isGeneratingStructure?: boolean;
  isAnalyzingStoryFile?: boolean;
  onGenerateStructure?: () => void;
  onAddReference?: (file: File) => Promise<void>;
  onAnalyzeStoryFile?: (file: File) => Promise<void>;
  onUpdate?: (patch: Partial<StoryNodeData>) => void;
};

export type StoryFileSummary = {
  name: string;
  type: string;
  size: number;
  analyzedAt: string;
};

export type StoryAuditReadiness = "ready" | "partial" | "needs_input";

export type StoryDocumentAudit = {
  documentType: string;
  readiness: StoryAuditReadiness;
  summary: string;
  foundFields: string[];
  missingFields: string[];
  recommendation: string;
};

export type ReferenceAsset = {
  id: string;
  name: string;
  type: "image" | "video" | "audio" | "file";
  url: string;
  purpose: "character" | "style" | "other";
};

export type SceneNodeData = {
  kind: "scene";
  sceneNumber: number;
  title: string;
  duration: number;
  narration: string;
  visualDescription: string;
  cameraDirection: string;
  mood: string;
  prompt: string;
  status: "prompt_ready" | "generating" | "generated" | "approved";
  isGeneratingVideo?: boolean;
  onGenerateVideo?: () => void;
  onUpdate?: (patch: Partial<SceneNodeData>) => void;
};

export type VideoVersion = {
  videoUrl: string;
  provider: string;
  createdAt: string;
};

export type OutputNodeData = {
  kind: "output";
  sceneId: string;
  sceneTitle: string;
  videoUrl: string;
  provider: string;
  status: "ready" | "approved";
  createdAt?: string;
  aspectRatio?: string;
  versions?: VideoVersion[];
  onApprove?: () => void;
  onRetry?: () => void;
};

export type FinalClip = {
  sceneId: string;
  sceneTitle: string;
  duration: number;
};

export type FinalAssemblyNodeData = {
  kind: "final";
  clips: FinalClip[];
  transitionStyle: string;
  musicDirection: string;
  voiceOverScript: string;
  soundNotes: string;
  onUpdate?: (patch: Partial<FinalAssemblyNodeData>) => void;
  onRenderFinal?: () => void;
};

export type StudioNodeData = StoryNodeData | SceneNodeData | OutputNodeData | FinalAssemblyNodeData;
export type StudioNode = Node<StudioNodeData>;
export type SaveState = "idle" | "saving" | "saved" | "error";

export type StoredWorkspace = {
  id: string;
  title: string;
  updatedAt: string;
  projectId: string | null;
  nodes: StudioNode[];
  edges: Edge[];
  timeline: OutputNodeData[];
};

export type CostEntry = {
  sceneId: string;
  sceneTitle: string;
  provider: string;
  cost: number;
  timestamp: string;
};
