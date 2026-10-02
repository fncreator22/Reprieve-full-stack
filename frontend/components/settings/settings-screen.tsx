"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { PageContainer, PageHeader } from "@/components/page-header";
import { TABS, type SettingsTab } from "@/components/settings/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApi, wsPath } from "@/lib/api";
import { errorMessage } from "@/lib/errors";
import type { AiMode, WorkspaceOut } from "@/lib/types";
import { cn } from "@/lib/utils";
import { meQueryKey, useMe, useWorkspace, workspaceQueryKey } from "@/lib/workspace";

const ROLE_RANK = { viewer: 0, member: 1, reviewer: 2, admin: 3, owner: 4 } as const;
const AI_MODES: { mode: AiMode; title: string; body: string; available: boolean }[] = [
  { mode: "cloud", title: "Cloud", body: "Steward uses the configured hosted model. It receives entity IDs, names and short excerpts, never whole records.", available: true },
  { mode: "private", title: "Private", body: "Only a local or self-hosted model is used; nothing is sent to a cloud provider. Arrives with the private beta.", available: false },
  { mode: "off", title: "Off", body: "No AI calls. Detection, scores, owner routing, proof paths and Quick answers keep working.", available: true },
];

/** SCR-P-18 (R0 subset): profile, workspace, AI mode. Members and notification preferences arrive in R1. */
export function SettingsScreen({ tab }: { tab: SettingsTab }) {
  const { slug } = useWorkspace();
  return (
    <PageContainer>
      <PageHeader title="Settings" />
      <div className="grid gap-6 md:grid-cols-[180px_1fr]">
        <nav aria-label="Settings sections" className="flex gap-1 md:flex-col">
          {(Object.keys(TABS) as SettingsTab[]).map((k) => (
            <Link
              key={k}
              href={`/w/${slug}/settings/${k}`}
              aria-current={k === tab ? "page" : undefined}
              className={cn("rounded-md px-3 py-2 text-body-sm", k === tab ? "bg-brand-soft font-medium" : "text-text-secondary hover:bg-brand-soft")}
            >
              {TABS[k]}
            </Link>
          ))}
        </nav>
        <div className="max-w-2xl space-y-6">{tab === "profile" ? <Profile /> : tab === "workspace" ? <Workspace /> : <Ai />}</div>
      </div>
    </PageContainer>
  );
}

function Profile() {
  const api = useApi();
  const qc = useQueryClient();
  const me = useMe();
  const { theme, setTheme } = useTheme();
  const [name, setName] = useState<string | null>(null);
  const save = useMutation({
    mutationFn: () => api(`/me`, { method: "PATCH", body: { name } }),
    onSuccess: () => (qc.invalidateQueries({ queryKey: meQueryKey }), toast.success("Profile saved.")),
    onError: (e) => toast.error(errorMessage(e)),
  });
  return (
    <>
      <Section title="Profile">
        <form className="space-y-4" onSubmit={(e) => (e.preventDefault(), save.mutate())}>
          <label className="block space-y-1.5 text-body-sm">
            <span className="font-medium">Name</span>
            <Input value={name ?? me.data?.user.name ?? ""} onChange={(e) => setName(e.target.value)} maxLength={120} />
          </label>
          <p className="text-body-sm text-text-muted">Email: {me.data?.user.email}</p>
          <Button type="submit" loading={save.isPending} disabled={name === null}>
            Save
          </Button>
        </form>
      </Section>
      <Section title="Theme">
        <div role="radiogroup" aria-label="Theme" className="flex gap-2">
          {["system", "light", "dark"].map((t) => (
            <Button key={t} role="radio" aria-checked={theme === t} variant={theme === t ? "default" : "secondary"} size="sm" onClick={() => setTheme(t)}>
              {t[0].toUpperCase() + t.slice(1)}
            </Button>
          ))}
        </div>
      </Section>
    </>
  );
}

function Workspace() {
  const api = useApi();
  const qc = useQueryClient();
  const { wsId, workspace, role } = useWorkspace();
  const admin = ROLE_RANK[role] >= ROLE_RANK.admin;
  const run = useMutation({
    mutationFn: () => api<{ created: number; resolved: number }>(wsPath(wsId, "/sentinel/run"), { method: "POST" }),
    onSuccess: (r) => toast.success(`Sentinel finished: ${r.created} new, ${r.resolved} resolved.`),
    onError: (e) => toast.error(errorMessage(e)),
  });
  const reset = useMutation({
    mutationFn: () => api<WorkspaceOut>(wsPath(wsId, "/sample-data"), { method: "POST" }),
    onSuccess: (w) => {
      qc.setQueryData(workspaceQueryKey(wsId), w);
      toast.success("Rebuilding the workspace from the sample.");
    },
    onError: (e) => toast.error(errorMessage(e)),
  });
  return (
    <>
      <Section title="Workspace">
        <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-body-sm">
          <dt className="text-text-muted">Name</dt>
          <dd>{workspace?.name}</dd>
          <dt className="text-text-muted">Address</dt>
          <dd className="font-mono">/w/{workspace?.slug}</dd>
          <dt className="text-text-muted">Data</dt>
          <dd>{workspace?.data_mode === "sample" ? "Sample (Northwind Pay)" : workspace?.data_mode}</dd>
          <dt className="text-text-muted">Clock</dt>
          <dd>{workspace?.clock_mode === "simulated" ? "Simulated (change it from the date chip in the top bar)" : "Live"}</dd>
          <dt className="text-text-muted">Your role</dt>
          <dd className="capitalize">{role}</dd>
        </dl>
      </Section>
      {admin && (
        <Section title="Maintenance">
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" loading={run.isPending} onClick={() => run.mutate()}>
              Run Sentinel now
            </Button>
            {workspace?.data_mode === "sample" && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive-outline" loading={reset.isPending}>
                    Reset sample data
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Reset the sample workspace?</AlertDialogTitle>
                    <AlertDialogDescription>Both graphs are rebuilt from Northwind Pay. Decisions, reviews and changes made here are discarded.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => reset.mutate()}>Reset</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </Section>
      )}
    </>
  );
}

function Ai() {
  const api = useApi();
  const qc = useQueryClient();
  const { wsId, workspace, role } = useWorkspace();
  const admin = ROLE_RANK[role] >= ROLE_RANK.admin;
  const set = useMutation({
    mutationFn: (ai_mode: AiMode) => api(wsPath(wsId, "/ai-settings"), { method: "PUT", body: { ai_mode } }),
    onSuccess: () => (qc.invalidateQueries({ queryKey: workspaceQueryKey(wsId) }), toast.success("AI mode saved.")),
    onError: (e) => toast.error(errorMessage(e)),
  });
  return (
    <Section title="AI mode">
      <div role="radiogroup" aria-label="AI mode" className="space-y-2">
        {AI_MODES.map((m) => (
          <label
            key={m.mode}
            className={cn(
              "flex gap-3 rounded-md border p-3",
              workspace?.ai_mode === m.mode ? "border-brand bg-brand-soft" : "border-border-subtle",
              (!m.available || !admin) && "opacity-60",
            )}
          >
            <input type="radio" name="ai" checked={workspace?.ai_mode === m.mode} disabled={!m.available || !admin || set.isPending} onChange={() => set.mutate(m.mode)} className="mt-1" />
            <span>
              <span className="block font-medium">{m.title}</span>
              <span className="block text-body-sm text-text-secondary">{m.body}</span>
            </span>
          </label>
        ))}
      </div>
      {!admin && <p className="mt-3 text-body-sm text-text-muted">Ask an admin to change the AI mode.</p>}
    </Section>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="card-e1 p-5" aria-label={title}>
      <h2 className="mb-4 font-sans text-h3 font-semibold">{title}</h2>
      {children}
    </section>
  );
}
