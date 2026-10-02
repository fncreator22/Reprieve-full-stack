import type { Metadata } from "next";
import { ScreenPlaceholder } from "@/components/screen-placeholder";

export const metadata: Metadata = { title: "Exceptions" };

export default function ExceptionsPage() {
  return <ScreenPlaceholder title="Exceptions" subtitle="Every waiver, override and skipped check in one register." screenId="SCR-P-05" />;
}
