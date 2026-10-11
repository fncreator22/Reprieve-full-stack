# Interaction & Design Patterns Analysis: linear.app

## 1. Mouse-Following Radial Glow System (Interactive Spotlights)

A hallmark of the Linear landing page is that cards and containers do not use flat static hover states; instead, they dynamically illuminate as the user's cursor approaches or tracks across the element.

### 1.1 Technical Mechanism
1. A container registers a throttled or `requestAnimationFrame`-bound `pointermove` listener.
2. The pointer coordinates $(x, y)$ are transformed into relative pixel offsets against `element.getBoundingClientRect()`.
3. Two CSS custom properties, `--mouse-x` and `--mouse-y`, are written to the card's inline style.
4. An absolute pseudo-element (`::before`) or inner gradient mask applies a radial spotlight that bleeds across both the card surface and its border.

```css
/* Card container */
.linear-card {
  position: relative;
  border-radius: 12px;
  background-color: var(--linear-surface-base);
  border: 1px solid var(--linear-border-subtle);
  overflow: hidden;
}

/* Mouse-driven spotlight */
.linear-card::before {
  content: "";
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  background: radial-gradient(
    650px circle at var(--mouse-x, -999px) var(--mouse-y, -999px),
    rgba(255, 255, 255, 0.08),
    transparent 40%
  );
  pointer-events: none;
  z-index: 1;
}
```

---

## 2. Border-Beam & Animated Gradient Borders

To draw focus to high-priority features (such as the interactive app preview or primary CTA cards), Linear uses an illuminated rotating border-beam.

### 2.1 Modern CSS `@property` Implementation
Rather than rendering duplicate DOM elements, Linear leverages the CSS `@property` spec for composited angle interpolation:

```css
@property --border-angle {
  syntax: "<angle>";
  inherits: false;
  initial-value: 0deg;
}

.border-beam-card {
  position: relative;
  border-radius: 16px;
  border: 1px solid transparent;
  background: 
    linear-gradient(#08090a, #08090a) padding-box,
    conic-gradient(
      from var(--border-angle),
      transparent 0deg,
      rgba(94, 106, 210, 0.7) 45deg,
      transparent 90deg
    ) border-box;
  animation: border-rotate 8s linear infinite;
}

@keyframes border-rotate {
  to {
    --border-angle: 360deg;
  }
}
```

---

## 3. Keyboard Shortcut Badge Engine (Tactile Keycaps)

Linear's identity is intrinsically tied to **keyboard velocity**. Every action on the landing page is labeled with its corresponding single-key or chord shortcut.

### 3.1 Keycap Badge Anatomy
Keycaps are modeled with tactile skeuomorphic precision inside a dark modern palette:
- **Dimensions:** Fixed height `20px` to `24px`, minimum width `20px`, padding `0 6px`.
- **Background:** `linear-gradient(180deg, #1c1d20 0%, #121315 100%)`.
- **Borders:** Top border `1px solid rgba(255, 255, 255, 0.12)`, bottom border `1px solid rgba(0, 0, 0, 0.60)`.
- **Shadow:** `box-shadow: 0 1px 1px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.08)`.
- **Typography:** `11px`, `font-family: monospace`, weight `510`, color `--linear-text-secondary`.

### 3.2 Common Shortcut Patterns Shown on Page
- `Cmd + K`: Global Command Menu trigger.
- `C`: Instant issue creation.
- `O`: Open issue detail modal.
- `G` then `I`: Jump navigation ("Go to Issues").
- `S`: Cycle / Sprint switcher.

---

## 4. Command Menu (`Cmd+K`) Modal Transitions

When users click the interactive preview or press `Cmd+K` on the landing page, the command menu animates into view:

### 4.1 Transition Specifications
- **Backdrop Blur:** Animates `opacity: 0 → 1` and `backdrop-filter: blur(0px) → blur(8px)` in `120ms` (`ease-out`).
- **Dialog Pop-in:**
  - Initial state: `opacity: 0`, `transform: scale(0.97) translateY(-8px)`
  - Active state: `opacity: 1`, `transform: scale(1.00) translateY(0px)`
  - Duration: `150ms` using cubic bezier `cubic-bezier(0.16, 1, 0.3, 1)`.
- **Keyboard Navigation Feedback:** Pressing Arrow Up / Arrow Down updates the active selection item with an instantaneous `40ms` background tint transition, ensuring zero perceived input lag.

---

## 5. Interactive Issue Board Simulation & State Tabs

The landing page features live simulated Kanban boards and list views:
- **Segmented Control Tabs:** Pill tabs ("All Issues", "Active", "Backlog", "Completed") share a sliding active indicator pill.
- **Micro-interaction:** The active pill uses a layout spring or CSS `transition: transform 200ms cubic-bezier(0.2, 0, 0, 1)` that slides beneath the active label.
- **Status Icon Glows:** Status icons (e.g., golden Todo circle, orange In-Progress arc, purple Done checkmark) emit subtle 4px radial drop shadows on hover.
