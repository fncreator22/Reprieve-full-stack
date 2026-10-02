import type { Metadata } from "next";
import { ScreenPlaceholder } from "@/components/screen-placeholder";

export const metadata: Metadata = { title: "Alerts" };

export default function AlertsPage() {
  return <ScreenPlaceholder title="Alerts" subtitle="Compound risks Sentinel found across your exceptions." screenId="SCR-P-03" />;
}
