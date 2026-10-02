import type { Metadata } from "next";
import { ScreenPlaceholder } from "@/components/screen-placeholder";
import { IdText } from "@/components/id-text";

export const metadata: Metadata = { title: "Service" };

export default async function ServicesDetailPage({ params }: { params: Promise<{ ws: string; id: string }> }) {
  const { id } = await params;
  return (
    <ScreenPlaceholder title="Service" subtitle="Dependencies, exceptions within two hops, and score history." screenId="SCR-P-09">
      <IdText id={decodeURIComponent(id)} full />
    </ScreenPlaceholder>
  );
}
