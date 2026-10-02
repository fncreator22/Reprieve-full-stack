import type { Metadata } from "next";
import { ScreenPlaceholder } from "@/components/screen-placeholder";

export const metadata: Metadata = { title: "People" };

export default function PeoplePage() {
  return <ScreenPlaceholder title="People" subtitle="Who owns, approves and leads, now and historically." screenId="SCR-P-10" />;
}
