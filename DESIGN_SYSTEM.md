# Profit Loop Design System

Single source of truth for every page. All tokens live in `src/app/globals.css`; shared pieces live in `src/components/ui/`. If a page needs something visual, it comes from here — never invent a new style inline.

---

## 1. Color

| Token | Value | Use |
|---|---|---|
| `--background` | `#0c0a0e` | App canvas (lifted off pure black for readability) |
| `--background-elevated` | `#121014` | Panels, top bars |
| `--glass-bg` | `#161318` | All cards and raised surfaces |
| `--glass-border` | `rgba(255,255,255,0.07)` | Card borders |
| `--primary-accent` | `#D946EF` | The one brand accent: active nav, links, highlights |
| `--promo-bg` | `#8B5CF6` | Gradient partner + "info" accent (replaces every ad-hoc indigo/blue) |
| `--action-accent` | `#C026D3` | Pressed/strong hover |
| `--accent-soft` | `rgba(217,70,239,0.8)` | Field labels, soft accent text |
| `--muted` / `--muted-strong` | mauve grays | Secondary copy |
| `--success` / `--danger` / `--warning` | green / red / amber | Semantic only — never decorative |

**Rules**
- One accent family. Anything decorative that isn't `#D946EF`/`#8B5CF6` is off-system (exceptions: real brand marks like the Facebook icon, and semantic green/red/amber states).
- Text contrast: body copy ≥ `zinc-400` on `--glass-bg`; never `zinc-600`+ for content the user must read.
- The Free Training banner (`promo-banner.tsx`) and the withdraw ad bar (`video-overlay.tsx`) intentionally keep their own creative palette — they are ads, not UI. Do not "fix" them.

## 2. Background

Soft ambient gradient (`.animated-bg`): two radial accent glows + vertical dark gradient over `--background`. Fixed, `z-index:-1`. Grid overlay at 3.5% opacity. Never flat `#000`.

## 3. Typography

Geist Sans (UI) + Geist Mono (timers, counters, code).

| Class | Spec | Use |
|---|---|---|
| `.ds-h1` | clamp 1.75–2.375rem, 800, -0.025em, balanced | Page title — one per page |
| `.ds-h2` | 1.375rem, 800, -0.02em | Section heading |
| `.ds-h3` | 1.0625rem, 700 | Card heading |
| `.ds-h4` | 0.8125rem, 700, uppercase, +0.12em, gray | Micro section label |
| `.ds-label` | 0.75rem, 600, uppercase, accent-soft | Form field label |
| `.ds-subtitle` | 0.9375rem/1.6, muted | Page subtitle |
| `.page-eyebrow` | 12px, 800, uppercase, +0.25em, accent | Above every h1 |

- Premium/hype pages may add `italic uppercase tracking-tight` to `ds-h1/ds-h2` — same size scale, different voice.
- The dashboard home hero is the single allowed oversized h1 (`text-3xl → lg:text-6xl`).
- Body ≥15px mobile. Inputs ≥16px always (iOS zoom).

## 4. Page templates

Every page starts with `<PageHeader eyebrow title subtitle actions />` (`src/components/ui/page-header.tsx`). Eyebrows: Home, Library, Leads, Outreach, Archive, Academy, Help, History, Guide, Premium.

| Template | Container | Structure |
|---|---|---|
| **One-column** (forms, lists) | `max-w-6xl mx-auto` (narrow forms may keep `max-w-4xl`) | PageHeader → tip/status → main Card(s) → results. Rhythm `space-y-6`/`mb-6`. |
| **Two-column with rail** (dashboard, support) | `max-w-7xl mx-auto` | `grid xl:grid-cols-4`: main `xl:col-span-3 space-y-8`, rail `space-y-6`. Rail stacks under main below `xl`. |
| **Catalog** (Accelerator) | `max-w-7xl mx-auto` | `xl:grid-cols-4`: filter sidebar (1) + content (3). |
| **Landing moment** (scale/copy-paste) | `max-w-4xl` centered, `min-h-[70vh]` | Hero + single giant CTA. |
| **Auth** | `max-w-md` centered | Card with `ds-h1 gradient-text`. |

All collapse to one column with `px-4`, full-width CTAs, `pb-24` (bottom tab clearance) on mobile.

## 5. Surfaces

| Class | Use |
|---|---|
| `Card` component (`glass-card rounded-2xl`, 1px border) | Primary container |
| `bg-[var(--glass-bg)]` + `border-white/5` + `rounded-2xl` | Raw card when Card component doesn't fit |
| `.ds-well` (`bg-white/3`, 1px `white/6`, `radius-md`) | Content boxes *inside* cards: previews, list rows, code |
| `.glass-strong` | Emphasized card (notifications rail) |

Radius scale: inputs/wells 12px (`--radius-md`) → cards 16–24px (`rounded-2xl`) → pills full. Inner elements always tighter than their container. Borders are 1px (the old `border-2` is retired).

## 6. Buttons

One primary look everywhere: brand gradient. Component `Button` and the raw classes render identically.

| Class / variant | Look | Use |
|---|---|---|
| `.btn .btn-primary` / `variant="primary"` | `#D946EF→#8B5CF6` gradient, white text, purple shadow; hover = brightness+lift, active = scale .98 | The one primary action per view |
| `.btn-secondary` / `secondary` | `white/5` + border | Neutral actions |
| `.btn-accent-soft` | `accent/10` bg, accent text | Tertiary accent (load more, copy) |
| `ghost`, `danger` | text-only / red | Inline, destructive |
| `.ds-chip` | pill, 36px, uppercase 12px | Tabs & filters. Active `bg-[#D946EF] text-black`, idle `bg-white/5 border-white/10 text-zinc-400` |

Sizes: `btn-sm` 36px / `btn-md` 44px / `btn-lg` 52px min-height. Mobile primary CTAs are full-width `btn-lg`. Motion: 200ms `cubic-bezier(0.32,0.72,0,1)`; transform+opacity only.

**Cognitive-load rule:** one `btn-primary` per screen region. Everything else steps down a level.

## 7. Media

- Thumbnails: 16:9 WebP (≤200KB) from `lib/video-thumbnails.ts`; `<img loading="lazy" decoding="async">` below the fold.
- Every thumbnail gets `.thumb-scrim` (bottom-heavy black gradient 72%→12%) under the play button so the button and caption never fight the artwork.
- Play button: 56–80px circle, `#8B5CF6→#D946EF` gradient, `border-4 border-white/20`, hover scale 1.1.
- Video playback happens only in `VideoOverlay` (portal, `z-[120]`, full-dvh sheet on mobile).

## 8. Navigation

- **Desktop sidebar:** width `--sidebar-w` (280px ↔ 76px collapsed). Collapse toggle in the header (PanelLeft icons), state persisted in `localStorage`, applied via `html[data-sidebar]` so the main pane reflows (`lg:pl-[var(--sidebar-w)]`). Collapsed mode: icon-only, `title` tooltips. Surface is a lifted tinted gradient — not pitch black.
- **Mobile:** slim top bar (logo + name) + 5-tab BottomNav + More sheet. Safe-area padded.
- Active state: accent text + dot (sidebar) / accent + 3px top bar (tabs).

## 9. Spacing & UX guardrails

- 4px base scale. Section gap 24px (`space-y-6`); page-header bottom 32px; card padding `p-5`/`p-6` (mobile `p-4`–`p-5`).
- Touch targets ≥44px, ≥8px apart.
- Max ~3 simultaneous choices per decision point; progressive disclosure (steps reveal as prerequisites complete).
- Every async action: loading state → (banner if generation) → result. No dead clicks.
- Focus rings visible (`*:focus-visible` accent outline). `prefers-reduced-motion` collapses all animation.

## 10. Do not change

- Affiliate/offer URLs (sidebar, bottom-nav More sheet, banner, withdraw ad, copy-paste/scale pages)
- Vimeo IDs and API route logic
- Ad creative palettes (promo banner amber/navy, withdraw bar emerald)
