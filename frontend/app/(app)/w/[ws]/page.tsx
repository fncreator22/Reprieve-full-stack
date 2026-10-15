/**
 * Workspace Root Index.
 *
 * Redirects incoming `/w/[ws]` requests to `/w/[ws]/home`.
 */

import { redirect } from "next/navigation";

export default async function WorkspaceIndex({ params }: { params: Promise<{ ws: string }> }) {
  const { ws } = await params;
  redirect(`/w/${ws}/home`);
}
