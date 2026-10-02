import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ScreenPlaceholder } from "@/components/screen-placeholder";

export const metadata: Metadata = { title: "Settings" };

const TABS = { profile: "Profile", workspace: "Workspace", members: "Members", notifications: "Notifications", ai: "AI" } as const;

export default async function SettingsPage({ params }: { params: Promise<{ ws: string; tab: string }> }) {
  const { ws, tab } = await params;
  if (!(tab in TABS)) notFound();
  return (
    <ScreenPlaceholder title="Settings" subtitle={`${TABS[tab as keyof typeof TABS]} settings`} screenId="SCR-P-18">
      <nav aria-label="Settings sections" className="flex flex-wrap justify-center gap-3">
        {Object.entries(TABS).map(([key, label]) => (
          <Link
            key={key}
            href={`/w/${ws}/settings/${key}`}
            aria-current={key === tab ? "page" : undefined}
            className="rounded-md px-2 py-1 hover:bg-brand-soft aria-[current=page]:text-brand"
          >
            {label}
          </Link>
        ))}
      </nav>
    </ScreenPlaceholder>
  );
}
