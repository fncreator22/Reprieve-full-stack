import type { Metadata } from "next";
import { ScreenPlaceholder } from "@/components/screen-placeholder";

export const metadata: Metadata = { title: "New exception" };

export default function ExceptionsNewPage() {
  return <ScreenPlaceholder title="New exception" subtitle="Record what is waived, where, by whom, and until when." screenId="SCR-P-06" />;
}
