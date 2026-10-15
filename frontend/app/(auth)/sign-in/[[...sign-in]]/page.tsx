/**
 * Authentication Sign-In Screen.
 *
 * Renders Clerk hosted sign-in UI with fallback redirect to Northwind Pay
 * sample sandbox if authentication keys are unconfigured.
 */

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CLERK_ENABLED } from "@/lib/auth-config";
import { SignIn } from "@clerk/nextjs";

export const metadata: Metadata = { title: "Sign in" };

// Clerk keeps ?redirect_url so deep links return where they started (SCR-A-03).
export default function SignInPage() {
  if (!CLERK_ENABLED) {
    redirect("/w/northwind-pay/home");
  }
  return <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" fallbackRedirectUrl="/workspaces" />;
}
