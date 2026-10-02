import { KeyRound } from "lucide-react";

/** Shown on auth pages when no Clerk key is configured (local development without secrets). */
export function AuthNotConfigured() {
  return (
    <section className="card-e1 w-full p-6 text-center shadow-e3">
      <span className="mx-auto mb-4 inline-flex size-10 items-center justify-center rounded-full bg-brand-soft text-brand">
        <KeyRound aria-hidden className="size-5" />
      </span>
      <h1 className="text-h2 font-semibold">Sign-in isn&apos;t configured</h1>
      <p className="mt-2 text-body-sm text-text-secondary">
        Add Clerk keys to <code className="rounded bg-sunken px-1 font-mono">.env.local</code> (see{" "}
        <code className="rounded bg-sunken px-1 font-mono">.env.example</code>), or create temporary development keys with{" "}
        <code className="rounded bg-sunken px-1 font-mono">npx clerk@latest init --accountless</code>, then restart the dev
        server.
      </p>
    </section>
  );
}
