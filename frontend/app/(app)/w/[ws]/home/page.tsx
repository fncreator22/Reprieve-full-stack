/**
 * Workspace Executive Home Screen.
 *
 * Displays high-level architectural risk summary, active alerts count,
 * top risk services, expiring waivers, and precedent decisions.
 */

import type { Metadata } from "next";
import { HomeScreen } from "@/components/home/home-screen";

export const metadata: Metadata = { title: "Home" };

export default function HomePage() {
  return <HomeScreen />;
}
