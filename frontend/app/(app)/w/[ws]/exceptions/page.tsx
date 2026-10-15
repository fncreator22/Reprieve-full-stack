/**
 * Workspace Exception Waiver Inventory.
 *
 * Searchable, filterable ledger of all temporary waivers, skipped tests,
 * and security bypasses across the service graph with expiry tracking.
 */

import type { Metadata } from "next";
import { ExceptionsList } from "@/components/exceptions/exceptions-list";

export const metadata: Metadata = { title: "Exceptions" };

export default function ExceptionsPage() {
  return <ExceptionsList />;
}
