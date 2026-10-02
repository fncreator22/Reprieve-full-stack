import type { Metadata } from "next";
import { ScreenPlaceholder } from "@/components/screen-placeholder";
import { IdText } from "@/components/id-text";

export const metadata: Metadata = { title: "Alert" };

export default async function AlertsDetailPage({ params }: { params: Promise<{ ws: string; id: string }> }) {
  const { id } = await params;
  return (
    <ScreenPlaceholder title="Alert" subtitle="Why it fired, the proof path, and what to do next." screenId="SCR-P-04">
      <IdText id={decodeURIComponent(id)} full />
    </ScreenPlaceholder>
  );
}
