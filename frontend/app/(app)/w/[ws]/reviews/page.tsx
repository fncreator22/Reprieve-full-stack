import type { Metadata } from "next";
import { ScreenPlaceholder } from "@/components/screen-placeholder";

export const metadata: Metadata = { title: "Reviews" };

export default function ReviewsPage() {
  return <ScreenPlaceholder title="Reviews" subtitle="Decisions waiting on you and your team." screenId="SCR-P-12" />;
}
