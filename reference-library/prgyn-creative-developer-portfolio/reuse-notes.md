# Production Reuse Notes & Recipes: prgyn.dev

This document provides production-verified recipes, copy-paste patterns, and implementation traps discovered while analyzing `prgyn.dev`.

---

## 1. Recipe: Production-Grade Proximity Variable Typography (`useProximityType`)

Extracted from [`2j7n7o23as5lo.js#L61942`](file:///c:/Users/sr2ma/Documents/github/webdev-hackthon/prgyn_dump/2j7n7o23as5lo.js#L61942). Includes all production performance optimizations:
- `MutationObserver` caching to avoid querying the DOM every frame.
- `IntersectionObserver` viewport gating to bypass calculations when offscreen.
- **Strict integer dirty-checking** (`roundedW !== state.fw || roundedD !== state.fd`) to eliminate layout thrashing.

```typescript
import { useEffect, useRef } from "react";
import gsap from "gsap";

export const letterBoost = new WeakMap<HTMLElement, { b: number }>();

interface ProximityOptions {
  selector?: string;         // Target element selector (default: ".hl")
  radius?: number;           // Interaction field radius in px (default: 380)
  weight?: [number, number]; // [minWeight, maxWeight] default: [300, 800]
  width?: [number, number];  // [minWidth, maxWidth] default: [75, 100]
  enabled?: boolean;
}

export function useProximityType(
  containerRef: React.RefObject<HTMLElement | null>,
  options: ProximityOptions = {}
) {
  const {
    selector = ".hl",
    radius = 380,
    weight = [300, 800],
    width = [75, 100],
    enabled = true,
  } = options;

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !enabled) return;

    const [minW, maxW] = weight;
    const [minD, maxD] = width;
    
    // Internal cache storing current lerp values and last written integers
    const cache = new WeakMap<
      HTMLElement,
      { w: number; d: number; fw?: number; fd?: number }
    >();

    let elements: HTMLElement[] = [];
    let isDirty = true;
    let isVisible = true;
    const mouse = { x: -9999, y: -9999, has: false };

    const onPointerMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.has = true;
    };

    // 1. MutationObserver: Re-query elements ONLY when DOM tree mutates
    const mutationObserver = new MutationObserver(() => {
      isDirty = true;
    });

    // 2. IntersectionObserver: Bypass ticker execution when scrolled out of view
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });

    const tickerCallback = () => {
      if (!isVisible) return;

      if (isDirty) {
        elements = Array.from(container.querySelectorAll<HTMLElement>(selector));
        isDirty = false;
      }

      // Read phase: Collect all bounding rects
      const rects = elements.map((el) => el.getBoundingClientRect());

      // Write phase: Compute lerp and mutate ONLY when rounded integers change
      elements.forEach((el, idx) => {
        const rect = rects[idx];
        let proximity = 0;

        if (mouse.has) {
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const dist = Math.hypot(mouse.x - centerX, mouse.y - centerY);
          proximity = Math.max(0, 1 - dist / radius);
        }

        let state = cache.get(el);
        if (!state) {
          state = { w: minW, d: minD };
          cache.set(el, state);
        }

        // Apply external letter boost if present
        const boost = letterBoost.get(el)?.b ?? 0;
        const targetW = minW + proximity * (maxW - minW) + boost;
        const targetD = minD + proximity * (maxD - minD);

        // Frame-by-frame Lerp smoothing (alpha = 0.2)
        state.w += (targetW - state.w) * 0.2;
        state.d += (targetD - state.d) * 0.2;

        const roundedW = Math.min(maxW, Math.round(state.w));
        const roundedD = Math.round(state.d);

        // CRITICAL DIRTY-CHECK: Only write to DOM if rounded integers changed
        if (roundedW !== state.fw || roundedD !== state.fd) {
          el.style.fontVariationSettings = `'wght' ${roundedW}, 'wdth' ${roundedD}`;
          state.fw = roundedW;
          state.fd = roundedD;
        }
      });
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    mutationObserver.observe(container, { childList: true, subtree: true });
    intersectionObserver.observe(container);
    gsap.ticker.add(tickerCallback);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      mutationObserver.disconnect();
      intersectionObserver.disconnect();
      gsap.ticker.remove(tickerCallback);
    };
  }, [containerRef, selector, radius, weight, width, enabled]);
}
```

---

## 2. Recipe: 2-Phase Retro CRT Cathode Ray Power-On Transition

Extracted from [`3oztndie4w4us.js#L258578`](file:///c:/Users/sr2ma/Documents/github/webdev-hackthon/prgyn_dump/3oztndie4w4us.js#L258578).
Recreates the nostalgic cathode-ray tube expansion with phosphor flash bloom:

```typescript
import gsap from "gsap";

export function playCRTReveal(
  container: HTMLElement, 
  onComplete?: () => void
) {
  const state = { progress: 0 };
  const width = container.clientWidth;
  const height = container.clientHeight;

  gsap.to(state, {
    progress: 1,
    duration: 1.1,
    ease: "none",
    onUpdate: () => {
      const p = state.progress;
      let insetTop = 0;
      let insetRight = 0;
      let insetBottom = 0;
      let insetLeft = 0;
      let brightness = 1;

      if (p <= 0.45) {
        // Phase 1: Horizontal beam stretches across screen
        const beamT = gsap.parseEase("power3.out")(p / 0.45);
        const currentWidth = width * (0.02 + 0.98 * beamT);
        const horizontalInset = (width - currentWidth) / 2;
        
        insetTop = height / 2 - 1.5;
        insetBottom = height / 2 - 1.5;
        insetLeft = horizontalInset;
        insetRight = horizontalInset;
        brightness = 2.2;
      } else {
        // Phase 2: Vertical height opens with blinding phosphor flash decay
        const openT = gsap.parseEase("power3.out")((p - 0.45) / 0.55);
        const verticalInset = (height / 2) * (1 - openT);
        
        insetTop = verticalInset;
        insetBottom = verticalInset;
        insetLeft = 0;
        insetRight = 0;
        brightness = 1 + 2.5 * (1 - (p - 0.45) / 0.55);
      }

      container.style.clipPath = `inset(${insetTop}px ${insetRight}px ${insetBottom}px ${insetLeft}px round 4px)`;
      container.style.filter = `brightness(${brightness})`;
    },
    onComplete: () => {
      container.style.clipPath = "none";
      container.style.filter = "none";
      onComplete?.();
    }
  });
}
```

---

## 3. Recipe: Scroll Velocity 3D Inertial Banking

Extracted from [`3oztndie4w4us.js#L156727`](file:///c:/Users/sr2ma/Documents/github/webdev-hackthon/prgyn_dump/3oztndie4w4us.js#L156727).
Smoothly tilts a 3D stage or card based on how fast the user is scrolling:

```typescript
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function setupVelocityBanking(target: HTMLElement) {
  const bank = { targetAngle: 0, currentAngle: 0 };

  const trigger = ScrollTrigger.create({
    onUpdate: (self) => {
      // Clamp tilt between -9deg and +9deg
      bank.targetAngle = gsap.utils.clamp(-9, 9, -self.getVelocity() / 260);
    }
  });

  const ticker = () => {
    // Smooth lerp (alpha = 0.08)
    bank.currentAngle += (bank.targetAngle - bank.currentAngle) * 0.08;
    // Decay target back to zero
    bank.targetAngle *= 0.92;

    if (Math.abs(bank.currentAngle) > 0.01) {
      gsap.set(target, { rotationY: bank.currentAngle });
    }
  };

  gsap.ticker.add(ticker);

  return () => {
    trigger.kill();
    gsap.ticker.remove(ticker);
  };
}
```

---

## 4. Key Traps & Pitfalls to Avoid

1. **Unthrottled Canvas Animations:**
   Never leave canvas render loops running when their parent section is offscreen. Always attach an `IntersectionObserver` to halt animation tickers.
2. **Missing `pointerEvents` Coalescing:**
   On modern iPad Pro or 144Hz–240Hz gaming monitors, standard pointer events report only once per browser frame (16.6ms), resulting in jagged freehand lines. Always consume `e.getCoalescedEvents?.() ?? [e]` to capture high-density strokes.
3. **Overusing SVG Filters:**
   Applying `feDisplacementMap` or `feTurbulence` to large DOM elements causes severe compositing stutter on mobile Safari. Use 2D Canvas context rendering for complex noise or shaders instead of whole-page SVG filters.
