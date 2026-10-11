# Design System & Theme Analysis: prgyn.dev

## 1. The 6 Semantic Themes Matrix

Source: [`23mhw0n1bc-j6.css`](file:///c:/Users/sr2ma/Documents/github/webdev-hackthon/prgyn_dump/23mhw0n1bc-j6.css)

All chapters switch themes dynamically via CSS custom properties scoped to theme classes:

```css
/* 1. theme-ink (Default Dark / Chapter 01: Blank) */
.theme-ink {
  --surface: #0d0d0f;
  --surface-raised: #16161a;
  --surface-sunk: #1c1c21;
  --text: #ececea;
  --text-muted: #8a8a93;
  --line: #34343b;
  --line-strong: #8a8a93;
  --accent: #e0243a;
  --grid-major: #34343b8c;
  --grid-minor: #34343b38;
  --flip-surface: #f0f0ed;
  --flip-border: #e3e3df;
  --flip-text: #111113;
}

/* 2. theme-paper (Editorial Light / Chapter 02: Spark) */
.theme-paper {
  --surface: #f0f0ed;
  --surface-raised: #e3e3df;
  --surface-sunk: #d9d9d4;
  --text: #111113;
  --text-muted: #5c5c64;
  --line: #c9c9c3;
  --line-strong: #5c5c64;
  --accent: #e0243a;
  --grid-major: #1111131f;
  --grid-minor: #1111130d;
  --flip-surface: #111113;
  --flip-border: #34343b;
  --flip-text: #f0f0ed;
}

/* 3. theme-blueprint (Technical Indigo / Chapter 03: Sketch) */
.theme-blueprint {
  --surface: #1c33a8;
  --surface-raised: #2440c2;
  --surface-sunk: #172b8f;
  --text: #f4f6ff;
  --text-muted: #b9c3ff;
  --line: #f4f6ff3d;
  --line-strong: #f4f6ff9e;
  --accent: #ffb400;
  --grid-major: #f4f6ff29;
  --grid-minor: #f4f6ff0f;
  --flip-surface: #f0f0ed;
  --flip-border: #e3e3df;
  --flip-text: #111113;
}

/* 4. theme-terminal (Hacker Black / Chapter 04: Code) */
.theme-terminal {
  --surface: #0b0e0d;
  --surface-raised: #121614;
  --surface-sunk: #0f1211;
  --text: #ececea;
  --text-muted: #8a8a93;
  --line: #1fc79e4d;
  --line-strong: #8a8a93;
  --accent: #1fc79e;
  --grid-major: #1fc79e29;
  --grid-minor: #1fc79e0f;
  --flip-surface: #f0f0ed;
  --flip-border: #e3e3df;
  --flip-text: #111113;
}

/* 5. theme-mint (Electric Emerald / Lab Accent) */
.theme-mint {
  --surface: #1fc79e;
  --surface-raised: #3fd4b0;
  --surface-sunk: #17a884;
  --text: #111113;
  --text-muted: #0f3d31;
  --line: #11111333;
  --line-strong: #111113;
  --accent: #111113;
  --grid-major: #11111324;
  --grid-minor: #1111130f;
  --flip-surface: #111113;
  --flip-border: #34343b;
  --flip-text: #1fc79e;
}

/* 6. theme-crimson (Vibrant Carmine / Lab Accent) */
.theme-crimson {
  --surface: #e0243a;
  --surface-raised: #c81d31;
  --surface-sunk: #b01a2b;
  --text: #fbfbfa;
  --text-muted: #fbfbfac2;
  --line: #fbfbfa52;
  --line-strong: #fbfbfa;
  --accent: #111113;
  --grid-major: #fbfbfa2e;
  --grid-minor: #fbfbfa12;
  --flip-surface: #111113;
  --flip-border: #34343b;
  --flip-text: #fbfbfa;
}
```

---

## 2. Global Ink Color Swatches (`INKS`)

Source: [`2j7n7o23as5lo.js#L11333`](file:///c:/Users/sr2ma/Documents/github/webdev-hackthon/prgyn_dump/2j7n7o23as5lo.js#L11333)

- **Index 0 (Crimson):** `#e0243a` — High-urgency accents, flame cores, error states
- **Index 1 (Marigold):** `#ffb400` — Blueprint callouts, golden spiral followers, highlights
- **Index 2 (Cobalt):** `#3d5cff` — Technical wireframes, image bounding boxes, blueprints
- **Index 3 (Mint):** `#1fc79e` — Terminal terminal text, success states, emerald lab stages
- **Index 4 (Chalk):** `#ececea` — High-contrast primary typographic copy

---

## 3. Typography Stack & Font Variation Axes

1. **`Bricolage Grotesque`**
   - CSS axis mapping: `font-variation-settings: 'wght' <weight>, 'wdth' <width>`
   - Weight range: `200` (hairline) to `800` (extra bold)
   - Width range: `75%` (condensed) to `100%` (standard proportional)
2. **`JetBrains Mono` / `Geist Mono`**
   - Tabular monospace numbers for live tickers (`000`–`100`)
   - Monospace telemetry data in the theatrical colophon
3. **`Mrs Saint Delafield`**
   - Handwritten script calligraphy font for the intro preloader signature
