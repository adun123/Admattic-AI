import { useCallback, useEffect, useRef, useState } from "react";
import { addEdge, Background, Controls, MiniMap, ReactFlow, useEdgesState, useNodesState, type Connection, type Edge, type Node } from "@xyflow/react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { COST_STORAGE_KEY, aspectRatioOptions, currentWorkspaceKey, durationOptions, initialEdges, initialNodes, renderQualityOptions, sceneCountOptions, styleOptions, toneOptions } from "../constants";
import { nodeTypes } from "../nodes/nodeTypes";
import type { CostEntry, FinalAssemblyNodeData, OutputNodeData, ReferenceAsset, SaveState, SceneNodeData, StoredWorkspace, StoryNodeData, StudioNode, VideoVersion } from "../types";
import { downloadVideo } from "../utils/downloadVideo";
import { buildFinalAssemblyData } from "../utils/finalAssembly";
import { createMockScenes } from "../utils/mockScenes";
import { getWorkspaceTitle, readWorkspaceHistory, writeWorkspaceHistory } from "../utils/workspaceStorage";
import { PreviewPlaylist, RenderFinalModal, TimelineBar, TopBar } from "./StudioChrome";

export function StudioWorkspace({
  userEmail,
  onLogout
}: {
  userEmail: string | null;
  onLogout: () => void;
}) {
  const [nodes, setNodes, onNodesChange] = useNodesState<StudioNode>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [timeline, setTimeline] = useState<OutputNodeData[]>([]);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [workspaceId, setWorkspaceId] = useState("local-draft");
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [isLoadingProject, setIsLoadingProject] = useState(false);
  const [isGeneratingStructure, setIsGeneratingStructure] = useState(false);
  const [workspaceHistory, setWorkspaceHistory] = useState<StoredWorkspace[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [costLog, setCostLog] = useState<CostEntry[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = window.localStorage.getItem(COST_STORAGE_KEY);
      return stored ? (JSON.parse(stored) as CostEntry[]) : [];
    } catch {
      return [];
    }
  });
  const hasRestoredWorkspace = useRef(false);

  const resetCostLog = useCallback(() => {
    setCostLog([]);
    try {
      window.localStorage.removeItem(COST_STORAGE_KEY);
    } catch {}
  }, []);

  const deleteWorkspaceHistory = useCallback(
    (workspace: StoredWorkspace) => {
      setWorkspaceHistory((prev) => {
        const next = prev.filter((w) => w.id !== workspace.id);
        try {
          window.localStorage.setItem(
            "campaign-video-ai:workspace-history",
            JSON.stringify(next)
          );
        } catch {}
        return next;
      });
    },
    []
  );

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const updateNodeData = useCallback(
    (
      nodeId: string,
      patch: Partial<StoryNodeData> | Partial<SceneNodeData> | Partial<FinalAssemblyNodeData>
    ) => {
      setNodes((current) =>
        current.map((node) => {
          if (node.id !== nodeId) return node;
          if (node.data.kind === "story") {
            return {
              ...node,
              data: {
                ...node.data,
                ...(patch as Partial<StoryNodeData>),
                kind: "story" as const
              }
            };
          }
          if (node.data.kind === "scene") {
            return {
              ...node,
              data: {
                ...node.data,
                ...(patch as Partial<SceneNodeData>),
                kind: "scene" as const
              }
            };
          }
          if (node.data.kind === "final") {
            return {
              ...node,
              data: {
                ...node.data,
                ...(patch as Partial<FinalAssemblyNodeData>),
                kind: "final" as const
              }
            };
          }
          return node;
        })
      );
      setSaveState("idle");
    },
    [setNodes]
  );

  const uploadReference = useCallback(
    async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload-reference", {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        console.error("Failed to upload reference", errorBody);
        setSaveState("error");
        return;
      }

      const result = (await response.json()) as { asset: ReferenceAsset };

      setNodes((current) =>
        current.map((node) =>
          node.data.kind === "story"
            ? {
                ...node,
                data: {
                  ...node.data,
                  referenceAssets: [...(node.data.referenceAssets ?? []), result.asset],
                  kind: "story" as const
                }
              }
            : node
        )
      );

      setSaveState("idle");
    },
    [setNodes]
  );

  useEffect(() => {
    setWorkspaceHistory(readWorkspaceHistory());

    try {
      const stored = window.localStorage.getItem(currentWorkspaceKey);
      if (stored) {
        const workspace = JSON.parse(stored) as StoredWorkspace;
        if (workspace.nodes?.length) {
          setNodes(workspace.nodes);
          setEdges(workspace.edges ?? []);
          setTimeline(workspace.timeline ?? []);
          setProjectId(workspace.projectId ?? null);
          setWorkspaceId(workspace.id);
        }
      }
    } catch (error) {
      console.error("Failed to restore local workspace", error);
    } finally {
      hasRestoredWorkspace.current = true;
      setIsLoadingProject(false);
    }
  }, [setEdges, setNodes]);

  useEffect(() => {
    if (!hasRestoredWorkspace.current) return;

    const timeout = window.setTimeout(() => {
      const workspace: StoredWorkspace = {
        id: projectId ?? workspaceId,
        title: getWorkspaceTitle(nodes),
        updatedAt: new Date().toISOString(),
        projectId,
        nodes,
        edges,
        timeline
      };

      window.localStorage.setItem(currentWorkspaceKey, JSON.stringify(workspace));
      setWorkspaceHistory(writeWorkspaceHistory(workspace));
    }, 650);

    return () => window.clearTimeout(timeout);
  }, [edges, nodes, projectId, timeline, workspaceId]);

  useEffect(() => {
    if (timeline.length === 0) {
      setNodes((current) => current.filter((node) => node.data.kind !== "final"));
      setEdges((current) => current.filter((edge) => edge.target !== "final-assembly"));
      return;
    }

    setNodes((current) => {
      const existingFinalNode = current.find((node) => node.id === "final-assembly");
      const existingFinalData =
        existingFinalNode?.data.kind === "final" ? existingFinalNode.data : undefined;
      const finalData = buildFinalAssemblyData(timeline, current, existingFinalData);

      if (existingFinalNode) {
        return current.map((node) =>
          node.id === "final-assembly" ? { ...node, data: finalData } : node
        );
      }

      return [
        ...current,
        {
          id: "final-assembly",
          type: "final",
          position: { x: 1370, y: 120 },
          data: finalData
        }
      ];
    });

    setEdges((current) => {
      const withoutFinalEdges = current.filter((edge) => edge.target !== "final-assembly");
      const finalEdges = timeline.map((item) => ({
        id: `output-${item.sceneId}-final-assembly`,
        source: `output-${item.sceneId}`,
        target: "final-assembly",
        animated: true
      }));

      return [...withoutFinalEdges, ...finalEdges];
    });
  }, [setEdges, setNodes, timeline]);

  const generateStructure = useCallback(async () => {
    const storyNode = nodes.find((node) => node.data.kind === "story");
    const fallbackStoryData = initialNodes[0].data as StoryNodeData;
    const storyData = storyNode?.data.kind === "story" ? storyNode.data : fallbackStoryData;

    if (!storyData.story.trim()) {
      setSaveState("idle");
      return;
    }

    if (!storyData.protagonist.trim()) {
      setSaveState("idle");
      return;
    }

    setIsGeneratingStructure(true);

    let scenes = createMockScenes();

    try {
      const response = await fetch("/api/generate-structure", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          story: storyData.story,
          protagonist: storyData.protagonist,
          referenceAssets: storyData.referenceAssets ?? [],
          tone: storyData.tone || toneOptions[0],
          style: storyData.style || styleOptions[0],
          styleDirection: storyData.styleDirection,
          duration: storyData.duration || durationOptions[3],
          aspectRatio: storyData.aspectRatio || aspectRatioOptions[0],
          sceneCount: storyData.sceneCount || sceneCountOptions[2]
        })
      });

      if (!response.ok) {
        throw new Error("AI scene generation failed.");
      }

      const result = (await response.json()) as { scenes: SceneNodeData[] };
      if (result.scenes.length > 0) {
        scenes = result.scenes;
      }
    } catch (error) {
      console.error("Falling back to mock scenes", error);
    }

    const sceneNodes: StudioNode[] = scenes.map((scene, index) => ({
      id: `scene-${scene.sceneNumber}`,
      type: "scene",
      position: { x: 500, y: 70 + index * 250 },
      data: scene
    }));
    const sceneEdges: Edge[] = sceneNodes.map((node) => ({
      id: `story-${node.id}`,
      source: "story-input",
      target: node.id,
      animated: true
    }));

    setNodes((current) => [
      current.find((node) => node.id === "story-input") ?? initialNodes[0],
      ...sceneNodes
    ]);
    setEdges(sceneEdges);
    setTimeline([]);
    setSaveState("idle");
    setIsGeneratingStructure(false);
  }, [nodes, setEdges, setNodes]);

  const generateVideoForScene = useCallback(
    async (sceneNode: StudioNode) => {
      if (sceneNode.data.kind !== "scene") return;

      const scene = sceneNode.data;
      const storyNode = nodes.find((node) => node.data.kind === "story");
      const storyData = storyNode?.data.kind === "story" ? storyNode.data : null;
      const aspectRatio = storyData?.aspectRatio || aspectRatioOptions[0];
      const resolution = storyData?.renderQuality || renderQualityOptions[0];
      const referenceImageUrls = (storyData?.referenceAssets ?? [])
        .filter((asset) => asset.type === "image")
        .slice(0, 3)
        .map((asset) => asset.url);
      const sceneDuration = scene.duration || 4;
      const outputId = `output-${sceneNode.id}`;

      setNodes((current) =>
        current.map((node) =>
          node.id === sceneNode.id && node.data.kind === "scene"
            ? { ...node, data: { ...node.data, status: "generating" as const } }
            : node
        )
      );

      try {
        const hasReference = referenceImageUrls.length > 0;

        const sanitizeIdentity = (text: string): string =>
          text
            .replace(/\bpria\s+indonesia\b/gi, "seseorang")
            .replace(/\bwanita\s+indonesia\b/gi, "seseorang")
            .replace(/\busia\s+\d+(?:[,-]\d+)?(?:[- ]?(?:an|thn|tahun|yo))?\b/gi, "")
            .replace(/\bmuda\b|\btua\b/gi, "")
            .replace(/\bpria\b|\bwanita\b/g, "seseorang")
            .replace(/\bmale\b|\bfemale\b/gi, "a person")
            .replace(/\bman\b|\bwoman\b/gi, "person")
            .replace(/\s{2,}/g, " ")
            .trim();

        const scenePromptSafe = hasReference
          ? sanitizeIdentity(scene.prompt)
          : scene.prompt;

        const promptParts = hasReference
          ? [
              scenePromptSafe,
              "Karakter utama mengikuti orang pada gambar referensi, tanpa mengubah identitas wajah."
            ]
          : [
              scenePromptSafe,
              storyData?.protagonist
                ? `Karakter utama yang sama di semua scene: ${storyData.protagonist}.`
                : "Pertahankan karakter utama yang sama di semua scene.",
              `Tone: ${storyData?.tone || toneOptions[0]}.`,
              `Visual style: ${storyData?.style || styleOptions[0]}.`,
              storyData?.styleDirection
                ? `Manual art direction: ${storyData.styleDirection}.`
                : "",
              `Aspect ratio: ${aspectRatio}.`
            ].filter(Boolean);

        const response = await fetch("/api/generate-video", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            provider: referenceImageUrls.length > 0 ? "veo3.1-fast-reference" : "veo3.1-fast",
            prompt: promptParts.join(" "),
            aspectRatio,
            resolution,
            durationSeconds: sceneDuration,
            generateAudio: true,
            referenceImageUrls
          })
        });

        if (!response.ok) {
          const errorBody = (await response.json().catch(() => null)) as {
            error?: string;
            code?: string;
            message?: string;
            details?: unknown;
          } | null;
          console.error("Video generation failed", errorBody);
          if (errorBody?.code === "content_policy_violation") {
            throw new Error(
              "Model AI menolak request karena melanggar content policy. " +
              "Kemungkinan penyebab: (1) gambar referensi terdeteksi sebagai tokoh publik/wajah yang recognizable, " +
              "(2) prompt menyebut identitas spesifik (usia atau nama), atau " +
              "(3) foto didownload dari internet dan terdeteksi oleh model AI. " +
              "Coba: hapus reference image dulu, pakai prompt biasa saja, atau gunakan foto yang benar-benar selfie sendiri dari HP."
            );
          }
          if (errorBody?.code === "no_media_generated") {
            throw new Error(
              "Model AI menolak kombinasi reference + prompt ini. " +
              "Coba ganti atau hapus gambar referensi, dan sederhanakan prompt (jangan sebut usia/gender/profesi spesifik)."
            );
          }
          throw new Error(
            errorBody?.details
              ? `${errorBody.message ?? "Video generation failed."} ${JSON.stringify(errorBody.details)}`
              : errorBody?.message ?? "Video generation failed."
          );
        }

        const result = (await response.json()) as {
          videoUrl: string;
          provider: string;
          estimatedCost?: number;
        };

        if (typeof result.estimatedCost === "number" && result.estimatedCost > 0) {
          setCostLog((prev) => {
            const next = [
              ...prev,
              {
                sceneId: sceneNode.id,
                sceneTitle: scene.title,
                provider: result.provider,
                cost: result.estimatedCost ?? 0,
                timestamp: new Date().toISOString()
              }
            ];
            try {
              window.localStorage.setItem(COST_STORAGE_KEY, JSON.stringify(next));
            } catch {}
            return next;
          });
        }

        setNodes((current) => {
          const existingOutput = current.find((node) => node.id === outputId);
          const existingData =
            existingOutput?.data.kind === "output" ? existingOutput.data : undefined;
          const previousVersions: VideoVersion[] = [...(existingData?.versions ?? [])];
          if (existingData?.videoUrl) {
            previousVersions.push({
              videoUrl: existingData.videoUrl,
              provider: existingData.provider,
              createdAt:
                existingData.createdAt ?? new Date().toISOString()
            });
          }

          const outputData: OutputNodeData = {
            kind: "output",
            sceneId: sceneNode.id,
            sceneTitle: scene.title,
            videoUrl: result.videoUrl,
            provider: result.provider,
            status: "ready",
            createdAt: new Date().toISOString(),
            aspectRatio,
            versions:
              previousVersions.length > 0 ? previousVersions : undefined
          };

          return current
            .filter((node) => node.id !== outputId)
            .map((node) =>
              node.id === sceneNode.id && node.data.kind === "scene"
                ? { ...node, data: { ...node.data, status: "generated" as const } }
                : node
            )
            .concat({
              id: outputId,
              type: "output",
              position: {
                x: (sceneNode.position?.x ?? 500) + 430,
                y: sceneNode.position?.y ?? 120
              },
              data: outputData
            });
        });

        setEdges((current) =>
          current
            .filter((edge) => !(edge.source === sceneNode.id && edge.target === outputId))
            .concat({
              id: `${sceneNode.id}-${outputId}`,
              source: sceneNode.id,
              target: outputId,
              animated: true
            })
        );
      } catch (error) {
        console.error("Failed to generate video", error);
        setNodes((current) =>
          current.map((node) =>
            node.id === sceneNode.id && node.data.kind === "scene"
              ? { ...node, data: { ...node.data, status: "prompt_ready" as const } }
              : node
          )
        );
        setSaveState("error");
        setErrorMessage(
          error instanceof Error ? error.message : "Gagal generate video."
        );
        return;
      }

      setSaveState("idle");
    },
    [nodes, setEdges, setNodes]
  );

  const loadWorkspace = useCallback(
    (workspace: StoredWorkspace) => {
      setNodes(workspace.nodes);
      setEdges(workspace.edges ?? []);
      setTimeline(workspace.timeline ?? []);
      setProjectId(workspace.projectId ?? null);
      setWorkspaceId(workspace.id);
      window.localStorage.setItem(currentWorkspaceKey, JSON.stringify(workspace));
      setSaveState("idle");
    },
    [setEdges, setNodes]
  );

  const createNewWorkspace = useCallback(() => {
    const nextWorkspaceId = `local-${Date.now()}`;
    const workspace: StoredWorkspace = {
      id: nextWorkspaceId,
      title: "Draft kosong",
      updatedAt: new Date().toISOString(),
      projectId: null,
      nodes: initialNodes,
      edges: initialEdges,
      timeline: []
    };

    setNodes(initialNodes);
    setEdges(initialEdges);
    setTimeline([]);
    setProjectId(null);
    setWorkspaceId(nextWorkspaceId);
    setSaveState("idle");
    window.localStorage.setItem(currentWorkspaceKey, JSON.stringify(workspace));
    setWorkspaceHistory(writeWorkspaceHistory(workspace));
  }, [setEdges, setNodes]);

  const exportAllVideos = useCallback(() => {
    const outputNodes = nodes.filter(
      (node): node is Node<OutputNodeData> => node.data.kind === "output"
    );
    if (outputNodes.length === 0) return;

    outputNodes.forEach((node, index) => {
      const url = node.data.videoUrl;
      if (!url) return;
      const safeTitle = node.data.sceneTitle
        .replace(/[^a-zA-Z0-9-_]+/g, "-")
        .toLowerCase()
        .slice(0, 40);
      const filename = `scene-${String(index + 1).padStart(2, "0")}-${safeTitle}.mp4`;
      setTimeout(() => {
        void downloadVideo(url, filename);
      }, index * 400);
    });
  }, [nodes]);

  const generateAllScenes = useCallback(async () => {
    const pendingScenes = nodes.filter(
      (node) => node.data.kind === "scene" && node.data.status === "prompt_ready"
    );
    if (pendingScenes.length === 0) return;
    const confirmed = window.confirm(
      `Akan generate ${pendingScenes.length} video sekaligus.\n\n` +
        `Estimasi biaya per video: $2.40 (reference) / $7.20 (no reference).\n` +
        `Aksi ini tidak bisa dibatalkan dan akan mengurangi budget kamu.\n\n` +
        `Lanjutkan?`
    );
    if (!confirmed) return;
    for (const scene of pendingScenes) {
      await generateVideoForScene(scene);
    }
  }, [nodes, generateVideoForScene]);

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isFinalRenderOpen, setIsFinalRenderOpen] = useState(false);

  const approveOutput = useCallback(
    (outputNode: StudioNode) => {
      if (outputNode.data.kind !== "output") return;

      const approvedData = { ...outputNode.data, status: "approved" as const };

      setNodes((current) =>
        current.map((node) =>
          node.id === outputNode.id ? { ...node, data: approvedData } : node
        )
      );
      setTimeline((current) => {
        if (current.some((item) => item.sceneId === approvedData.sceneId)) return current;
        return [...current, approvedData];
      });
      setSaveState("idle");
    },
    [setNodes]
  );

  const saveProject = useCallback(async () => {
    const storyNode = nodes.find((node) => node.data.kind === "story");
    const sceneNodes = nodes.filter((node) => node.data.kind === "scene");
    const outputNodes = nodes.filter((node) => node.data.kind === "output");

    if (!storyNode || storyNode.data.kind !== "story") return;

    setSaveState("saving");

    try {
      const projectPayload = {
        name: "Agency Anniversary POC",
        video_type: "Anniversary",
        tone: storyNode.data.tone,
        visual_style: storyNode.data.style,
        duration_seconds: storyNode.data.duration,
        aspect_ratio: storyNode.data.aspectRatio,
        status: sceneNodes.length > 0 ? "ready" : "draft"
      };

      const projectResult = projectId
        ? await supabase
            .from("projects")
            .update(projectPayload)
            .eq("id", projectId)
            .select("id")
            .single()
        : await supabase.from("projects").insert(projectPayload).select("id").single();

      if (projectResult.error) throw projectResult.error;

      const activeProjectId = projectResult.data.id as string;
      setProjectId(activeProjectId);

      const { error: storyError } = await supabase.from("story_inputs").upsert(
        {
          project_id: activeProjectId,
          story: storyNode.data.story,
          tone: storyNode.data.tone,
          visual_style: storyNode.data.style,
          duration_seconds: storyNode.data.duration,
          aspect_ratio: storyNode.data.aspectRatio,
          canvas_position: storyNode.position
        },
        { onConflict: "project_id" }
      );

      if (storyError) throw storyError;

      const deleteResults = await Promise.all([
        supabase.from("timeline_items").delete().eq("project_id", activeProjectId),
        supabase.from("video_outputs").delete().eq("project_id", activeProjectId),
        supabase.from("canvas_edges").delete().eq("project_id", activeProjectId)
      ]);
      const deleteError = deleteResults.find((result) => result.error)?.error;
      if (deleteError) throw deleteError;

      const { error: sceneDeleteError } = await supabase
        .from("scenes")
        .delete()
        .eq("project_id", activeProjectId);

      if (sceneDeleteError) throw sceneDeleteError;

      const scenePayloads = sceneNodes.flatMap((node) => {
        if (node.data.kind !== "scene") return [];
        return [
          {
            project_id: activeProjectId,
            scene_number: node.data.sceneNumber,
            title: node.data.title,
            duration_seconds: node.data.duration,
            narration: node.data.narration,
            visual_description: node.data.visualDescription,
            camera_direction: node.data.cameraDirection,
            mood: node.data.mood,
            prompt: node.data.prompt,
            status: node.data.status,
            canvas_position: node.position
          }
        ];
      });

      const sceneIdByNodeId = new Map<string, string>();

      if (scenePayloads.length > 0) {
        const { data: insertedScenes, error: sceneInsertError } = await supabase
          .from("scenes")
          .insert(scenePayloads)
          .select("id,scene_number")
          .returns<Array<{ id: string; scene_number: number }>>();

        if (sceneInsertError) throw sceneInsertError;

        for (const scene of insertedScenes ?? []) {
          sceneIdByNodeId.set(`scene-${scene.scene_number}`, scene.id);
        }
      }

      const outputPayloads = outputNodes.flatMap((node) => {
        if (node.data.kind !== "output") return [];
        const databaseSceneId = sceneIdByNodeId.get(node.data.sceneId);
        if (!databaseSceneId) return [];

        return [
          {
            project_id: activeProjectId,
            scene_id: databaseSceneId,
            provider: node.data.provider,
            video_url: node.data.videoUrl,
            status: node.data.status,
            canvas_position: node.position
          }
        ];
      });

      const outputIdBySceneNodeId = new Map<string, string>();

      if (outputPayloads.length > 0) {
        const { data: insertedOutputs, error: outputInsertError } = await supabase
          .from("video_outputs")
          .insert(outputPayloads)
          .select("id,scene_id")
          .returns<Array<{ id: string; scene_id: string }>>();

        if (outputInsertError) throw outputInsertError;

        for (const output of insertedOutputs ?? []) {
          const sceneNodeId = [...sceneIdByNodeId.entries()].find(
            ([, databaseSceneId]) => databaseSceneId === output.scene_id
          )?.[0];
          if (sceneNodeId) outputIdBySceneNodeId.set(sceneNodeId, output.id);
        }
      }

      const timelinePayloads = timeline.flatMap((item, index) => {
        const outputId = outputIdBySceneNodeId.get(item.sceneId);
        if (!outputId) return [];
        return [
          {
            project_id: activeProjectId,
            video_output_id: outputId,
            sort_order: index + 1
          }
        ];
      });

      if (timelinePayloads.length > 0) {
        const { error: timelineError } = await supabase
          .from("timeline_items")
          .insert(timelinePayloads);

        if (timelineError) throw timelineError;
      }

      if (edges.length > 0) {
        const { error: edgeError } = await supabase.from("canvas_edges").insert(
          edges.map((edge) => ({
            project_id: activeProjectId,
            source_node_id: edge.source,
            target_node_id: edge.target,
            animated: edge.animated ?? false
          }))
        );

        if (edgeError) throw edgeError;
      }

      setSaveState("saved");
    } catch (error) {
      console.error("Failed to save project", error);
      setSaveState("error");
    }
  }, [edges, nodes, projectId, timeline]);

  const flowNodes = nodes.map((node) => {
    if (node.data.kind === "story") {
      return {
        ...node,
        data: {
          ...node.data,
          isGeneratingStructure,
          onGenerateStructure: generateStructure,
          onAddReference: uploadReference,
          onUpdate: (patch: Partial<StoryNodeData>) => updateNodeData(node.id, patch)
        }
      };
    }
    if (node.data.kind === "scene") {
      return {
        ...node,
        data: {
          ...node.data,
          isGeneratingVideo: node.data.status === "generating",
          onGenerateVideo: () => generateVideoForScene(node),
          onUpdate: (patch: Partial<SceneNodeData>) => updateNodeData(node.id, patch)
        }
      };
    }
    if (node.data.kind === "output") {
      const outputSceneId = node.data.sceneId;
      const sceneNode = nodes.find(
        (n) => n.id === outputSceneId && n.data.kind === "scene"
      );
      return {
        ...node,
        data: {
          ...node.data,
          onApprove: () => approveOutput(node),
          onRetry: sceneNode
            ? () => generateVideoForScene(sceneNode)
            : undefined
        }
      };
    }
    if (node.data.kind === "final") {
      return {
        ...node,
        data: {
          ...node.data,
          onUpdate: (patch: Partial<FinalAssemblyNodeData>) => updateNodeData(node.id, patch),
          onRenderFinal: () => setIsFinalRenderOpen(true)
        }
      };
    }
    return node;
  });

  return (
    <main className="flex h-screen flex-col overflow-hidden bg-studio-bg text-slate-100">
      <TopBar
        isLoadingProject={isLoadingProject}
        saveState={saveState}
        history={workspaceHistory}
        onSave={saveProject}
        onLoadHistory={loadWorkspace}
        onNewWorkspace={createNewWorkspace}
        onDeleteHistory={deleteWorkspaceHistory}
        onPreview={() => setIsPreviewOpen(true)}
        onExport={exportAllVideos}
        canPreview={timeline.length > 0}
        canExport={nodes.some((node) => node.data.kind === "output" && node.data.videoUrl)}
        userEmail={userEmail}
        onLogout={onLogout}
        costLog={costLog}
        onResetCostLog={resetCostLog}
      />
      <section className="relative min-h-0 flex-1">
        {errorMessage ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="max-w-md rounded-xl border border-red-400/40 bg-red-950 p-6 text-slate-100 shadow-2xl">
              <h3 className="mb-2 text-lg font-semibold text-red-200">
                Generate Video Gagal
              </h3>
              <p className="mb-4 whitespace-pre-wrap text-sm leading-relaxed text-slate-200">
                {errorMessage}
              </p>
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setErrorMessage(null)}
                  className="rounded-md bg-red-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        ) : null}
        <div className="absolute inset-0">
          <ReactFlow
            nodes={flowNodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
            minZoom={0.35}
            maxZoom={1.4}
          >
            <Background color="#253047" gap={24} size={1} />
            <Controls />
            <MiniMap pannable zoomable nodeColor="#16c7d8" />
          </ReactFlow>
        </div>
        <TimelineBar
          timeline={timeline}
          onGenerateAll={generateAllScenes}
          pendingCount={nodes.filter((n) => n.data.kind === "scene" && n.data.status === "prompt_ready").length}
        />
      </section>
      {isPreviewOpen ? (
        <PreviewPlaylist
          timeline={timeline}
          onClose={() => setIsPreviewOpen(false)}
        />
      ) : null}
      {isFinalRenderOpen ? (
        <RenderFinalModal
          timeline={timeline}
          onClose={() => setIsFinalRenderOpen(false)}
        />
      ) : null}
    </main>
  );
}

