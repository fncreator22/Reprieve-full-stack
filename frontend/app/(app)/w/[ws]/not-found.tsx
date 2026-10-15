/**
 * Workspace Resource Not Found Page.
 *
 * Renders an accessible 404 view when an invalid workspace entity is requested.
 */

import { NotFoundView } from "@/components/system/status-views";

export default function WorkspaceNotFound() {
  return <NotFoundView homeHref="/onboarding" />;
}
