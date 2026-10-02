"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, ShieldAlert, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { KIND_LABEL, fromDay, selectClass, toDay, useLookups } from "@/components/exceptions/shared";
import { PageContainer, PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useApi, wsPath } from "@/lib/api";
import { errorMessage } from "@/lib/errors";
import type { ExceptionKind, Ref } from "@/lib/types";
import { useWorkspace } from "@/lib/workspace";

type Draft = {
  id: string;
  title: string;
  kind: ExceptionKind;
  severity: number;
  expires_at: number;
  owner: Ref | null;
  control: Ref | null;
  services: Ref[];
  unresolved: Record<string, string>;
  warnings: string[];
};
const ROLE_RANK = { viewer: 0, member: 1, reviewer: 2, admin: 3, owner: 4 } as const;

/** SCR-P-08: paste a ticket or chat → staged draft with unresolved hints → human approve (FLOW-06). */
export function StagedDrafts() {
  const api = useApi();
  const qc = useQueryClient();
  const { wsId, role } = useWorkspace();
  const [text, setText] = useState("");
  const drafts = useQuery({ queryKey: ["drafts", wsId], queryFn: ({ signal }) => api<Draft[]>(wsPath(wsId, "/exceptions/drafts"), { signal }) });
  const extract = useMutation({
    mutationFn: () => api<Draft>(wsPath(wsId, "/exceptions/ingest-text"), { method: "POST", body: { text } }),
    onSuccess: () => {
      setText("");
      qc.invalidateQueries({ queryKey: ["drafts", wsId] });
      toast.success("Draft staged. Nothing is active until a reviewer approves it.");
    },
    onError: (e) => toast.error(errorMessage(e)),
  });

  return (
    <PageContainer>
      <PageHeader title="Capture from text" subtitle="Paste a ticket or chat thread. Reprieve drafts the exception; a reviewer approves it." />
      <section className="card-e1 space-y-3 p-5" aria-label="Paste text">
        <label htmlFor="paste" className="font-medium">
          Ticket or chat thread
        </label>
        <Textarea id="paste" value={text} onChange={(e) => setText(e.target.value)} className="min-h-60 font-mono text-body-sm" maxLength={20000} placeholder="Paste the conversation where the workaround was approved…" />
        <div className="flex items-center justify-between gap-3">
          <span className="tabular text-caption text-text-muted">{text.length.toLocaleString()} / 20,000</span>
          <Button loading={extract.isPending} disabled={text.trim().length < 20} onClick={() => extract.mutate()}>
            <Sparkles aria-hidden /> Extract draft
          </Button>
        </div>
      </section>

      <section className="space-y-4" aria-label="Staged drafts">
        <h2 className="font-sans text-h3 font-semibold">Staged drafts</h2>
        {drafts.isPending ? (
          <Skeleton className="h-40" />
        ) : !drafts.data?.length ? (
          <p className="text-body-sm text-text-muted">No drafts waiting.</p>
        ) : (
          drafts.data.map((d) => <DraftCard key={d.id} draft={d} canApprove={ROLE_RANK[role] >= ROLE_RANK.reviewer} />)
        )}
      </section>
    </PageContainer>
  );
}

function DraftCard({ draft, canApprove }: { draft: Draft; canApprove: boolean }) {
  const api = useApi();
  const qc = useQueryClient();
  const { wsId } = useWorkspace();
  const { people, services, controls } = useLookups();
  const [owner, setOwner] = useState(draft.owner?.id ?? "");
  const [control, setControl] = useState(draft.control?.id ?? "");
  const [service, setService] = useState(draft.services[0]?.id ?? "");
  const [expires, setExpires] = useState(toDay(draft.expires_at));
  const done = () => {
    qc.invalidateQueries({ queryKey: ["drafts", wsId] });
    qc.invalidateQueries({ queryKey: ["exceptions", wsId] });
  };
  const approve = useMutation({
    mutationFn: () =>
      api(wsPath(wsId, `/exceptions/drafts/${draft.id}/approve`), {
        method: "POST",
        body: { owner_id: owner, control_id: control, service_ids: draft.services.length ? undefined : [service], expires_at: fromDay(expires) },
      }),
    onSuccess: () => (done(), toast.success("Approved. The exception is active.")),
    onError: (e) => toast.error(errorMessage(e)),
  });
  const reject = useMutation({
    mutationFn: () => api(wsPath(wsId, `/exceptions/drafts/${draft.id}/reject`), { method: "POST" }),
    onSuccess: () => (done(), toast("Draft rejected.")),
    onError: (e) => toast.error(errorMessage(e)),
  });
  const u = draft.unresolved;

  return (
    <article className="card-e1 space-y-4 border-dashed p-5">
      <header className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="eyebrow text-text-muted">Draft · {KIND_LABEL[draft.kind]} · severity {draft.severity}</p>
          <h3 className="font-sans text-h3 font-semibold">{draft.title}</h3>
        </div>
      </header>
      {draft.warnings.map((w) => (
        <p key={w} role="note" className="flex gap-2 rounded-md bg-sev-moderate-soft px-3 py-2 text-body-sm">
          <ShieldAlert className="mt-0.5 size-4 shrink-0 text-sev-moderate" aria-hidden /> {w}
        </p>
      ))}
      <div className="grid gap-4 sm:grid-cols-2">
        <Pick label="Owner" hint={u.owner_id} value={owner} onChange={setOwner} options={people.map((p) => [p.id, p.name])} />
        <Pick label="Waived control" hint={u.control_id} value={control} onChange={setControl} options={controls.map((c) => [c.id, c.name])} />
        {draft.services.length ? (
          <div className="text-body-sm">
            <p className="font-medium">Applies to</p>
            <p className="text-text-secondary">{draft.services.map((s) => s.label).join(", ")}</p>
          </div>
        ) : (
          <Pick label="Service" hint={u.service_ids} value={service} onChange={setService} options={services.map((s) => [s.service.id, s.service.label ?? s.service.id])} />
        )}
        <label className="space-y-1.5 text-body-sm">
          <span className="font-medium">Expires</span>
          <input type="date" value={expires} onChange={(e) => setExpires(e.target.value)} className={selectClass} />
          {u.expires_at && <span className="block text-caption text-sev-moderate">{u.expires_at}</span>}
        </label>
      </div>
      {canApprove && (
        <footer className="flex justify-end gap-2">
          <Button variant="ghost" loading={reject.isPending} onClick={() => reject.mutate()}>
            <X aria-hidden /> Reject
          </Button>
          <Button loading={approve.isPending} disabled={!owner || !control || (!draft.services.length && !service)} onClick={() => approve.mutate()}>
            <Check aria-hidden /> Approve
          </Button>
        </footer>
      )}
    </article>
  );
}

function Pick({ label, hint, value, onChange, options }: { label: string; hint?: string; value: string; onChange: (v: string) => void; options: [string, string][] }) {
  return (
    <label className="space-y-1.5 text-body-sm">
      <span className="font-medium">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={selectClass}>
        <option value="">Pick…</option>
        {options.map(([id, name]) => (
          <option key={id} value={id}>
            {name}
          </option>
        ))}
      </select>
      {hint && !value && <span className="block text-caption text-sev-moderate">{hint}</span>}
    </label>
  );
}
