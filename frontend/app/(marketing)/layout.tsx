import type { ReactNode } from "react";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { Prewarm } from "@/components/marketing/prewarm";
import { SmoothScroll } from "@/components/marketing/smooth-scroll";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="sr-only z-(--z-splash) rounded-md bg-brand-solid px-4 py-2 text-text-on-brand focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        Skip to content
      </a>
      <Prewarm />
      <SmoothScroll />
      <MarketingNav />
      <main id="main" className="overflow-x-clip">
        {children}
      </main>
      <MarketingFooter />
    </>
  );
}
