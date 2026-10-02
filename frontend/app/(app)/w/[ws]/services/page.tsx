import type { Metadata } from "next";
import { ScreenPlaceholder } from "@/components/screen-placeholder";

export const metadata: Metadata = { title: "Services" };

export default function ServicesPage() {
  return <ScreenPlaceholder title="Services" subtitle="Services, their owners, and the risk they carry." screenId="SCR-P-09" />;
}
