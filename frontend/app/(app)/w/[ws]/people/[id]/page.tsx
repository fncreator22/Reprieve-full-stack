import type { Metadata } from "next";
import { ScreenPlaceholder } from "@/components/screen-placeholder";
import { IdText } from "@/components/id-text";

export const metadata: Metadata = { title: "Person" };

export default async function PeopleDetailPage({ params }: { params: Promise<{ ws: string; id: string }> }) {
  const { id } = await params;
  return (
    <ScreenPlaceholder title="Person" subtitle="Memberships, ownership and fallback roles." screenId="SCR-P-10">
      <IdText id={decodeURIComponent(id)} full />
    </ScreenPlaceholder>
  );
}
