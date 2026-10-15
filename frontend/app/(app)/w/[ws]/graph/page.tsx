/**
 * Interactive Graph Canvas Explorer Screen.
 *
 * Full-screen force-directed graph canvas powered by FalkorDB:
 * - Real-time service topology, customer paths, and exception nodes.
 * - Interactive shortest proof path tracing and blast radius highlight.
 * - Sliding temporal horizon controls and avalanche simulation preview.
 */

import type { Metadata } from "next";
import { GraphExplorer } from "@/components/graph/graph-explorer";

export const metadata: Metadata = { title: "Graph" };

export default function GraphPage() {
  return <GraphExplorer />;
}
