
## Goal
Transform the "Where to Watch" list on the anime detail page into a premium, branded streaming availability guide (IMDb / JustWatch feel) covering 9 platforms with real brand colors, logo marks, and polished glassmorphism cards.

## Scope
- `src/lib/streaming.ts` — expand platform registry from 5 → 9 platforms, add brand tokens (gradient, accent, logo component reference), refine `KNOWN` mappings, keep deterministic fallback.
- `src/components/PlatformBadges.tsx` — redesign `PlatformList` into premium branded cards; keep `PlatformChips` API unchanged so the hero badge row keeps working.
- `src/components/PlatformLogos.tsx` (new) — inline SVG brand marks for each platform (no network/asset deps, crisp at any size, no licensing risk of hot-linked logos).
- `src/styles.css` — add a couple of small utilities if needed (brand glow shadow, shimmer on hover). Reuse existing `glass` class.

No backend, auth, routing, or data-shape changes. `getStreamingFor` signature stays the same so `PlatformChips` on the hero and anime cards keeps working.

## Platforms & brand tokens
Each platform gets: `id`, `name`, `short`, `brandColor` (hex), `gradient` (CSS linear-gradient using brand color), `textOn` (white/black for contrast), `Logo` (inline SVG component), `searchUrl(title)`.

| Platform | Color | Mark |
|---|---|---|
| Netflix | #E50914 | stylized "N" wordmark stroke |
| Crunchyroll | #F47521 | "C" swirl |
| Disney+ | #1F80E0 | "D+" wordmark |
| Prime Video | #00A8E1 | "prime" smile arc |
| Hulu | #1CE783 (on black) | "hulu" lowercase wordmark |
| HiDive | #00BCD4 | "h" diamond |
| YouTube | #FF0000 | play triangle in rounded rect |
| Apple TV+ | #000000 (white text) | Apple glyph + "tv+" |
| Max | #002BE7 → #8200FF gradient | "max" wordmark |

All marks are hand-rolled SVGs (geometric approximations — official-looking, not pixel-perfect copies) to stay safe and avoid asset uploads.

## Card design (PlatformList rewrite)
Each card:
- Rounded-2xl, `glass` base, 1px ring tinted with the platform color, soft platform-colored glow shadow on hover.
- Left: 44×44 rounded-xl tile with platform `gradient` background and the inline SVG logo (white/black per contrast).
- Middle: platform name (bold, foreground), small "Stream now · SUB | DUB" caption in muted.
- Right: "Watch Now" pill button with platform brand color background + `ExternalLink` icon; entire card is also a single `<a target="_blank" rel="noopener noreferrer">` for tap-friendly mobile.
- Hover/active: `transition-all`, scale `1.01` on hover, `0.99` on active, glow intensifies, logo tile gets a subtle shimmer (CSS gradient sweep) via a `::after` element.
- Mobile-first: single column, full-width, comfortable tap targets (≥56px tall). Stack name/caption with `min-w-0 truncate`.

Loading/empty: if `getStreamingFor` returns nothing (shouldn't with fallback), render a small muted "Streaming info unavailable" line.

## KNOWN mappings refresh
Update curated mapping for the featured 7 anime to spread across new platforms realistically (e.g. add Hulu/Max where appropriate). Fallback stays deterministic by `malId` over the full 9-platform list, returning 2–3 platforms.

## PlatformChips
Keep current chip rendering, but swap the text-letter chip for the same inline `Logo` SVG scaled down (h-3 w-3) on a brand-gradient tile so hero badges match the cards. API unchanged.

## Out of scope
- No external logo image downloads (avoids trademark/asset hosting issues; SVG marks are inline).
- No changes to `_app.anime.$id.tsx` markup beyond what re-renders automatically.
- No new routes, no DB.

## Acceptance
- Detail page → "Where to Watch" shows up to 9 branded cards depending on title.
- Each card opens the platform's search URL for that title in a new tab.
- Cards visibly differ by brand color, with smooth hover/tap animation.
- Hero `PlatformChips` row still renders and matches the new branding.
- Works at 375px width without overflow; tap targets feel native.
