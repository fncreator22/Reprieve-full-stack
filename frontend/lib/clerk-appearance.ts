/**
 * Clerk Authentication UI Theming Configuration.
 *
 * Maps Clerk modal and component styling directly to Reprieve's design tokens.
 * CSS variables guarantee consistent typography, rounded borders, and violet brand accents.
 */
export const clerkAppearance = {
  variables: {
    colorPrimary: "var(--brand-solid)",
    colorPrimaryForeground: "var(--text-on-brand)",
    colorBackground: "var(--bg-surface)",
    colorForeground: "var(--text-primary)",
    colorMutedForeground: "var(--text-muted)",
    colorMuted: "var(--bg-sunken)",
    colorInput: "var(--bg-sunken)",
    colorInputForeground: "var(--text-primary)",
    colorBorder: "var(--border-default)",
    colorRing: "var(--brand)",
    colorDanger: "var(--danger)",
    colorSuccess: "var(--success)",
    colorWarning: "var(--warning)",
    colorNeutral: "var(--text-primary)",
    colorModalBackdrop: "var(--scrim)",
    borderRadius: "10px",
    fontFamily: "var(--font-instrument), ui-sans-serif, system-ui, sans-serif",
    fontFamilyButtons: "var(--font-instrument), ui-sans-serif, system-ui, sans-serif",
    fontFamilyMono: "var(--font-jetbrains), ui-monospace, monospace",
    fontSize: "0.9375rem",
  },
  elements: {
    cardBox: "shadow-e3 border border-border-subtle",
    card: "bg-surface",
    headerTitle: "font-display",
    formButtonPrimary: "shadow-highlight hover:shadow-glow",
    footer: "bg-surface",
  },
} as const;
