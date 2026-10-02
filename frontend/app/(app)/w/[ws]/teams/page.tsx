import type { Metadata } from "next";
import { ScreenPlaceholder } from "@/components/screen-placeholder";

export const metadata: Metadata = { title: "Teams" };

export default function TeamsPage() {
  return <ScreenPlaceholder title="Teams" subtitle="Teams and the services they own." screenId="SCR-P-11" />;
}
