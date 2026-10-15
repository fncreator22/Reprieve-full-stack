"use client";

/**
 * Workspace Error Boundary.
 *
 * Catches runtime page-level errors within `/w/[ws]` while preserving the AppShell,
 * rendering a structured RFC 7807 problem details view with Request ID for troubleshooting.
 */

import { ServerErrorView } from "@/components/system/status-views";
import { errorMessage, requestIdOf } from "@/lib/errors";

/** Errors inside a workspace page keep the shell; only the content area shows SCR-X-06. */
export default function WorkspaceError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <ServerErrorView requestId={requestIdOf(error) ?? error.digest ?? null} message={errorMessage(error)} onRetry={reset} />;
}
