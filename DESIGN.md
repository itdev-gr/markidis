# Design System: Elysee Irrigation — Home Page

**Source:** `/Users/marios/Desktop/Cursor/markidis/_elysse-ref/src/pages/index.astro`
**Stack:** Astro 5, Tailwind v4 (`@theme`), Fraunces + Inter Tight + JetBrains Mono variable, GSAP 3.13 (ScrollTrigger / Observer / Flip), Lenis smooth scroll, OGL fragment shader for particle background.

---

## 1. Visual Theme & Atmosphere

A **quiet, agrarian editorial** aesthetic — cream paper, deep-forest ink, a single water-blue accent. The page reads like a letterpress monograph that occasionally inverts to a dark hardcover. Density is low: hero, manifesto, sectors, cameo, counters and map each take a full viewport. Whitespace is generous, typography does the heavy lifting, and motion is reserved — long ease-out-expo entrances, scroll-driven word reveals, a softly drifting WebGL gradient that recolors as you scroll. Italic Fraunces (with optical-size 144 + slant -8) is used as a *highlight color* on key words ("flow", "fit", "grow") rather than for whole headlines. The atmosphere is "infrastructure that lasts" — confident, slow, technical without being cold.

**Mood adjectives:** Hushed · Editorial · Agrarian · Slow-motion · Warm-cream · Forest-deep · Letterpress · Pinned-and-paced.

---

## 2. Color Palette & Roles

### Surfaces
- **Warm Cream Canvas** (`#f6f4ec`) — `--surface-deep`. Default page background; the entire site lives on this color. Also `color1` of the WebGL flow shader.
- **Cream Relief** (`#ecebe1`) — `--surface-relief`. Card backgrounds inside Insights cards and subtle elevation panels.
- **Forest Inversion** (`#0c1a14`) — `--surface-break`. The Manifesto pin animates to this and inverts type to cream; also the GlobalMap container's deep-night background.

### Ink
- **Deep Forest Ink** (`#0c1a14`) — `--text-primary`. All headlines, body text on cream.
- **Mossy Secondary** (`#3d5a48`) — `--text-secondary`. Body paragraphs and subdued copy.
- **Lichen Mono** (`#2d5540`) — `--text-mono`. The 11px uppercase JetBrains Mono micro-labels (eyebrows, captions, timestamps).

### Accents (a strict green hierarchy + one cool counter)
- **Bright Forest** (`#1a3d2a`) — `--accent-bright`. The "highlight ink" — focus rings, hover states, italic-emphasized words ("of flow", "to fit", "grow"), button text.
- **Mid Forest** (`#3d6b52`) — `--accent-primary`. Pill-button strokes and decorative anchors.
- **Deep Forest** (`#0f2a1d`) — `--accent-deep`. The single SVG wave that draws across the manifesto.
- **Cool Water** (`#24545a`) — `--accent-water`. Lone non-green accent; reserved for water/liquid contexts.

### Utility
- **Hairline** (`rgba(12, 26, 20, 0.14)`) — `--hairline`. All dividers, card borders, footer rules.

---

## 3. Typography Rules

### Three families, all variable

| Token             | Family                | Use                                                             |
| ----------------- | --------------------- | --------------------------------------------------------------- |
| `--font-display`  | **Fraunces** (var)    | Every heading, hero word-reveals, marquee, counters             |
| `--font-body`     | **Inter Tight** (var) | Body copy, paragraph text                                       |
| `--font-mono`     | **JetBrains Mono**    | Eyebrows, micro-labels, timestamps, button labels               |

All three are loaded as `woff2-variations` from `/fonts/*-variable.woff2` with `font-display: swap`.

### Heading defaults

```css
h1, h2, h3, h4 {
  font-family: var(--font-display);
  font-weight: 500;
  letter-spacing: -0.02em;
  line-height: 0.95;
}
```
Headings sit **medium weight**, **tightly tracked** (–0.02em), with a **near-1.0 line-height** — the typographic posture of an editorial cover.

### Display scale (responsive clamp)

| Class         | Clamp                            | Used by                                  |
| ------------- | -------------------------------- | ---------------------------------------- |
| `display-xl`  | `clamp(64px, 12vw, 180px)`       | Hero ("The flow of growth.")             |
| `display-lg`  | `clamp(56px, 9vw, 140px)`        | Cameo ("Engineered to fit.")             |
| `display-md`  | `clamp(40px, 6vw, 96px)`         | GlobalMap, Insights, FourWorlds header   |
| `display-sm`  | `clamp(28px, 3.4vw, 48px)`       | Tertiary headlines                       |

Manifesto and Counters use **inline `style="font-size: clamp(…)"`** instead of a class because they need bespoke ranges (`clamp(28px, 3.6vw, 56px)` and `clamp(56px, 7.2vw, 110px)`).

### Special families

```css
.mono {
  font-family: var(--font-mono);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  font-size: 11px;
  color: var(--text-mono);
}
.serif-italic {
  font-family: var(--font-display);
  font-style: italic;
  font-variation-settings: "opsz" 144, "slnt" -8;
  color: var(--accent-bright);
}
```
- `.mono` is **the** micro-typography — every section starts with a Roman-numeral eyebrow ("III · Four worlds, one flow").
- `.serif-italic` is the system's signature flourish: the Fraunces optical-size axis cranks to 144 (largest cut), slant axis tilts to –8°, and color shifts to `--accent-bright`. It's used as a **single-word emphasis** inside otherwise-roman headlines.

### Roman-numeral section index
Every major section is prefixed with a roman-numeral eyebrow: `I · …` (Hero implicit), `II · …` (Manifesto), `III · Four worlds, one flow`, `IV · Featured Series`, `V · …` (Counters), `VI · Global reach`, `VII · Insights`, `VIII · Say hello`. This is a load-bearing structural device, not decoration.

---

## 4. Component Stylings

### Buttons (`Button.astro`)

**Primary (pill with bottom-up fill)**
- **Shape:** Pill — `rounded-full`.
- **Stroke:** 1px `--accent-primary`.
- **Type:** 11px JetBrains Mono, uppercase, +0.18em tracking, color `--accent-bright`.
- **Padding:** `px-6 py-3`.
- **Hover:** A `--accent-bright` panel scales up from `scale-y-0` along `transform-origin: bottom`, `duration-500`, `ease-[cubic-bezier(0.16,1,0.3,1)]`. Foreground text flips to `--surface-deep` on hover.

**Arrow (chevron-in-circle)**
- Mono label + 40 × 40 pill-bordered arrow (`→`) that **rotates 45° on hover** and switches its border from `--hairline` to `--accent-bright`.

### Cards / Containers
- **Insights cards:** rounded-md, 4:3 cover image at top, hairline divider with mono date stamp; image scales `1.06×` over 700ms ease-out-expo on group-hover.
- **GlobalMap container:** `aspect-[2/1]`, `rounded-md`, hairline border, dark forest gradient fill, SVG arcs over it.
- **FourWorlds image:** **clip-path polygon** `polygon(0 0, 100% 6%, 94% 100%, 0 94%)` — a subtly skewed parallelogram, the only non-rectangular shape in the system. Aspect `3:4`.
- **Bullets:** Pill chips with `border border-hairline rounded-full px-3 py-2` over `bg-surface-deep/60` (translucent cream).

### Inputs / Forms
The reference home page has **no form inputs** — contact uses three columns of static type. Treat forms (when needed) as Mono-labeled, hairline-underlined fields, never boxed.

### Nav (`Nav.astro`)
- Fixed top, `h-16`, `bg-surface-deep/70 backdrop-blur-md`.
- Logo is `font-display text-xl` left.
- Links are `mono` 11px uppercase, gap-8, hover-color `--accent-bright`.
- Auto-hide on scroll-down (`translateY(-100%)` with `cubic-bezier(0.65, 0, 0.35, 1)` 350ms), reveal on scroll-up.

---

## 5. Layout Principles

### Page-margin token system
The whole site keys off one CSS variable:

```css
--margin: 80px;                  /* desktop */
@media (max-width: 1023px) { --margin: 48px; }
@media (max-width: 767px)  { --margin: 24px; }
```

Five utility classes plug in:
- `.page-x` — `padding-left/right: var(--margin)` (every section uses this).
- `.page-l` / `.page-r` — single-side variants for marquees.
- `.page-pin-l` / `.page-pin-r` — `left:` / `right:` for absolute pins.
- `.page-w` — `width: var(--margin)` for spacer divs at marquee ends.

### Container & grid
- `--container: 1440px` (max).
- `--gutter: 24px` (16px mobile, 20px tablet).
- 12-column grid via Tailwind (`grid grid-cols-12 gap-6`) inside hero-style sections.

### Section pacing
Every section is **min-height: 100vh** (or `min-h-screen`) with center alignment. A few exceptions:
- Manifesto: `h-screen` inside a wrap that's pinned for `+=150%` of viewport.
- EpsilonCameo: `min-h-[120vh]` to give the parts room to assemble.
- Insights: `min-h-[80vh]`, horizontally drag-scrollable.
- ContactFooter: `min-h-[90vh]`.

### Stacking / z-index
- `z-50` — fixed Nav.
- `z-40` — mobile menu overlay.
- `z-10` — every content section (sits above the WebGL background).
- `z-0` — the fixed-position particle-flow `<canvas>`.

---

## 6. Section Archetypes (the home-page sequence)

Every section opens with a **`mono` Roman-numeral eyebrow**, then a Fraunces headline (often with one italicized accent word), then content. The page is a single editorial scroll.

### Hero — `[data-section="hero"]`
- Full-viewport, page-x padded, content bottom-anchored.
- `.mono` eyebrow → **SplitHeadline** (`display-xl`) where each word is a `<span data-word>` translated `100%` below its `overflow-hidden` wrap; the timeline lifts them in with `expo.out` stagger.
- Italic accent words (passed via `emphasisWords` prop) get `.serif-italic` automatically.
- Bottom-right scroll hint: a 14px-tall hairline scaled from 0 over 800ms.

### Manifesto — `[data-section="manifesto"]`
- A `data-manifesto-wrap` is **pinned for 150% of viewport** while the user scrubs.
- The body text is split into `<span data-mword>` words that fade from `opacity: 0.25` to 1 over the scrub.
- A `<path data-manifesto-wave>` SVG wave (`stroke-dasharray: 2500`) draws itself across the section.
- On scrub-progress, GSAP **inverts the entire section** to `--surface-break` background + `--surface-deep` text, then back out on leave.
- On enter the global particle preset shifts to `counters`; on leave-back, to `hero`.

### FourWorlds — `[data-section="four-worlds"]`
- Pinned **horizontal-scroll** carousel: 4 `<article data-world-panel>`, each `w-screen h-screen`, swept by translating the `data-worlds-track` `-window.innerWidth × (n-1)` while the section is pinned.
- Sticky header at top (gradient fade-out from `surface-deep`) holds eyebrow + 2-line `display-md` headline ("Four worlds, / one flow.").
- Each panel is a 7:5 grid: huge sector name (`clamp(56px, 9.5vw, 148px)`) + tagline + pill-bullet list (left), clip-path-skewed 3:4 image (right).
- Bottom strip of `n` ticks scales the active one to `2.4×` and recolors it `#aee4be` on entry.
- Mobile fallback: the pin is killed, `flex-direction: column`, each panel stacks at `100vh`.
- Each panel carries a `data-preset` (`agri`, `landscape`, `building`, `industry`) that **swaps the WebGL flow preset** as it becomes active.

### EpsilonCameo — `[data-section="epsilon-cameo"]`
- 12-col grid: SVG schematic on the left (col-span-7), mono eyebrow + `display-lg` headline + paragraph + primary button on the right (col-span-5).
- The SVG **idles with a 40s 360° rotation** (`gsap.to ... repeat: -1, ease: 'none'`).
- On scrub, 5 parts assemble: `body` (scale-down + fade), `oring` (scale-up + fade), `collet` (slide from –x), `insert` (slide from +x), `nut` (drop from –y) — staggered 0.2s apart.
- Particle preset shifts to `epsilon`.

### Counters — `[data-section="counters"]`
- 3-column grid (1-col on mobile), each cell: mono `0n` eyebrow → big number (`clamp(56px, 7.2vw, 110px)`, Fraunces, near-zero line-height) → label → mono caption.
- On enter (`top 70%`, `once: true`), each `[data-counter]` tweens from 0 to its `data-target` over 1800ms, formatted with `Intl.NumberFormat('en-US')` and a suffix.
- Particle preset swaps to `counters` (re-enter) / `epsilon` (leave-back).

### GlobalMap — `[data-section="global-map"]`
- Mono eyebrow + 2-line `display-md` headline ("Engineered in Cyprus. / Carried worldwide.").
- 2:1 dark-forest-gradient panel containing an SVG world canvas. HQ + market locations are projected via `equirectangular` (lng/lat → x/y on a 1200×600 grid).
- A pulsing concentric circle marks HQ (animated `r` and `opacity`).
- On enter (`top 65%`, `once: true`), each arc draws (`stroke-dashoffset` 2000 → 0, 1.1s, 0.18s stagger), then a dot fades-in and pops `0.4× → 1.4× → 1×` (yoyo) at the destination.
- Below the map, a single mono line lists the routes.

### Insights — `[data-section="insights"]`
- `min-h-[80vh]`, `py-24`. Header row: mono eyebrow + `display-md` headline left; arrow-style "View all →" right.
- Horizontal track (`flex gap-8 overflow-x-auto`) holds article cards, each `w-[min(520px,80vw)]`. The track is **drag-scrollable** via GSAP `Observer` (pointer + touch).
- Cards: 4:3 cover (image scales `1.06×` on group-hover, 700ms ease-out-expo) + mono row (tag · hairline · date) + Fraunces title + secondary excerpt.
- Trailing `.page-w` spacer ensures the last card aligns to right margin.

### ContactFooter — `[data-section="contact"]`
- Full-bleed, `pt-32 pb-12`, mono eyebrow + 2-line headline (each `<span class="inline-block">` masked-up on enter for 900ms expo.out).
- 3-column meta block (`max-w-5xl`): "Head office", "Talk to us", "Elsewhere" — all mono labels + cream-link list, hovers to `--accent-bright`.
- A massive **infinite marquee** of the brand wordmark at `clamp(120px, 18vw, 260px)`, `opacity-60`, that tweens `xPercent: -50` over 30s and **time-scales by 1× to 11×** with scroll velocity.
- Hairline-divided baseline: copyright · tagline · legal nav.

---

## 7. Motion Vocabulary

### Easing tokens
```css
--ease-out-expo:    cubic-bezier(0.16, 1, 0.3, 1);   /* default for entrances + hover panels */
--ease-in-out-cubic: cubic-bezier(0.65, 0, 0.35, 1); /* nav hide/show, contemplative reversals */
```
GSAP defaults to `'expo.out'` for most timelines. ScrollTrigger scrubs use `0.5–0.8` (slight smoothing).

### Motion principles
1. **Smooth scroll is mandatory.** `Lenis` is initialized on every page (`duration: 1.1`, `easing: t => 1 - 2^(-10t)`, `smoothWheel: true`) and routed to `gsap.ticker` so ScrollTrigger updates are perfectly in sync.
2. **Words, not sentences.** All hero / manifesto / contact headlines are split into per-word spans for staggered transforms.
3. **Pin-and-scrub is the central motion grammar.** Manifesto, FourWorlds, and Cameo all `pin` their trigger and progress with the user's scroll instead of triggering once.
4. **One persistent atmosphere layer.** The OGL particle-flow background is a **single canvas** that never re-instantiates — sections only call `__flow.setPreset(name, ms)` to lerp colors / density / speed across an 8-preset set (`hero`, `agri`, `landscape`, `building`, `industry`, `counters`, `map`, `epsilon`).
5. **Reduced motion is fully honored.** When `prefers-reduced-motion: reduce`:
   - Lenis is **not** initialized.
   - The particle-flow returns `null` and never paints.
   - All `[data-word]` elements are immediately set to `translateY(0)`, all `[data-mword]` to `opacity:1`, and counters are filled in directly with their target value.

### GSAP plugin set
`ScrollTrigger`, `Observer`, `Flip` — registered once via `registerGSAP()` (idempotent guard).

### Auto-budgeting
The OGL render loop counts frames where `dt > 33ms`; if 180+ slow frames accumulate (~3s sub-30fps), it self-destructs the canvas. A graceful degradation primitive worth preserving.

---

## 8. Layout Primitives & Utility Classes (cheat sheet)

| Class                                                           | Purpose                                              |
| --------------------------------------------------------------- | ---------------------------------------------------- |
| `.page-x` / `.page-l` / `.page-r`                               | Apply `--margin` as horizontal padding.              |
| `.page-pin-l` / `.page-pin-r` / `.page-w`                       | Position absolutes & spacers along the same margin.  |
| `.mono`                                                         | The 11/0.18em uppercase eyebrow class.               |
| `.serif-italic`                                                 | Highlight-color italic Fraunces (single-word use).   |
| `.display-xl/lg/md/sm`                                          | Responsive Fraunces clamps.                          |
| `bg-surface-deep` / `text-text-primary` / `border-hairline` …   | Tailwind v4 tokens generated from the `@theme` block. |

---

## 9. Adapting to **markidis (skypulse)** — design directives

When porting Elysse's home onto SkyPulse content, **preserve the design system, swap the content**:

- **Color palette:** Use Elysse's cream/forest as-is — it is the design's identity. **Do not** paste over it with the existing skypulse purple. (If a brand-color compromise is required, propose a single `--accent-water` retint to the SkyPulse purple `#8B6BAF` in the `--accent-bright` slot only and discuss before proceeding.)
- **Fonts:** Replace the Fraunces / Inter Tight / JetBrains Mono triad **only if** equivalents are already loaded by skypulse (they are not — skypulse uses Newsreader + a sans). Cleanest path: install the same three variable woff2 files into `skypulse/public/fonts/` and adopt them.
- **Section mapping** (Elysse → SkyPulse content):

  | Elysse section    | SkyPulse content source                                                      | Notes                                                                       |
  | ----------------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
  | Hero              | `i18n.overture.title` + `overture.italic`                                    | Use `SplitHeadline`, mark the italic.em words as emphasis.                  |
  | Manifesto         | `i18n.manifesto.gr` + `manifesto.en`                                         | Pinned + invert + word reveal.                                              |
  | FourWorlds        | `i18n.disciplines.cards` (4 disciplines)                                     | Each card = one panel; need a hero image per discipline.                    |
  | EpsilonCameo      | The "Process" steps OR a featured Work piece                                 | Best fit: replace the SVG schematic with a Vimeo poster + title + button.   |
  | Counters          | New stats (years active, productions, athletes) — **not in current strings** | Will need a new `i18n.counters` block.                                      |
  | GlobalMap         | Optional — skip if not strategic                                             | Or repurpose as "Composed in Athens · performed worldwide" map.             |
  | Insights          | `i18n.testimonials` OR Work videos as a horizontal track                     | Drag-scroll fits the Work videos beautifully.                               |
  | ContactFooter     | `i18n.cta` + Cta.astro form copy                                             | The infinite "ELYSEE" marquee becomes "SKYPULSE".                           |

- **Motion:** Adopt Elysse's pin/scrub/word-reveal grammar wholesale. Drop the existing skypulse GSAP "aurora" hero and `data-reveal` opacity-fade pattern in favor of word-by-word translateY reveals — they are objectively the stronger motion idiom for this typographic system.
- **Particle-flow background:** Optional but high-impact. If kept, retune the presets — the cream/forest hex values are baked into the shader and should be replaced with skypulse's equivalents only after the palette decision above.
- **Roman-numeral eyebrows:** Adopt them. They give the page its editorial spine; skypulse's `display-italic` opus-numbers are already conceptually adjacent.

---

*Generated by the design-md skill, adapted for an Astro-source codebase rather than a Stitch project.*
