/**
 * Authentication Configuration.
 *
 * Clerk is enabled when a publishable key is configured (real keys, or temporary development keys
 * from `npx clerk@latest init --accountless`). Without one the app still builds and renders, and API
 * calls go out unauthenticated (the API answers 401 and the session modal explains).
 * Plain module (no "use client") so server components, route handlers, and proxy read the real value.
 */
export const CLERK_ENABLED: boolean = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
