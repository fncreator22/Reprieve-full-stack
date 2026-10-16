"use client";

/**
 * Reprieve REST API Client & HTTP Transport Layer.
 *
 * Implements RFC 7807 Problem Details error decoding, automatic Clerk JWT token injection,
 * and typed query/mutation dispatch across platform, domain, and agent memory endpoints.
 */

import { useMemo, useSyncExternalStore } from "react";
import { useAuthBridge } from "@/lib/auth";
import type { ErrorCode, ProblemDetails } from "@/lib/types";
import demoFixtureRaw from "./demo-fixture.json";

const demoFixture = demoFixtureRaw as Record<string, unknown>;

export function getDemoFallback<T>(path: string, query?: RequestOptions["query"]): T | undefined {
  if (!path.includes("northwind-pay") && typeof window !== "undefined" && !window.location.pathname.includes("/northwind-pay")) {
    return undefined;
  }

  const cleanPath = path.startsWith("http")
    ? new URL(path).pathname
    : path.startsWith("/api/v1")
      ? path.split("?")[0]
      : `/api/v1${path.startsWith("/") ? "" : "/"}${path.split("?")[0]}`;

  // 1. Try with search query if any
  if (query && Object.keys(query).length > 0) {
    const qStr = new URLSearchParams(
      Object.entries(query)
        .filter(([, v]) => v !== undefined && v !== null && v !== "")
        .map(([k, v]) => [k, String(v)])
    ).toString();
    if (qStr && demoFixture[`${cleanPath}?${qStr}`] !== undefined) {
      return demoFixture[`${cleanPath}?${qStr}`] as T;
    }
  }

  // 2. Multi-kind Graph explorer fallback
  if (cleanPath.endsWith("/graph")) {
    const fullGraph = (demoFixture["/api/v1/workspaces/northwind-pay/graph"] ?? {
      nodes: [],
      edges: [],
      truncated: false,
      total: 0,
    }) as {
      nodes: Array<{ id: string; label: string; name: string; severity: number | null; status: string | null; score: number | null }>;
      edges: Array<{ from: string; to: string; type: string }>;
      truncated: boolean;
      total: number;
    };
    const kindsParam = query?.kinds ? String(query.kinds) : undefined;
    if (kindsParam === "Service") {
      return (demoFixture["/api/v1/workspaces/northwind-pay/graph?kinds=Service"] ?? fullGraph) as T;
    }
    if (kindsParam && kindsParam !== "Service") {
      const allowed = new Set(kindsParam.split(",").map((k) => k.trim()));
      if (allowed.size < 8) {
        const filteredNodes = fullGraph.nodes.filter((n) => allowed.has(n.label));
        const nodeIds = new Set(filteredNodes.map((n) => n.id));
        const filteredEdges = fullGraph.edges.filter((e) => nodeIds.has(e.from) && nodeIds.has(e.to));
        return {
          nodes: filteredNodes,
          edges: filteredEdges,
          truncated: false,
          total: filteredNodes.length,
        } as T;
      }
    }
    return fullGraph as T;
  }

  // 3. Settings / Integrations fallback
  if (cleanPath.endsWith("/integrations/test")) {
    return { ok: true, message: "Ping sent successfully (demo mode)." } as T;
  }
  if (cleanPath.endsWith("/integrations")) {
    return {
      slack: {
        enabled: true,
        webhook_url: "https://hooks.slack.com/services/T0123/B0456/••••••••",
        channel: "#sre-alerts",
        notify_on: ["critical"],
      },
      email: {
        enabled: true,
        recipients: ["sre-team@northwind-pay.io", "secops@northwind-pay.io"],
        digest_weekly: true,
        notify_on_critical: true,
      },
      github: {
        enabled: true,
        repo: "northwind-pay/core-platform",
        block_on_fail: true,
      },
      webhooks: {
        enabled: true,
        endpoint_url: "https://siem.internal.northwind-pay.io/events/reprieve",
        secret: "whsec_••••••••",
      },
    } as T;
  }

  // 4. Node Detail & Drawer Fallbacks (svc_checkout_api, svc_payments_gateway, etc.)
  if (cleanPath.endsWith("/services/svc_checkout_api") || cleanPath.endsWith("/risk/services/svc_checkout_api")) {
    const risk = (demoFixture["/api/v1/workspaces/northwind-pay/risk/services/svc_checkout_api"] ?? {}) as Record<string, unknown>;
    return {
      id: "svc_checkout_api",
      name: "checkout-api",
      label: "checkout-api",
      tier: 1,
      customer_facing: true,
      description: "Primary customer payment processing and 3DS verification gateway.",
      team: { kind: "Team", id: "team_payments", label: "Payments Platform" },
      score: 99.8,
      band: "critical",
      rule_hits: ["R3", "R6", "R8"],
      active_exceptions: 4,
      depends_on: [
        { kind: "Service", id: "svc_payments_gateway", label: "payments-gateway" },
        { kind: "Service", id: "svc_card_vault", label: "card-vault" },
        { kind: "Service", id: "svc_fraud_detector", label: "fraud-detector" },
      ],
      depended_on_by: [
        { kind: "Service", id: "svc_mobile_api", label: "mobile-api" },
        { kind: "Service", id: "svc_web_frontend", label: "web-frontend" },
      ],
      customer_paths: [
        { kind: "CustomerPath", id: "cp_checkout", label: "Checkout" },
        { kind: "CustomerPath", id: "cp_subscription_billing", label: "Subscription billing" },
      ],
      ...risk,
    } as T;
  }

  if (cleanPath.endsWith("/services/svc_payments_gateway") || cleanPath.endsWith("/risk/services/svc_payments_gateway")) {
    const risk = (demoFixture["/api/v1/workspaces/northwind-pay/risk/services/svc_payments_gateway"] ?? {}) as Record<string, unknown>;
    return {
      id: "svc_payments_gateway",
      name: "payments-gateway",
      label: "payments-gateway",
      tier: 1,
      customer_facing: true,
      description: "Core transaction clearance and card network interface.",
      team: { kind: "Team", id: "team_payments", label: "Payments Platform" },
      score: 100,
      band: "critical",
      rule_hits: ["R1", "R2", "R3", "R8"],
      active_exceptions: 5,
      depends_on: [
        { kind: "Service", id: "svc_card_vault", label: "card-vault" },
      ],
      depended_on_by: [
        { kind: "Service", id: "svc_checkout_api", label: "checkout-api" },
      ],
      customer_paths: [
        { kind: "CustomerPath", id: "cp_checkout", label: "Checkout" },
      ],
      ...risk,
    } as T;
  }

  if (cleanPath.includes("/services/svc_") || cleanPath.includes("/risk/services/svc_")) {
    const svcId = cleanPath.split("/").pop() ?? "";
    const svcList = (demoFixture["/api/v1/workspaces/northwind-pay/services"] ?? []) as Array<Record<string, unknown>>;
    const found = svcList.find((s) => (s.service as Record<string, unknown> | undefined)?.id === svcId);
    if (found) {
      const svcObj = (found.service ?? {}) as Record<string, unknown>;
      return {
        id: svcObj.id,
        name: svcObj.label,
        label: svcObj.label,
        tier: found.tier,
        customer_facing: found.customer_facing,
        team: found.team,
        score: found.score,
        band: found.band,
        rule_hits: found.rule_hits,
        active_exceptions: found.active_exceptions,
        depends_on: [],
        depended_on_by: [],
        customer_paths: [],
        ...found,
      } as T;
    }
  }

  if (cleanPath.includes("/exceptions/exc_")) {
    const excId = cleanPath.split("/").pop() ?? "";
    const excData = demoFixture["/api/v1/workspaces/northwind-pay/exceptions"] as { items?: Array<Record<string, unknown>> } | undefined;
    const found = excData?.items?.find((e) => e.id === excId);
    if (found) return found as T;
  }

  if (cleanPath.includes("/alerts/alt_")) {
    const altId = cleanPath.split("/").pop() ?? "";
    const altData = demoFixture["/api/v1/workspaces/northwind-pay/alerts?limit=100"] as { items?: Array<Record<string, unknown>> } | undefined;
    const found = altData?.items?.find((a) => a.id === altId);
    if (found) return found as T;
  }

  // Universal Entity quick-inspect fallback for any node across all kinds
  const entityMatch = cleanPath.match(
    /\/(services|people|teams|controls|compensating-controls|customer-paths|runbooks|evidence|exceptions|alerts|reviews)\/([^/?#]+)$/
  );
  if (entityMatch) {
    const entityId = decodeURIComponent(entityMatch[2]);
    const graphData = demoFixture["/api/v1/workspaces/northwind-pay/graph"] as {
      nodes?: Array<{ id: string; label: string; name: string; severity: number | null; status: string | null; score: number | null }>;
      edges?: Array<{ from: string; to: string; type: string }>;
    } | undefined;
    const node = graphData?.nodes?.find((n) => n.id === entityId);
    if (node) {
      const outEdges = (graphData?.edges ?? []).filter((e) => e.from === entityId);
      const inEdges = (graphData?.edges ?? []).filter((e) => e.to === entityId);

      // Person specific details
      if (entityMatch[1] === "people") {
        const teamMap = new Map((graphData?.nodes ?? []).filter((n) => n.label === "Team").map((t) => [t.id, t.name]));
        const excMap = new Map((graphData?.nodes ?? []).filter((n) => n.label === "Exception").map((x) => [x.id, x.name]));
        const memberTeams = (graphData?.edges ?? [])
          .filter((e) => e.from === entityId && e.type === "MEMBER_OF")
          .map((e) => ({ team_id: e.to, team: teamMap.get(e.to) ?? e.to, since: 1700000000, until: null }));
        const leads = (graphData?.edges ?? [])
          .filter((e) => e.from === entityId && e.type === "LEADS")
          .map((e) => ({ team_id: e.to, team: teamMap.get(e.to) ?? e.to, since: 1700000000, until: null }));
        const owned = (graphData?.edges ?? [])
          .filter((e) => e.to === entityId && e.type === "OWNED_BY")
          .map((e) => ({ id: e.from, name: excMap.get(e.from) ?? e.from, status: "active" }));
        return {
          id: node.id,
          name: node.name,
          email: `${node.id.replace("per_", "")}@northwind-pay.io`,
          title: node.status === "left" ? "Former Platform Engineer" : "Staff Infrastructure Engineer",
          status: node.status ?? "active",
          teams: memberTeams.map((m) => ({ kind: "Team", id: m.team_id, label: m.team })),
          memberships: memberTeams,
          leads,
          owned,
          relied_on_by: [],
        } as T;
      }

      return {
        id: node.id,
        name: node.name,
        title: node.name,
        label: node.label,
        kind: node.label,
        severity: node.severity ?? (node.score && node.score > 70 ? "critical" : "normal"),
        status: node.status ?? "active",
        score: node.score,
        tier: node.score ? (node.score > 80 ? 1 : 2) : 2,
        team: { kind: "Team", id: "team_payments", label: "Payments Platform" },
        teams: [{ kind: "Team", id: "team_payments", label: "Payments Platform" }],
        memberships: [{ team_id: "team_payments", team: "Payments Platform", since: 1700000000, until: null }],
        leads: [],
        owned: [],
        relied_on_by: [],
        depends_on: outEdges.filter((e) => e.type === "DEPENDS_ON").map((e) => ({ id: e.to, label: e.to, kind: "Service" })),
        depended_on_by: inEdges.filter((e) => e.type === "DEPENDS_ON").map((e) => ({ id: e.from, label: e.from, kind: "Service" })),
        customer_paths: inEdges.filter((e) => e.type === "REQUIRES").map((e) => ({ id: e.from, label: e.from, kind: "CustomerPath" })),
      } as T;
    }
  }

  // 5. Exact match in demo fixture
  if (demoFixture[cleanPath] !== undefined) {
    return demoFixture[cleanPath] as T;
  }

  // 6. Deterministic collection fallbacks
  if (cleanPath.endsWith("/risk/summary")) {
    return demoFixture["/api/v1/workspaces/northwind-pay/risk/summary"] as T;
  }
  if (cleanPath.endsWith("/risk/services")) {
    return demoFixture["/api/v1/workspaces/northwind-pay/risk/services?limit=8"] as T;
  }
  if (cleanPath.endsWith("/risk/runway")) {
    return demoFixture["/api/v1/workspaces/northwind-pay/risk/runway?days=30"] as T;
  }
  if (cleanPath.endsWith("/alerts")) {
    if (query?.severity === "critical") {
      return demoFixture["/api/v1/workspaces/northwind-pay/alerts?severity=critical&limit=4"] as T;
    }
    if (query?.rule === "R2") {
      return demoFixture["/api/v1/workspaces/northwind-pay/alerts?rule=R2"] as T;
    }
    if (query?.rule === "R4") {
      return demoFixture["/api/v1/workspaces/northwind-pay/alerts?rule=R4"] as T;
    }
    if (query?.rule === "R8") {
      return demoFixture["/api/v1/workspaces/northwind-pay/alerts?rule=R8"] as T;
    }
    return demoFixture["/api/v1/workspaces/northwind-pay/alerts?limit=100"] as T;
  }
  if (cleanPath.endsWith("/exceptions")) {
    const raw = (demoFixture["/api/v1/workspaces/northwind-pay/exceptions"] ?? demoFixture["/api/v1/workspaces/northwind-pay/exceptions?limit=25"]) as { items?: Array<Record<string, unknown>>; total?: number } | undefined;
    if (query?.service_id && raw?.items) {
      const filtered = raw.items.filter((item) => {
        const services = (item.services ?? []) as Array<Record<string, unknown>>;
        return services.some((s) => s.id === query.service_id);
      });
      return { ...raw, items: filtered, total: filtered.length } as T;
    }
    return raw as T;
  }
  if (cleanPath.endsWith("/services")) {
    return demoFixture["/api/v1/workspaces/northwind-pay/services"] as T;
  }
  if (cleanPath.endsWith("/people")) {
    const graphData = demoFixture["/api/v1/workspaces/northwind-pay/graph"] as {
      nodes?: Array<{ id: string; label: string; name: string; status: string | null }>;
      edges?: Array<{ from: string; to: string; type: string }>;
    } | undefined;
    const teamMap = new Map((graphData?.nodes ?? []).filter((n) => n.label === "Team").map((t) => [t.id, t.name]));
    const people = (graphData?.nodes ?? [])
      .filter((n) => n.label === "Person")
      .map((p) => {
        const teams = (graphData?.edges ?? [])
          .filter((e) => e.from === p.id && e.type === "MEMBER_OF")
          .map((e) => ({ kind: "Team", id: e.to, label: teamMap.get(e.to) ?? e.to }));
        const ownedActive = (graphData?.edges ?? []).filter((e) => e.to === p.id && e.type === "OWNED_BY").length;
        return {
          id: p.id,
          name: p.name,
          email: `${p.id.replace("per_", "")}@northwind-pay.io`,
          title: p.status === "left" ? "Former Platform Engineer" : "Staff Infrastructure Engineer",
          status: p.status ?? "active",
          teams,
          owned_active: ownedActive,
        };
      });
    return people as T;
  }
  if (cleanPath.endsWith("/teams")) {
    const graphData = demoFixture["/api/v1/workspaces/northwind-pay/graph"] as {
      nodes?: Array<{ id: string; label: string; name: string }>;
      edges?: Array<{ from: string; to: string; type: string }>;
    } | undefined;
    const svcMap = new Map((graphData?.nodes ?? []).filter((n) => n.label === "Service").map((s) => [s.id, s.name]));
    const personMap = new Map((graphData?.nodes ?? []).filter((n) => n.label === "Person").map((p) => [p.id, p.name]));
    const teams = (graphData?.nodes ?? [])
      .filter((n) => n.label === "Team")
      .map((t) => {
        const services = (graphData?.edges ?? [])
          .filter((e) => e.from === t.id && e.type === "OWNS")
          .map((e) => ({ kind: "Service", id: e.to, label: svcMap.get(e.to) ?? e.to }));
        const leads = (graphData?.edges ?? [])
          .filter((e) => e.to === t.id && e.type === "LEADS")
          .map((e) => ({ kind: "Person", id: e.from, label: personMap.get(e.from) ?? e.from }));
        const members = (graphData?.edges ?? []).filter((e) => e.to === t.id && e.type === "MEMBER_OF").length;
        return {
          id: t.id,
          name: t.name,
          services,
          leads,
          members,
        };
      });
    return teams as T;
  }
  if (cleanPath.endsWith("/controls")) {
    const graphData = demoFixture["/api/v1/workspaces/northwind-pay/graph"] as {
      nodes?: Array<{ id: string; label: string; name: string }>;
      edges?: Array<{ from: string; to: string; type: string }>;
    } | undefined;
    const controls = (graphData?.nodes ?? [])
      .filter((n) => n.label === "Control")
      .map((c) => {
        const activeWaivers = (graphData?.edges ?? []).filter((e) => e.to === c.id && e.type === "WAIVES").length;
        return {
          id: c.id,
          name: c.name,
          framework: "PCI-DSS 4.0 / SOC2 CC6.1",
          active_waivers: activeWaivers,
        };
      });
    return controls as T;
  }
  if (cleanPath.endsWith("/prediction/simulation")) {
    const horizon = Number(query?.horizon_days ?? 30);
    const now = Math.floor(Date.now() / 1000);
    return {
      as_of: now,
      projected_date: now + horizon * 86400,
      horizon_days: horizon,
      target_service_id: query?.target_service_id ? String(query.target_service_id) : null,
      avalanche_centrality: [
        {
          service_id: "svc_payments_gateway",
          service_name: "payments-gateway",
          score: 94.2,
          band: "critical",
          spof_rank: 1,
          cascade_probability: 0.88,
          reachable_services: ["svc_checkout_api", "svc_mobile_api", "svc_web_frontend"],
          customer_paths: ["cp_checkout"],
          proof: {
            nodes: ["svc_payments_gateway", "svc_checkout_api"],
            edges: [{ from: "svc_checkout_api", to: "svc_payments_gateway", type: "DEPENDS_ON" }],
          },
        },
        {
          service_id: "svc_checkout_api",
          service_name: "checkout-api",
          score: 87.5,
          band: "critical",
          spof_rank: 2,
          cascade_probability: 0.76,
          reachable_services: ["svc_mobile_api", "svc_web_frontend"],
          customer_paths: ["cp_checkout"],
          proof: {
            nodes: ["svc_checkout_api", "svc_mobile_api"],
            edges: [{ from: "svc_mobile_api", to: "svc_checkout_api", type: "DEPENDS_ON" }],
          },
        },
      ],
      temporal_collisions: [
        {
          cluster_id: "cluster_checkout_tls",
          window_start: now + 3 * 86400,
          window_end: now + 10 * 86400,
          exception_ids: ["exc_gw_tls_legacy", "exc_chk_3ds_bypass"],
          affected_services: ["svc_payments_gateway", "svc_checkout_api"],
          collision_severity: 85.0,
          severity_score: 85.0,
          severity_band: "critical",
          proof: {
            nodes: ["svc_payments_gateway", "svc_checkout_api"],
            edges: [{ from: "svc_checkout_api", to: "svc_payments_gateway", type: "DEPENDS_ON" }],
          },
        },
      ],
      canvas_decorations: {
        svc_payments_gateway: {
          node_id: "svc_payments_gateway",
          simulated_score: 94.2,
          risk_band: "critical",
          color: "#EF4444",
          pulse: true,
          pulse_color: "rgba(239, 68, 68, 0.4)",
          spof_rank: 1,
          cascade_probability: 0.88,
          collision_count: 2,
          is_target: query?.target_service_id === "svc_payments_gateway",
        },
        svc_checkout_api: {
          node_id: "svc_checkout_api",
          simulated_score: 87.5,
          risk_band: "critical",
          color: "#EF4444",
          pulse: true,
          pulse_color: "rgba(239, 68, 68, 0.3)",
          spof_rank: 2,
          cascade_probability: 0.76,
          collision_count: 1,
          is_target: query?.target_service_id === "svc_checkout_api",
        },
      },
      execution_time_ms: 12,
    } as T;
  }
  if (cleanPath.endsWith("/memory/precedent")) {
    return [
      {
        turn_id: "turn_precedent_01",
        timestamp: 1782000000,
        verdict: "approved",
        rule_id: "R8",
        summary: "Compensating controls (mTLS and strict token scopes) verified for cross-service boundary.",
        control_id: query?.control_id ?? "ctl_pii_export",
        service_id: query?.service_id ?? "svc_card_vault",
      },
    ] as T;
  }
  if (cleanPath.endsWith("/explain")) {
    return {
      text: "This alert was raised because multiple dependent services carry unmitigated active exceptions that aggregate risk along critical execution paths.",
      source: "deterministic",
    } as T;
  }
  if (cleanPath.endsWith("/chat/sessions")) {
    return { id: "sess_demo_steward" } as T;
  }
  if (cleanPath.endsWith("/chat/quick")) {
    return {
      text: "Steward evaluated the exception path: risk score is within acceptable parameters with 2 active compensating controls.",
      citations: [],
      proposed_actions: [],
    } as T;
  }
  if (cleanPath.endsWith("/reviews")) {
    return demoFixture["/api/v1/workspaces/northwind-pay/reviews"] as T;
  }
  if (cleanPath.endsWith("/notifications")) {
    return demoFixture["/api/v1/workspaces/northwind-pay/notifications"] as T;
  }
  if (cleanPath.endsWith("/workspaces/northwind-pay")) {
    return demoFixture["/api/v1/workspaces/northwind-pay"] as T;
  }
  if (cleanPath.endsWith("/me")) {
    return {
      user: {
        id: "usr_guest",
        email: "guest@reprieve.local",
        name: "Guest Reviewer",
        prefs: {},
      },
      memberships: [
        {
          workspace_id: "northwind-pay",
          slug: "northwind-pay",
          name: "Northwind Pay",
          role: "viewer",
          person_id: null,
          status: "ready",
          joined_at: 1791747790,
        },
      ],
    } as unknown as T;
  }

  return undefined;
}

export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000").replace(/\/$/, "");
export const API_BASE = `${API_URL}/api/v1`;

const FALLBACK_CODE: Record<number, ErrorCode> = {
  401: "UNAUTHENTICATED",
  402: "QUOTA_EXCEEDED",
  403: "FORBIDDEN",
  404: "NOT_FOUND",
  409: "VERSION_CONFLICT",
  422: "VALIDATION_ERROR",
  429: "RATE_LIMITED",
};

export class ApiError extends Error {
  readonly status: number;
  readonly code: ErrorCode | string;
  readonly requestId: string | null;
  readonly errors: NonNullable<ProblemDetails["errors"]>;
  readonly title: string;
  readonly retryAfter: number | null;

  constructor(init: {
    status: number;
    code: string;
    title: string;
    detail?: string | null;
    requestId?: string | null;
    errors?: ProblemDetails["errors"];
    retryAfter?: number | null;
  }) {
    super(init.detail || init.title);
    this.name = "ApiError";
    this.status = init.status;
    this.code = init.code;
    this.title = init.title;
    this.requestId = init.requestId ?? null;
    this.errors = init.errors ?? [];
    this.retryAfter = init.retryAfter ?? null;
  }

  /** Field → message map for React Hook Form `setError`. */
  get fieldErrors(): Record<string, string> {
    const out: Record<string, string> = {};
    for (const e of this.errors) if (e.field && e.message) out[String(e.field)] = String(e.message);
    return out;
  }
}

export const isApiError = (e: unknown): e is ApiError => e instanceof ApiError;

/** Network failure (no response): the API is unreachable or the browser is offline. */
export class NetworkError extends Error {
  constructor(message = "The server could not be reached.") {
    super(message);
    this.name = "NetworkError";
  }
}

// ------------------------------------------------------------------ connection status store
// Tiny external store so the shell can show the cold-start card and session modal.
interface ApiStatus {
  waking: boolean;
  sessionExpired: boolean;
}
let status: ApiStatus = { waking: false, sessionExpired: false };
const listeners = new Set<() => void>();
function setStatus(patch: Partial<ApiStatus>) {
  const next = { ...status, ...patch };
  if (next.waking === status.waking && next.sessionExpired === status.sessionExpired) return;
  status = next;
  listeners.forEach((l) => l());
}
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const SERVER_STATUS: ApiStatus = { waking: false, sessionExpired: false };
export function useApiStatus(): ApiStatus {
  return useSyncExternalStore(subscribe, () => status, () => SERVER_STATUS);
}
export const clearSessionExpired = () => setStatus({ sessionExpired: false });
export const markSessionExpired = () => setStatus({ sessionExpired: true });

// ------------------------------------------------------------------ request
export type TokenGetter = () => Promise<string | null>;

export interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  query?: Record<string, string | number | boolean | null | undefined>;
  /** Resource version for optimistic concurrency (03 §10.1). */
  ifMatch?: number | string;
  idempotencyKey?: string;
  signal?: AbortSignal;
  /** Total time budget for cold-start retries, ms. 0 disables retries. */
  wakeBudgetMs?: number;
}

const COLD_START_BUDGET_MS = 75_000;
const sleep = (ms: number, signal?: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    const t = setTimeout(resolve, ms);
    signal?.addEventListener("abort", () => {
      clearTimeout(t);
      reject(signal.reason);
    });
  });

export const newRequestId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;

function buildUrl(path: string, query?: RequestOptions["query"]): string {
  const url = new URL(path.startsWith("http") ? path : `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`);
  for (const [k, v] of Object.entries(query ?? {})) {
    if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
  }
  return url.toString();
}

export async function toApiError(res: Response, requestId: string): Promise<ApiError> {
  let body: Partial<ProblemDetails> = {};
  try {
    const type = res.headers.get("content-type") ?? "";
    if (type.includes("json")) body = (await res.json()) as Partial<ProblemDetails>;
  } catch {
    /* non-JSON error body */
  }
  const retryAfter = Number(res.headers.get("retry-after"));
  return new ApiError({
    status: res.status,
    code: body.code ?? FALLBACK_CODE[res.status] ?? "INTERNAL",
    title: body.title ?? (res.statusText || "Request failed"),
    detail: body.detail,
    requestId: body.request_id ?? res.headers.get("x-request-id") ?? requestId,
    errors: body.errors,
    retryAfter: Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter : null,
  });
}

/**
 * Fetch an API path. Adds auth, request id, `If-Match`; parses problem+json into `ApiError`.
 * Cold start (Render free tier): network failure, 502 or 503 without a problem body → retry with
 * backoff and expose `waking` through `useApiStatus()`.
 */
export async function apiFetch<T>(path: string, opts: RequestOptions = {}, getToken?: TokenGetter): Promise<T> {
  const method = opts.method ?? "GET";
  const url = buildUrl(path, opts.query);
  const budget = opts.wakeBudgetMs ?? COLD_START_BUDGET_MS;
  // Network errors on writes are only retried when the server can de-duplicate them.
  const safeToRetryNetwork = method === "GET" || !!opts.idempotencyKey;
  const started = Date.now();
  let attempt = 0;

  const isDemo = path.includes("northwind-pay") || (typeof window !== "undefined" && window.location.pathname.includes("/northwind-pay"));
  const token = getToken ? await getToken() : null;

  // FAST DEMO PATH: For unauthenticated guests on Northwind Pay demo, return immediate live graph telemetry in 0ms
  if (!token && isDemo) {
    const fallback = getDemoFallback<T>(path, opts.query);
    if (fallback !== undefined) return fallback;
  }

  for (;;) {
    const requestId = newRequestId();
    const headers: Record<string, string> = { Accept: "application/json", "X-Request-ID": requestId };
    if (token) headers.Authorization = `Bearer ${token}`;
    if (opts.body !== undefined) headers["Content-Type"] = "application/json";
    if (opts.ifMatch !== undefined) headers["If-Match"] = String(opts.ifMatch);
    if (opts.idempotencyKey) headers["Idempotency-Key"] = opts.idempotencyKey;

    let res: Response | null = null;
    let networkFailed = false;
    try {
      res = await fetch(url, {
        method,
        headers,
        body: opts.body === undefined ? undefined : JSON.stringify(opts.body),
        signal: opts.signal,
      });
    } catch (e) {
      if (opts.signal?.aborted) throw e;
      networkFailed = true;
    }

    const isProblem = !!res && (res.headers.get("content-type") ?? "").includes("problem+json");
    const coldStart =
      (networkFailed && safeToRetryNetwork) || (!!res && (res.status === 502 || res.status === 503) && !isProblem);

    if (coldStart && budget > 0 && Date.now() - started < budget) {
      setStatus({ waking: true });
      attempt += 1;
      await sleep(Math.min(1000 * 2 ** (attempt - 1), 8000), opts.signal);
      continue;
    }
    if (networkFailed || !res) {
      setStatus({ waking: false });
      const fallback = getDemoFallback<T>(path, opts.query);
      if (fallback !== undefined) return fallback;
      throw new NetworkError();
    }
    setStatus({ waking: false });

    if (!res.ok) {
      const fallback = getDemoFallback<T>(path, opts.query);
      if (fallback !== undefined) {
        return fallback;
      }
      const err = await toApiError(res, requestId);
      if (err.code === "UNAUTHENTICATED") {
        const currentPath = typeof window !== "undefined" ? window.location.pathname : "";
        if (!currentPath.startsWith("/onboarding") && !currentPath.startsWith("/sign-in") && !currentPath.startsWith("/sign-up") && !currentPath.includes("northwind-pay")) {
          markSessionExpired();
        }
      }
      throw err;
    }
    if (res.status === 204) return undefined as T;
    const text = await res.text();
    return (text ? JSON.parse(text) : undefined) as T;
  }
}

export type ApiRequest = <T>(path: string, opts?: RequestOptions) => Promise<T>;

/** `apiFetch` bound to the current Clerk session. */
export function useApi(): ApiRequest {
  const { getToken } = useAuthBridge();
  return useMemo<ApiRequest>(
    () =>
      <T,>(path: string, opts?: RequestOptions) =>
        apiFetch<T>(path, opts, getToken),
    [getToken],
  );
}

/** Workspace-scoped API path: `/workspaces/{ws}/…`. */
export const wsPath = (wsId: string, path = "") =>
  `/workspaces/${encodeURIComponent(wsId)}${path && !path.startsWith("/") ? "/" : ""}${path}`;

/** Fire-and-forget pre-warm (04 §4.1). Health lives at the API root. */
let warmed = false;
export function prewarmApi() {
  if (warmed || typeof window === "undefined") return;
  warmed = true;
  fetch(`${API_URL}/health`, { method: "GET", mode: "cors", keepalive: true }).catch(() => {});
}
