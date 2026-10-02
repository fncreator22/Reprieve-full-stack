import type { Metadata } from "next";
import { ScreenPlaceholder } from "@/components/screen-placeholder";
import { IdText } from "@/components/id-text";

export const metadata: Metadata = { title: "Review" };

export default async function ReviewsDetailPage({ params }: { params: Promise<{ ws: string; id: string }> }) {
  const { id } = await params;
  return (
    <ScreenPlaceholder title="Review" subtitle="Context, precedent, and the decision." screenId="SCR-P-12">
      <IdText id={decodeURIComponent(id)} full />
    </ScreenPlaceholder>
  );
}
