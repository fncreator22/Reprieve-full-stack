import type { Metadata } from "next";
import { ScreenPlaceholder } from "@/components/screen-placeholder";

export const metadata: Metadata = { title: "Graph" };

export default function GraphPage() {
  return <ScreenPlaceholder title="Graph" subtitle="Explore how services, exceptions, people and controls connect." screenId="SCR-P-02" />;
}
