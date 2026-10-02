import Link from "next/link";
import { Logo } from "@/components/logo";

export function MarketingFooter() {
  return (
    <footer className="border-t border-border-subtle">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <Logo />
          <p className="mt-2 text-body-sm text-text-muted">The exception debt agent.</p>
        </div>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-body-sm text-text-secondary">
            <li>
              <Link href="/terms" className="hover:text-text-primary">
                Terms
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-text-primary">
                Privacy
              </Link>
            </li>
            <li>
              <Link href="/sign-in" className="hover:text-text-primary">
                Sign in
              </Link>
            </li>
          </ul>
        </nav>
        <p className="text-body-sm text-text-muted">© 2026 Reprieve</p>
      </div>
    </footer>
  );
}
