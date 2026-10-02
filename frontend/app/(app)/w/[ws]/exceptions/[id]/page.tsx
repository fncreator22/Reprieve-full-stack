import type { Metadata } from "next";
import { ScreenPlaceholder } from "@/components/screen-placeholder";
import { IdText } from "@/components/id-text";

export const metadata: Metadata = { title: "Exception" };

export default async function ExceptionsDetailPage({ params }: { params: Promise<{ ws: string; id: string }> }) {
  const { id } = await params;
  return (
    <ScreenPlaceholder title="Exception" subtitle="Status, relationships, renewal chain and timeline." screenId="SCR-P-07">
      <IdText id={decodeURIComponent(id)} full />
    </ScreenPlaceholder>
  );
}
