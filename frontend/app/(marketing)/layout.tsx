import type { ReactNode } from "react";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { Prewarm } from "@/components/marketing/prewarm";
import { SmoothScroll } from "@/components/marketing/smooth-scroll";
import { CommandMenuListener } from "@/components/marketing/command-menu-listener";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="dark relative min-h-screen bg-[#07080a] text-[#f7f8f8] selection:bg-brand selection:text-white">
      {/* Precision Architectural Grid Texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-20 bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_70%,transparent_100%)]"
      />

      {/* Atmospheric Volumetric Lighting Orbs */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[1000px] rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(99,102,241,0.12)_0%,_rgba(7,8,10,0)_70%)] blur-[100px]" />
        <div className="absolute top-[40%] -right-40 h-[500px] w-[600px] rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(34,211,238,0.04)_0%,_rgba(7,8,10,0)_70%)] blur-[120px]" />
        <div className="absolute top-[75%] -left-40 h-[500px] w-[600px] rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(139,92,246,0.05)_0%,_rgba(7,8,10,0)_70%)] blur-[120px]" />
      </div>

      <a
        href="#main"
        className="sr-only z-(--z-splash) rounded-md bg-brand-solid px-4 py-2 text-text-on-brand focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        Skip to content
      </a>
      <Prewarm />
      <SmoothScroll />
      <CommandMenuListener />
      <MarketingNav />
      <main id="main" className="overflow-x-clip">
        {children}
      </main>
      <MarketingFooter />
    </div>
  );
}
