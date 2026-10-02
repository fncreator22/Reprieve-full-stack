import type { Metadata } from "next";
import { ScreenPlaceholder } from "@/components/screen-placeholder";

export const metadata: Metadata = { title: "Controls" };

export default function ControlsPage() {
  return <ScreenPlaceholder title="Controls" subtitle="Controls that exceptions waive." screenId="SCR-P-11" />;
}
