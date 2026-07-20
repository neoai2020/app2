# Profit Loop — Mobile App-Feel

Adapted from the Robinhood `MOBILE_GUIDE.md` plan. Same behavior goals; Profit Loop routes, purple brand, and existing affiliate URLs only.

## Foundations (done)

- `viewportFit: "cover"` + `themeColor: #0c0a0e` in `src/app/layout.tsx`
- PWA `src/app/manifest.ts` (standalone, Add to Home Screen)
- `min-h-dvh`, `pb-24` on dashboard shell, safe-area top/bottom
- `BottomNav`: Home · Customers · Emails · Training · More
- More sheet: Offer Library, Saved Emails, Premium, exclusive offers (same URLs as desktop sidebar), Support, Sign out
- Slim mobile top bar (logo + title); desktop keeps left sidebar
- Tap highlight off, overscroll none, inputs ≥16px

## Page notes

- Dashboard: welcome by first name, featured training video, “Let’s get started” 3 steps, quick actions, support
- Video overlay: full `dvh` on mobile with safe-area close; withdraw ad stacks (Profit Loop JVZoo URL)
- Training / premium CTAs: keep existing generation + PromoBanner patterns

## QA checklist

- iPhone SE 375 · Pro Max 430 · Android ~412
- Tab bar never covers last CTA
- Inputs don’t trigger iOS zoom
- Overlay above tab bar (`z-[120]` vs `z-50`)
- Exclusive offer links unchanged from sidebar
