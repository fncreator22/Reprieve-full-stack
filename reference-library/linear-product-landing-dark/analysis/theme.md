# Design System & Theme Analysis: linear.app

## 1. The Surface Ladder & Color Token Architecture

Linear is famous for rejecting arbitrary dark grays in favor of a strictly calibrated **Surface Ladder** built atop a near-black canvas (`#010102`). Depth is communicated by progressing up this ladder, paired with semi-transparent white borders.

```css
:root {
  /* 1. Surfaces & Canvas */
  --linear-canvas: #010102;          /* Deepest atmospheric background */
  --linear-surface-sunken: #08090a;  /* Inset wells, code blocks, search bars */
  --linear-surface-base: #0f1011;    /* Standard card background */
  --linear-surface-raised: #141516;  /* Elevated cards, hover state */
  --linear-surface-overlay: #191a1b; /* Popovers, dropdown menus, modals */
  --linear-surface-highlight: #222326;/* Active items, selected rows */

  /* 2. Text Luminance Hierarchy */
  --linear-text-primary: #f7f8f8;    /* Pure heading, high-contrast title */
  --linear-text-secondary: #d0d6e0;  /* Standard readable body copy */
  --linear-text-tertiary: #8a8f98;   /* Captions, metadata, icons */
  --linear-text-muted: #62666d;      /* Inactive labels, disabled shortcuts */

  /* 3. Hairline Dividers & Moonlight Borders */
  --linear-border-subtle: rgba(255, 255, 255, 0.05);   /* Standard card hairline */
  --linear-border-medium: rgba(255, 255, 255, 0.08);   /* Elevated card border */
  --linear-border-hover: rgba(255, 255, 255, 0.15);    /* Interactive hover border */
  --linear-border-glow: rgba(94, 106, 210, 0.40);      /* Linear purple active glow */

  /* 4. Brand & Accent Chromatics */
  --linear-brand-accent: #5e6ad2;     /* Linear Signature Lavender-Purple */
  --linear-brand-hover: #6f7de3;      /* Interactive lighter hover */
  --linear-brand-deep: #4d55b3;       /* Deeper tone for pressed/gradient roots */
  --linear-brand-subtle: rgba(94, 106, 210, 0.15); /* Accent wash for chips */

  /* 5. Semantic Signal Tokens (Linear Issues & Cycles) */
  --linear-signal-backlog: #8a8f98;   /* Gray: Backlog */
  --linear-signal-todo: #e2b714;      /* Amber / Golden Yellow: Todo */
  --linear-signal-in-progress: #f2994a;/* Orange: In Progress */
  --linear-signal-done: #5e6ad2;      /* Indigo / Purple: Done */
  --linear-signal-canceled: #687076;  /* Strikethrough Muted: Canceled */
  --linear-signal-urgent: #eb5757;    /* Red / Coral: High/Urgent priority */
}
```

---

## 2. Typography Specification (Inter Variable & OpenType Engine)

Linear is an industry benchmark for typographic density. The design system leverages **Inter Variable** with custom OpenType stylistic sets:

### 2.1 Font Families
- **Primary Interface & Marketing:** `Inter`, `-apple-system`, `BlinkMacSystemFont`, `"Segoe UI"`, `Roboto`, `sans-serif`
- **Monospace & Code:** `Berkeley Mono`, `JetBrains Mono`, `ui-monospace`, `monospace`

### 2.2 OpenType Features
Linear applies specific OpenType features globally to eliminate visual ambiguity and tighten glyph geometry:
```css
body {
  font-family: 'Inter', sans-serif;
  font-feature-settings: 'cv01' 1, 'ss03' 1, 'cv02' 1;
  /* cv01: Alternate '1' with serif base */
  /* ss03: Curled lower-case 'r' and clean geometric junctions */
}
```

### 2.3 Typographic Scale & Negative Tracking Matrix

| Level | Size | Weight | Line Height | Tracking (Letter Spacing) | Usage |
|---|---|---|---|---|---|
| **Display Hero** | `72px` (4.5rem) | `590` (Bold) | `1.05` | `-0.04em` (`-2.88px`) | Hero headline ("Linear is a purpose-built tool...") |
| **Section Title** | `48px` (3.0rem) | `510` (Medium) | `1.12` | `-0.03em` (`-1.44px`) | Bento section introductions |
| **Bento Headline** | `24px` (1.5rem) | `510` (Medium) | `1.25` | `-0.02em` (`-0.48px`) | Card primary headers |
| **Body Primary** | `16px` (1.0rem) | `400` (Regular) | `1.50` | `-0.01em` (`-0.16px`) | Descriptive paragraphs |
| **Body Compact** | `14px` (0.875rem) | `400` (Regular) | `1.42` | `0em` | Issue rows, table items, navigation links |
| **Caption / Keycap** | `12px` (0.75rem) | `510` (Medium) | `1.20` | `+0.01em` | Shortcut keycaps, status pills, timestamps |
| **Micro Eyebrow** | `11px` (0.6875rem) | `590` (Bold) | `1.00` | `+0.08em` (Uppercase) | Section category tags ("CYCLES", "ISSUES") |

---

## 3. Background Aurora, Glows & Grid Gradients

Linear achieves its atmospheric dark space through three primary optical layers:

### 3.1 The Ambient Aurora Glow
A diffused elliptical spotlight situated behind the hero stage:
```css
.hero-glow {
  background: radial-gradient(
    ellipse 80% 50% at 50% -20%,
    rgba(120, 119, 198, 0.25),
    rgba(255, 255, 255, 0)
  );
}
```

### 3.2 The Conic Light Beam (Rotating Ray Effect)
A masked, slowly rotating conic gradient providing shimmering directional light:
```css
.hero-light-beam {
  background: conic-gradient(
    from 180deg at 50% 50%,
    transparent 0deg,
    rgba(94, 106, 210, 0.12) 60deg,
    transparent 120deg
  );
  filter: blur(40px);
  mask-image: radial-gradient(circle at 50% 50%, black 20%, transparent 70%);
  animation: beam-spin 24s linear infinite;
}

@keyframes beam-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

### 3.3 The Hairline Mesh Grid
A microscopic background grid overlay that prevents banding on 8-bit displays:
```css
.grid-mesh {
  background-image: 
    linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 32px 32px;
  mask-image: radial-gradient(circle at center, black 40%, transparent 80%);
}
```
