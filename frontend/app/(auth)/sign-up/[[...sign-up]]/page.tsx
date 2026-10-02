import type { Metadata } from "next";
import Link from "next/link";
import { AuthNotConfigured } from "@/components/auth-not-configured";
import { CLERK_ENABLED } from "@/lib/auth-config";
import { SignUp } from "@clerk/nextjs";

export const metadata: Metadata = { title: "Create your account" };

export default function SignUpPage() {
  return (
    <div className="flex w-full flex-col items-center gap-4">
      {CLERK_ENABLED ? <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" fallbackRedirectUrl="/onboarding" /> : <AuthNotConfigured />}
      <p className="max-w-sm text-center text-body-sm text-text-muted">
        By creating an account you agree to the{" "}
        <Link href="/terms" className="text-brand hover:underline">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="text-brand hover:underline">
          Privacy
        </Link>{" "}
        notes.
      </p>
    </div>
  );
}
