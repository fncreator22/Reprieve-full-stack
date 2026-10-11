# Production Reuse Notes & Recipes: linear.app

This document provides production-verified, battle-tested code recipes, implementation patterns, and design traps discovered while analyzing the Linear landing page and design system.

---

## 1. Recipe: Mouse-Driven Radial Border Glow (`useMouseGlow`)

This recipe creates the signature Linear card illumination effect. A pointer listener tracks mouse position relative to each card and sets `--mouse-x` and `--mouse-y` CSS variables, creating a soft radial spotlight on the surface and along the hairline border.

### 1.1 React TypeScript Hook & Component

```tsx
import React, { useRef, useCallback } from "react";

export function useMouseGlow<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null);

  const handlePointerMove = useCallback((e: React.PointerEvent<T>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty("--mouse-x", `${x}px`);
    el.style.setProperty("--mouse-y", `${y}px`);
  }, []);

  return { ref, onPointerMove: handlePointerMove };
}

interface LinearGlowCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const LinearGlowCard: React.FC<LinearGlowCardProps> = ({
  children,
  className = "",
  ...props
}) => {
  const { ref, onPointerMove } = useMouseGlow<HTMLDivElement>();

  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      className={`group relative rounded-xl border border-white/[0.08] bg-[#0f1011] p-6 overflow-hidden transition-colors ${className}`}
      {...props}
    >
      {/* Dynamic Mouse Spotlight Overlay */}
      <div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(500px circle at var(--mouse-x, -999px) var(--mouse-y, -999px), rgba(255, 255, 255, 0.08), transparent 40%)`,
        }}
      />
      {/* Border Highlight Overlay */}
      <div
        className="pointer-events-none absolute -inset-px rounded-xl border border-white/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100 [mask-image:radial-gradient(300px_circle_at_var(--mouse-x,-999px)_var(--mouse-y,-999px),black,transparent)]"
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};
```

---

## 2. Recipe: Animated Border-Beam / Rotating Conic Border

A pure CSS border-beam solution using modern `@property` that smoothly rotates a beam of light along the card's perimeter without layout reflows.

```css
@property --beam-angle {
  syntax: "<angle>";
  inherits: false;
  initial-value: 0deg;
}

.linear-border-beam {
  position: relative;
  border-radius: 16px;
  border: 1px solid transparent;
  background: 
    linear-gradient(#08090a, #08090a) padding-box,
    conic-gradient(
      from var(--beam-angle),
      transparent 0deg,
      rgba(94, 106, 210, 0.6) 40deg,
      transparent 80deg
    ) border-box;
  animation: rotate-beam 6s linear infinite;
}

@keyframes rotate-beam {
  to {
    --beam-angle: 360deg;
  }
}
```

---

## 3. Recipe: Tactile Keycap Shortcut Engine (`<Keycap />`)

Tactile keycap badge component for rendering single keys and chord sequences.

```tsx
import React from "react";

interface KeycapProps {
  shortcut: string; // e.g. "⌘K", "C", "G I", "ESC"
  className?: string;
}

export const Keycap: React.FC<KeycapProps> = ({ shortcut, className = "" }) => {
  return (
    <kbd
      className={`inline-flex items-center justify-center min-w-[20px] h-[20px] px-1.5 rounded bg-gradient-to-b from-[#1c1d20] to-[#121315] border-t border-white/[0.12] border-b border-black/80 border-x border-white/[0.06] text-[11px] font-mono font-medium text-[#d0d6e0] shadow-[0_1px_1px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.08)] select-none ${className}`}
    >
      {shortcut}
    </kbd>
  );
};
```

---

## 4. Recipe: Full Linear Dark Theme CSS Variables

Drop this into your global stylesheet (e.g. `globals.css`) to immediately establish Linear's color tokens and typography features:

```css
:root {
  /* Surface Ladder */
  --canvas: #010102;
  --surface-sunken: #08090a;
  --surface-base: #0f1011;
  --surface-raised: #141516;
  --surface-overlay: #191a1b;

  /* Text Contrasts */
  --text-primary: #f7f8f8;
  --text-secondary: #d0d6e0;
  --text-tertiary: #8a8f98;
  --text-muted: #62666d;

  /* Hairline Dividers */
  --border-subtle: rgba(255, 255, 255, 0.05);
  --border-medium: rgba(255, 255, 255, 0.08);
  --border-hover: rgba(255, 255, 255, 0.15);

  /* Linear Chromatics */
  --accent-purple: #5e6ad2;
  --accent-purple-hover: #6f7de3;
  --accent-glow: rgba(94, 106, 210, 0.35);

  /* Namespaced aliases for components in design-patterns.md */
  --linear-canvas: var(--canvas);
  --linear-surface-sunken: var(--surface-sunken);
  --linear-surface-base: var(--surface-base);
  --linear-surface-raised: var(--surface-raised);
  --linear-surface-overlay: var(--surface-overlay);
  --linear-text-primary: var(--text-primary);
  --linear-text-secondary: var(--text-secondary);
  --linear-text-tertiary: var(--text-tertiary);
  --linear-border-subtle: var(--border-subtle);
  --linear-border-medium: var(--border-medium);
  --linear-accent: var(--accent-purple);
  --linear-accent-glow: var(--accent-glow);
}

body {
  background-color: var(--canvas);
  color: var(--text-primary);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-feature-settings: 'cv01' 1, 'ss03' 1;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Linear-style Negative Tracking Display Headings */
.linear-display {
  font-weight: 590;
  letter-spacing: -0.04em;
  line-height: 1.05;
}

.linear-title {
  font-weight: 510;
  letter-spacing: -0.03em;
  line-height: 1.15;
}
```

---

## 5. Implementation Traps & Performance Pitfalls

1. **Avoid Layout Thrashing on Pointer Move:**
   Never read DOM properties like `element.offsetWidth` inside a `pointermove` handler. Only compute offsets against the cached `getBoundingClientRect()` or throttle the updates with `requestAnimationFrame`.
2. **Backdrop Blur GPU Overhead on Mobile:**
   Applying `backdrop-blur-md` across multiple overlapping layers can trigger GPU battery drain on low-spec mobile devices. Always disable heavy blurs or gate them using `@media (hover: hover)`.
3. **Accessibility (ARIA Focus):**
   When implementing custom command palettes (`Cmd+K`), ensure you use Radix UI or a properly trapped `role="dialog"` with `aria-modal="true"` and autofocus management so screen readers and keyboard users do not get trapped in an inaccessible loop.
