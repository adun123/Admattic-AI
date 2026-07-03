import { historyWorkspaceKey } from "../constants";
import type { StoredWorkspace, StudioNode } from "../types";

export function getWorkspaceTitle(nodes: StudioNode[]) {
  const storyNode = nodes.find((node) => node.data.kind === "story");
  if (!storyNode || storyNode.data.kind !== "story") return "Draft kosong";

  const firstLine = storyNode.data.story.trim().split(/\n+/)[0]?.trim();
  if (firstLine) return firstLine.slice(0, 56);
  if (storyNode.data.protagonist.trim()) return storyNode.data.protagonist.trim().slice(0, 56);

  return "Draft kosong";
}

export function readWorkspaceHistory() {
  if (typeof window === "undefined") return [];

  try {
    const stored = window.localStorage.getItem(historyWorkspaceKey);
    if (!stored) return [];
    const parsed = JSON.parse(stored) as StoredWorkspace[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeWorkspaceHistory(workspace: StoredWorkspace) {
  if (typeof window === "undefined") return [];

  const history = readWorkspaceHistory();
  const isSameWorkspace = (item: StoredWorkspace) =>
    item.id === workspace.id ||
    (Boolean(workspace.projectId) && item.projectId === workspace.projectId);
  const nextHistory = [
    workspace,
    ...history.filter((item) => !isSameWorkspace(item))
  ].slice(0, 8);

  window.localStorage.setItem(historyWorkspaceKey, JSON.stringify(nextHistory));
  return nextHistory;
}

