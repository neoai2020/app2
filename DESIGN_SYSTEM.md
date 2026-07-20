# Profit Loop Design System

Derived from the live app (purple-on-dark glass UI) and aligned with Robinhood’s mobile app-feel patterns — using Profit Loop branding only.

## Brand

| Token | Value | Use |
|-------|-------|-----|
| `--primary-accent` | `#D946EF` | Primary CTAs, active nav, links |
| `--promo-bg` | `#8B5CF6` | Gradients / secondary accent |
| `--action-accent` | `#C026D3` | Strong hover / emphasis |
| `--background` | `#0c0a0e` | App canvas (~10% lifted from pure black) |
| `--background-elevated` | `#121014` | Panels |
| `--glass-bg` | `#161318` | Cards |
| `--muted` / `--muted-strong` | mauve-gray | Body / secondary copy |
| `--warning` | `#fbbf24` | Badges / time labels |
| `--success` | `#22c55e` | Success states |

## Typography

- **Sans:** Geist (`--font-geist-sans`)
- **Mono:** Geist Mono for timers / counts
- **Eyebrow:** `.page-eyebrow` — 12px, black weight, 0.25em tracking, accent color
- **Page title:** `.page-title` — clamp 1.75–2.5rem, weight 800
- **Body:** ≥15–16px on mobile; inputs always ≥16px (iOS zoom)

## Spacing & radius

- Base unit 4px (`--space-1` … `--space-12`)
- Page padding: `px-4` mobile, `lg:p-8` desktop
- Mobile bottom clearance: `pb-24` (tab bar)
- Radius: sm 8 / md 12 / lg 16 / xl 24 (`--radius-*`)
- Cards: `.glass-card` / `.glass-strong`

## Touch & mobile

- Bottom tabs: Home, Customers, Emails, Training, More
- Tab bar 64px + safe-area; More sheet uses Profit Loop offer URLs only
- CTAs ≥48px (`.touch-cta`); primary often 52–56px
- `viewport-fit=cover`, `min-h-dvh`, `overscroll-behavior-y: none`
- PWA: `src/app/manifest.ts`

## Do not change

- JVZoo / training offer links already in sidebar
- Vimeo training IDs
- Core generate / allocate / save API behavior
