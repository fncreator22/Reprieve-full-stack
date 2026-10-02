import type { Metadata } from "next";
import { ScreenPlaceholder } from "@/components/screen-placeholder";

export const metadata: Metadata = { title: "Home" };

export default function HomePage() {
  return <ScreenPlaceholder title="Home" subtitle="Where hidden risk is concentrating right now, and what to do first." screenId="SCR-P-01" />;
}
