import type { Metadata } from "next";
import { ScreenPlaceholder } from "@/components/screen-placeholder";

export const metadata: Metadata = { title: "Steward" };

export default function StewardPage() {
  return <ScreenPlaceholder title="Steward" subtitle="Ask about risk, owners and expiries. Every claim is cited." screenId="SCR-P-13" />;
}
