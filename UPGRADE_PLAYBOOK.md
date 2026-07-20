# Software Upgrade Playbook

A repeatable, end-to-end guide for applying the same overhaul we did on Profit Loop (modeled on Robinhood) to **any** of the member-area apps. Follow the phases in order. Every phase ends with a verification step so functionality and revenue links are never broken.

---

## Phase 0 — Ground rules (read before touching anything)

These rules apply to every phase. Violating any of them is a rollback.

1. **Never change revenue links.** Affiliate URLs (JVZoo, Explodely, ClickBank, Digistore, Convertri, custom training funnels) must come out of the process byte-identical. Before starting, capture them:
   ```bash
   grep -rn "jvz\|clickbank\|digistore\|convertri\|explodely\|http" src --include='*.tsx' --include='*.ts' | grep -i "href\|url\|link" > /tmp/links-before.txt
   ```
   Re-run after every phase and diff. Only additions are allowed, never modifications.
2. **Never change video IDs.** Vimeo/YouTube IDs are content, not design. Grep them before and after (`player.vimeo.com/video/\d+`).
3. **Never touch API routes' logic.** Design work stays in components, pages, CSS, and assets. If a page component calls `fetch('/api/...')`, the call signature stays identical.
4. **Typecheck after every phase:** `npx tsc --noEmit`. Zero new errors.
5. **One commit per phase** with a clear message, so any phase can be reverted alone.
6. **Copy patterns, not constants.** When porting from a reference app (e.g. Robinhood), take the structure/JSX/CSS pattern but swap in this app's brand colors, product name, links, and video IDs. Grep for the reference app's affiliate IDs afterward to prove none leaked in.

---

## Phase 1 — Honest activity data (remove fabricated social proof)

**Problem:** Dashboards show fake "community earnings", fake member counts, fake "X just earned $Y — Verified" toasts with random names and incrementing counters.

**Fix:**
1. Find the component (search for `LiveActivity`, `SocialProof`, hardcoded names arrays, `Math.random()` inside counters).
2. Replace fabricated counters with the signed-in user's **real** usage from the database (e.g. today's leads found / emails generated from a `usage_limits` or equivalent table).
3. Replace fake toasts with either the user's own recent activity (from an `activity_logs` table) or rotating **useful tips**. No fake names, no fake dollar amounts, no "Verified" badges.
4. Replace any fake "community progress to $1M" bars with a "Next step" nudge card.
5. Add "Individual results vary." where appropriate.

**Verify:** No `Math.random()` driving displayed money. Page renders for a brand-new user (empty state falls back to tips).

---

## Phase 2 — Green banner (Free Training offer) at generation CTAs

**Problem:** The old promo banner is global (every page) or styled off-brand.

**Target design** (the Robinhood `EarningsBanner` look):
- Dark navy card `bg-gradient-to-b from-[#101726] to-[#0b0f18]`, `border-2 border-[#fbbf24]/50`, `rounded-2xl`, centered text
- Red pill badge "FREE TRAINING"
- Big black-weight uppercase headline with the dollar range in amber `#fbbf24`
- Bold light-blue sub-line, amber gradient CTA button, red "Warning: this will be taken down soon" footer
- Dismiss X in the corner (local state only — no persistence needed)

**Placement rule:** the banner appears **the moment a generation CTA starts loading and stays after the results arrive.** It is only removed when the user clicks its X.

**Implementation pattern:**
```tsx
const [showOfferBanner, setShowOfferBanner] = useState(false)

// inside the CTA handler, before the async work:
setLoading(true)
setShowOfferBanner(true)   // never set back to false on success

// in JSX, right below the form / above the results:
{showOfferBanner && <PromoBanner />}
```

**Where to wire it — every CTA that "generates" something:**
- Find customers / lead search
- Email generation
- Offer/template generation
- Any premium feature that produces results (see Phase 3)

**If the CTA has a real loading phase**, show a loading bar with the banner *inside* it (see `GenerationProgress`): spinner + label + animated bar easing to 95% + `<PromoBanner />` below. When loading finishes, the progress bar goes away, the banner stays.

**If the CTA is instant** (client-side reveal like "show my posts"), add a **fake delay** (3.5–4.5s timeout) so the loading bar + banner get seen, then reveal results. Guard against races: cancel the pending timeout if the user changes inputs (token/ref counter).

**Remove the banner from any global layout** — it must be contextual only.

**Verify:** banner CTA link is this app's own funnel URL. Banner appears on loading, persists after results, X dismisses it.

---

## Phase 3 — Premium features: loading + banner on every CTA

Apply Phase 2's pattern to each premium page (Accelerator/DFY, Recurring Streams, Social Payouts, etc.):

| CTA type | Pattern |
|---|---|
| "Generate my posts" | fake 4.5s → `GenerationProgress` → posts + banner stays |
| "Save & continue" (link save) | fake 4s → progress → unlocked content + banner |
| Niche/category switch | fake 3.5s → progress → filtered results + banner |
| Load more | fake 2.5s → progress → more rows |
| Copy-to-clipboard buttons | **skip** — not generation |

Disable the triggering control while loading. Pages with no generation CTA (e.g. a security/status page) get **no** banner.

---

## Phase 4 — Kill the global popup; put the ad under videos in an overlay

**Problem:** an "Account Verified — You're Eligible To Withdraw $416.34 — Withdraw Now" popup mounts globally on every page.

**Fix (the Robinhood `VideoOverlay` pattern):**
1. **Remove** the popup from the layout (and delete the dead component file once nothing imports it).
2. Create a `VideoOverlay` component:
   - Portal to `document.body`, `z-[120]`, backdrop `bg-black/60`, Esc + backdrop-click close, body scroll lock
   - Panel: dark glass, rounded-2xl on desktop, **full `100dvh` sheet on mobile** with safe-area padded close button (44×44px)
   - Header with title + close, then a 16:9 iframe (Vimeo/YouTube via a `toEmbedUrl()` helper that adds autoplay params)
   - **Below the video: the withdraw ad bar** — same creative as the old popup (emerald check circle, "ACCOUNT VERIFIED", "Congratulations! You're eligible to withdraw $X", "Available balance from your activity", emerald "Withdraw Now →" CTA) with CSS keyframe animations: drifting blur blobs, emerald pulse, traveling sheen, CTA glow. Keep the animations — they're the attention driver.
3. Convert every inline video embed to **thumbnail + play button → opens the overlay**: training page cards, dashboard welcome video, premium page tutorial videos.
4. The ad's URL is this app's **own** withdraw/offer affiliate link — take it from the popup you just removed.

**Verify:** popup gone from all pages; every training video opens the overlay; ad shows under the playing video; link identical to the old popup's.

---

## Phase 5 — Dashboard / home redesign

Structure (top to bottom), adapted from Robinhood:

1. **Welcome block:** accent eyebrow ("HOME"), `Welcome to {Product}, {FirstName}` (first name from the `users`/profile table, omit gracefully if missing), 2–3 sentence plain-English explanation of the money loop.
2. **Featured getting-started video** — first thing they see. Thumbnail + play → `VideoOverlay`. Full-width "Open Training Academy" CTA under it.
3. **"Let's get started" / "Here's how it works"** — exactly 3 numbered step cards (number circle, "about N minutes" badge in amber, icon + title, short description, full-height CTA button linking to the actual feature). Close with a reassurance card ("That's it… if you get stuck, Support").
4. **Usage stats** (real daily limits/counters — from Phase 1).
5. **Quick Actions** — 3 cards linking to the core tools.
6. **Support card** — gradient icon tile + "Contact Support" CTA.
7. Right rail (desktop): "Next step" nudge + "Your activity" (honest data).

Steps must describe **this** app's actual workflow. Use `Link`/router links, not `<a>` for internal routes.

---

## Phase 6 — Design system (audit → define → apply)

This phase only works if you audit first. Don't define tokens from memory — count what actually exists.

**6a. Audit every page.** For each route record: h1 classes, eyebrow presence, subtitle style, container max-width, column structure, section-heading styles, every distinct button style, every card background/border/radius, every hardcoded color. Roll up the counts. (On Profit Loop this found **6 different h1 styles, 5 max-widths, ~15 ad-hoc button styles, 3 competing card systems, ~15 off-system colors** — expect similar in every app.) The audit output is your worklist.

**6b. Define the system** as CSS classes + tokens in `globals.css`, documented in `DESIGN_SYSTEM.md`. The system must cover, at minimum:

1. **Color tokens:** app canvas (tinted off-black ~10% lifted from `#000`, e.g. `#0c0a0e`), elevated panel, glass card, one primary accent + one gradient partner, soft-accent for labels, 2 muted text tones, semantic success/danger/warning. **Map every stray color to a token** (all the ad-hoc indigos/blues → the gradient partner; keep only real brand marks like a Facebook icon and semantic states). Ad creatives (promo banner, withdraw bar) keep their own palette on purpose — exclude them from the sweep.
2. **Type scale as reusable classes** — one hierarchy, used by name: `ds-h1` (page title, clamp ~1.75–2.4rem, one per page), `ds-h2` (section), `ds-h3` (card), `ds-h4` (micro uppercase label), `ds-label` (form field), `ds-subtitle`, `page-eyebrow`. Hype/premium pages may add `italic uppercase` *modifiers* but never a different size. Body ≥15px mobile; inputs ≥16px.
3. **A `PageHeader` component** (eyebrow + h1 + subtitle + right-side actions slot, fixed bottom margin) — every page starts with it. This single component kills most heading drift.
4. **Layout templates** — define and name them: one-column (`max-w-6xl`, `space-y-6`), two-column-with-rail (`max-w-7xl`, `grid xl:grid-cols-4`, main `col-span-3`), catalog (filter rail + content), landing moment (centered `max-w-4xl`), auth (`max-w-md`). Every page must declare which template it is. All templates collapse to one column + full-width CTAs + bottom-nav clearance on mobile.
5. **Button system** — primary (brand gradient, defined hover: brightness+lift, active: scale .98, purple shadow), secondary (white/5 + border), soft-accent tertiary, ghost, danger, and a `chip` style for tabs/filters (active = solid accent). Three sizes with min-heights (36/44/52px). Ship them **both** as component variants and as plain CSS classes (`.btn .btn-primary .btn-lg`) so raw `<a>`/`<Link>` CTAs render identically to the component. **One primary per screen region** — cognitive-load rule.
6. **Surface system** — one card recipe (glass bg, 1px border, rounded-2xl) plus a `ds-well` class for content boxes *inside* cards. Radius hierarchy: inner elements tighter than containers.
7. **Media rules** — every thumbnail gets a bottom-heavy gradient **scrim** (`~72%→12%` black) under its play button so buttons/captions never fight the artwork (a flat 10% overlay is not enough); one play-button spec; playback only in the shared overlay.
8. **Sidebar spec** — lifted tinted surface (never pitch black), plus a **collapse toggle**: width via a CSS variable (`--sidebar-w: 280px ↔ ~76px`), toggled through `html[data-sidebar]`, persisted in `localStorage`, main pane padding `lg:pl-[var(--sidebar-w)]` with a width transition; collapsed mode is icon-only with `title` tooltips.
9. **UX guardrails** — 4px spacing base, section gap 24px, touch ≥44px, ≥8px between targets, ≤3 choices per decision point, progressive disclosure for multi-step flows, visible focus rings, `prefers-reduced-motion` support, contrast: body copy never darker than mid-gray on card surfaces.

**6c. Apply page by page — in parallel if possible.** Split routes into batches (core tools / premium / content+auth) and sweep each against the audit: PageHeader in, heading classes swapped, buttons onto the system, wells unified, colors mapped. Hard constraints for the sweep: class/JSX-structure edits only, no logic/handler/link/video-ID changes, ad creatives untouched, typecheck after every batch.

**Verify:** re-run the audit greps — h1 styles should be down to 1 (+1 allowed home hero), buttons to the named set, no off-system hex codes outside ad creatives; typecheck clean; links byte-identical to the Phase 0 baseline.

---

## Phase 7 — Training video thumbnails

1. **Generate one image per training video** with AI (16:9 landscape). Consistent style spec:
   - Dark charcoal background, the app's accent color as neon glow (vignette edges)
   - Huge outlined episode number ("01"…) on the left in glowing accent outline
   - Red pill "TRAINING" badge (gold "PREMIUM" for premium videos)
   - Bold condensed italic title, key word in accent gradient
   - Content-specific 3D graphics per topic (envelope for emails, map pin for leads, rocket for accelerator…)
   - Cinematic lighting, depth of field, no watermark, no tiny unreadable text
2. Save to `public/thumbnails/`, mapped by video ID in a lib:
   ```ts
   export const VIDEO_THUMBNAILS: Record<string, string> = { '<vimeoId>': '/thumbnails/thumb-01-….webp', … }
   export function getVideoThumbnail(videoUrl: string): string | null { /* parse id, lookup */ }
   ```
3. Consume everywhere a video preview shows (training cards, dashboard video, premium pages): `<img>` with a **gradient scrim** (bottom-heavy, ~72%→12% black — not a flat overlay) + play button. Fallback to a gradient block if no thumbnail.
4. **Optimize before committing** — see Phase 9.

---

## Phase 8 — Mobile app behavior

Foundations (once, globally):
- `export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: <bg token> }` in the root layout
- `appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: <Product> }` in metadata
- `app/manifest.ts`: name, `display: 'standalone'`, theme/background = bg token, 192/512 icons → installable PWA
- CSS: `-webkit-tap-highlight-color: transparent`, `overscroll-behavior-y: none` on body, inputs ≥16px, `min-h-dvh` instead of `min-h-screen`
- Shell: content gets `pb-24` on mobile (clearance for tab bar) + `env(safe-area-inset-top)` padding under the top bar

Bottom tab bar (`lg:hidden`, desktop keeps the sidebar):
- Exactly 5 items: Home + the 3 highest-traffic tools + **More**; 64px tall + `env(safe-area-inset-bottom)`
- Icon 24px over an 11px semibold label; active = accent color + 3px gradient bar across the item top; instant `active:` feedback, no animation delays
- **More** opens a bottom sheet (slide up, backdrop dismiss, drag handle): remaining main pages, Premium group, **exclusive offers copied verbatim from the desktop sidebar**, Support, Sign out — rows ≥52px
- Replace the hamburger with a slim ~56px top bar (logo + product name)
- z-order: tab bar `z-50` < sheets `z-[60/70]` < video overlay `z-[120]`

Page passes: stack grids to one column, full-width 48–56px CTAs, dialogs become full-screen `dvh` sheets, video overlay full-screen with the ad bar stacked.

**Verify:** iPhone SE (375px) + Pro Max (430px) + Android (~412px); tab bar never covers the last CTA; no input zoom; overlay sits above the tab bar.

---

## Phase 9 — Cleanup + asset optimization (speed pass)

**Dead code:**
- Components no longer imported anywhere (e.g. the removed popup) → delete the file
- Unused imports/props flagged by `tsc`/ESLint → remove
- On external drives (macOS): delete AppleDouble junk and ignore it:
  ```bash
  printf "\n# macOS AppleDouble files\n._*\n**/._*\n" >> .gitignore
  find . -name "._*" -not -path "./node_modules/*" -not -path "./.git/*" -delete
  ```

**Images** (use `sharp` from node_modules — no extra installs):
- Thumbnails/photos: resize to 1280px wide, convert to **WebP quality 82** → ~2MB PNG becomes ~120–160KB with no visible loss. Delete the original PNGs and update every reference (map lib + any hardcoded paths).
- Logos/icons: resize to display size (a 40px sidebar logo does not need an 800px source), recompress PNG with `palette: true`.
- One-liner shape:
  ```js
  await sharp(src).resize({ width: 1280 }).webp({ quality: 82 }).toFile(out)
  ```
- Add `loading="lazy" decoding="async"` to every below-the-fold `<img>`; keep the hero image eager.
- Budget: whole `public/` folder under ~5MB; single image under ~200KB.

**Security sanity check (read-only):**
- Run the database advisor (e.g. Supabase `get_advisors`) and **report** findings — don't apply migrations to a live DB without explicit approval
- Confirm `.env*` is gitignored and no keys are hardcoded in `src/`
- Confirm service-role keys only appear in server-side code (API routes), never client components

**Verify:** `npx tsc --noEmit` clean, `grep` link audit matches Phase 0 baseline, `du -sh public` within budget.

---

## Phase 10 — Ship

```bash
git add -A
git commit -m "<phase summary>"
git push origin main
```

Then check the deployed site (desktop + a real phone). Confirm:
1. All revenue links click through to the right offers
2. Videos play in the overlay with the ad bar
3. Generation CTAs show progress + banner, results still arrive
4. Bottom nav works, nothing hidden behind it
5. Pages load fast (thumbnails are WebP, no multi-MB requests in the network tab)

---

## Appendix — file inventory created by this playbook

| File | Purpose |
|---|---|
| `components/ui/promo-banner.tsx` | Free Training banner (Robinhood design, app's own link) |
| `components/ui/generation-progress.tsx` | Loading bar + banner combo for generation CTAs |
| `components/ui/video-overlay.tsx` | Full-screen player + withdraw ad bar + `toEmbedUrl` |
| `components/ui/how-it-works.tsx` | 3-step onboarding block for the dashboard |
| `components/ui/bottom-nav.tsx` | Mobile tab bar + More sheet |
| `lib/video-thumbnails.ts` | Video ID → thumbnail map + helpers |
| `app/manifest.ts` | PWA manifest |
| `public/thumbnails/*.webp` | Optimized branded thumbnails |
| `DESIGN_SYSTEM.md` | Token reference for this app |
| `MOBILE_GUIDE.md` | Mobile behavior spec for this app |
