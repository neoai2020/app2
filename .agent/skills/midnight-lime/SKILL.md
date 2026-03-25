---
name: Midnight & Purple Design System
description: Technical specification for the Midnight charcoal and Electric Purple UI/UX architecture used in the Profit Loop Dashboard.
---

# Midnight & Purple Design System

This documentation provides the core design tokens and implementation guidelines for the Midnight & Purple aesthetic, replacing the previous Lime/Yellow system.

## 🎨 Core Color Palette

| Usage | Color Hex | CSS / Tailwind Class |
| :--- | :--- | :--- |
| **Main Background** | `#000000` / `#111111` | `bg-background / bg-[#111111]` |
| **Primary Accent (Purple)** | `#D946EF` | `text-[#D946EF] / bg-[#D946EF]` |
| **Secondary Accent (Magenta)**| `#C026D3` | `bg-[#C026D3]` |
| **Promo Background (Violet)** | `#8B5CF6` | `bg-[#8B5CF6]` |
| **Border / Subtle White** | `rgba(255,255,255,0.05)` | `border-white/5` |
| **Zinc Text** | `#71717a` | `text-zinc-500` |

## 📐 Layout: Profit Loop Dashboard (Dashboard)

- **Container**: `max-w-[1700px]` centered.
- **Grid Structure**: 4-column master grid (`xl:grid-cols-4`).
    - **Main Area**: 3 columns (`xl:col-span-3`).
    - **Right Sidebar**: 1 column.
- **Sidebar Alignment**: Applied `xl:mt-32` to align the sidebar content with the top stats row of the main content.
- **Sidebar Order**: 
    1. `CommunityProgress` (Top)
    2. `LiveActivityFeed`
    3. `PremiumUpgradeCard` (With link to `/upgrades`)
    4. `ManagerSupportCard` (Bottom)

## 📦 Component Specifications

### 1. Headline Style
- **Typography**: `font-black`, `uppercase`, `italic`, `tracking-tighter`.
- **Accents**: 1.5px vertical bars (`w-1.5 h-10 bg-[#D946EF] rounded-full`).

### 2. Cards (The "Glass" Look)
- **Rounding**: `rounded-3xl` (standard) to `rounded-5xl` (large sections).
- **Background**: `bg-[#111111]` or `bg-white/2`.
- **Borders**: `border-2 border-white/5`.
- **Glass Effect**: `glass-strong` or `backdrop-blur-sm`.

### 3. Buttons
- **Primary (Purple)**: `h-16` to `h-20`, `font-black`, `uppercase`, `italic`.
- **Outline/Subtle**: `bg-white/2`, `border-white/5`, `hover:bg-white/5`.
- **Premium Actions**: `shadow-[0_8px_30px_rgba(217, 70, 239, 0.2)]`.

## 📢 Persistent Notification Banner

- **Container Styling**:
    - Background: `#8B5CF6` (Violet).
    - Height: `min-h-[220px]`.
    - Spacing: `p-6 md:p-12`, `mb-8`.
    - Shadow: `shadow-[0_12px_40px_rgba(139, 92, 246, 0.25)]`.
- **Content**:
    - **Title**: "WANT TO MULTIPLY YOUR EARNINGS TO $1,000 - $5,000 A DAY?"
    - **Icon**: `Smartphone` with a `Zap` badge in `#D946EF`.
- **Action Button**:
    - Color: `#D946EF` (Electric Purple).
    - Label: "CLICK HERE TO LEARN HOW" (Uppercase + Italic).
    - **Target URL**: `https://www.jvzoo.com/c/86517/415009`
