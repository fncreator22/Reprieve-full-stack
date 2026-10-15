// Reprieve Architecture Safety Engine · October 15, 2026
import type { Metadata } from "next";
import { TeamsList } from "@/components/registry/registry";

export const metadata: Metadata = { title: "Teams" };

export default function Page() {
  return <TeamsList />;
}
