import { FinalAssemblyNode } from "./FinalAssemblyNode";
import { OutputNode } from "./OutputNode";
import { SceneNode } from "./SceneNode";
import { StoryNode } from "./StoryNode";

export const nodeTypes = {
  story: StoryNode,
  scene: SceneNode,
  output: OutputNode,
  final: FinalAssemblyNode
};
