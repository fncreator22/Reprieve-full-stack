/**
 * Workspace Architectural Alerts Screen.
 *
 * Lists all active policy rule violations (R1–R8) ordered by severity,
 * with shortest proof path visualization and one-click owner resolution.
 */

import type { Metadata } from "next";
import { AlertsList } from "@/components/alerts/alerts-list";

export const metadata: Metadata = { title: "Alerts" };

export default function AlertsPage() {
  return <AlertsList />;
}
