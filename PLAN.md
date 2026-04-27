# Elysse Home Port → SkyPulse — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the SkyPulse home page (both `el` and `en`) with a port of Elysse's home-page section sequence (Hero → Manifesto → FourWorlds → CameoFeature → Counters → Insights → ContactFooter), reusing all existing SkyPulse content (i18n strings, Vimeo videos, images) and brand color (purple `#8B6BAF`).

**Architecture:** New section components live in `skypulse/src/components/home/` (separate from existing `sections/` so other pages keep working). Tokens, utility classes, and motion-init code are added in-place to the existing `global.css` and `motion.ts` — no parallel scaffolding. Each section accepts a `lang` prop and reads from `pick(lang)` so bilingual support is automatic. The existing `Page.astro` layout (Header + Footer + Vimeo overlay) wraps the new home untouched. Brand purple replaces Elysse's forest green; SkyPulse's Newsreader serif replaces Fraunces (semantically equivalent: both are variable-axis editorial serifs with optical-size and italic axes).

**Tech Stack:**
- Astro 6.1.6, Tailwind v4 (via `@theme`)
- GSAP 3.15 + ScrollTrigger + Flip (already wired) — adds `Observer` for drag-scroll
- Lenis 1.3.21 smooth scroll (already wired)
- @vimeo/player 2.30 (already wired via `initVideoTiles` Flip overlay)
- Newsreader (variable, italic + opsz axes), Geist, JetBrains Mono — loaded from Google Fonts in `global.css`

**Reference docs:**
- `/Users/marios/Desktop/Cursor/markidis/DESIGN.md` — extracted Elysse semantic design system
- `/Users/marios/Desktop/Cursor/markidis/_elysse-ref/` — verbatim Elysse source (do not edit; read-only reference)

---

## File Structure

### New files (create)

| Path                                                     | Responsibility                                                              |
| -------------------------------------------------------- | --------------------------------------------------------------------------- |
| `skypulse/src/components/home/SplitHeadline.astro`       | Per-word `<span data-word>` wrapping for stagger-reveal headlines           |
| `skypulse/src/components/home/Hero.astro`                | Full-viewport intro: mono eyebrow + split-word headline + scroll hint       |
| `skypulse/src/components/home/Manifesto.astro`           | Pinned + scrubbed word-by-word reveal + color-invert + SVG wave             |
| `skypulse/src/components/home/FourWorlds.astro`          | Pinned horizontal-scroll 4-panel carousel for first 4 disciplines           |
| `skypulse/src/components/home/CameoFeature.astro`        | Featured Vimeo (Aurora Variations) + scrubbed reveal of label/title/CTA    |
| `skypulse/src/components/home/Counters.astro`            | 3-column tweened counters (148 / 37 / 12) with mono labels                  |
| `skypulse/src/components/home/Insights.astro`            | Drag-scrollable horizontal track of 4 Work videos                           |
| `skypulse/src/components/home/ContactFooter.astro`       | Split-up "Begin your composition." headline + 3-col meta + infinite marquee |

### Modified files

| Path                                       | Change                                                                                                  |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| `skypulse/src/styles/global.css`           | Append Elysse-style margin tokens, page-* utilities, display-xl/lg/md/sm classes, .serif-italic helper  |
| `skypulse/src/scripts/motion.ts`           | Register `Observer` plugin, add 6 init functions for the new sections, call them from boot              |
| `skypulse/src/pages/index.astro`           | Swap section imports to `home/*`, drop old section sequence                                             |
| `skypulse/src/pages/en/index.astro`        | Same swap, `lang="en"`                                                                                  |

### Untouched (intentionally)

- `skypulse/src/components/sections/*.astro` — kept; other pages may import them. Removal is out of scope for this plan.
- `skypulse/src/layouts/Base.astro`, `Page.astro`, `Header.astro`, `Footer.astro` — reused as-is.
- All non-home pages (`contact/`, `process/`, `studio/`, `work/`, plus `en/` mirrors).

---

## Task 1: Add Elysse-style design tokens & utilities to `global.css`

**Files:**
- Modify: `skypulse/src/styles/global.css` (append at end of file, before the `@media (prefers-reduced-motion …)` block)

- [ ] **Step 1.1: Read the current file end**

Run: `tail -20 skypulse/src/styles/global.css`
Expected: ends with `@media (prefers-reduced-motion: reduce) { … }` block.

- [ ] **Step 1.2: Insert the Elysse tokens & utilities just above the reduced-motion block**

In `skypulse/src/styles/global.css`, find the line `@media (prefers-reduced-motion: reduce) {` and insert the following block immediately above it:

```css
/* ============================================================
   ELYSSE-STYLE PORT TOKENS (purple-recolored)
   ============================================================ */
:root {
  --margin: 80px;
  --gutter: 24px;
  --container-elysse: 1320px;
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out-cubic: cubic-bezier(0.65, 0, 0.35, 1);

  --surface-deep: #FFFFFF;
  --surface-relief: #F3EEF8;
  --surface-break: #1A1A2E;
  --accent-bright: #8B6BAF;
  --accent-primary: #5B3E8A;
  --hairline-rgba: rgba(26, 26, 46, 0.14);
}
@media (max-width: 1023px) { :root { --margin: 48px; --gutter: 20px; } }
@media (max-width: 767px)  { :root { --margin: 24px; --gutter: 16px; } }

.page-x { padding-left: var(--margin); padding-right: var(--margin); }
.page-l { padding-left: var(--margin); }
.page-r { padding-right: var(--margin); }
.page-pin-l { left: var(--margin); }
.page-pin-r { right: var(--margin); }
.page-w { width: var(--margin); }

.display-xl { font-family: "Newsreader", serif; font-weight: 300; font-variation-settings: "opsz" 144; letter-spacing: -0.02em; line-height: 0.92; font-size: clamp(64px, 12vw, 180px); }
.display-lg { font-family: "Newsreader", serif; font-weight: 300; font-variation-settings: "opsz" 144; letter-spacing: -0.02em; line-height: 0.92; font-size: clamp(56px, 9vw, 140px); }
.display-md { font-family: "Newsreader", serif; font-weight: 300; font-variation-settings: "opsz" 144; letter-spacing: -0.02em; line-height: 0.95; font-size: clamp(40px, 6vw, 96px); }
.display-sm { font-family: "Newsreader", serif; font-weight: 300; font-variation-settings: "opsz" 72;  letter-spacing: -0.015em; line-height: 1.0;  font-size: clamp(28px, 3.4vw, 48px); }

.serif-italic {
  font-family: "Newsreader", serif;
  font-style: italic;
  font-weight: 300;
  font-variation-settings: "opsz" 144;
  color: var(--accent-bright);
}

.eyebrow-mono {
  font-family: "JetBrains Mono", ui-monospace, monospace;
  font-weight: 500;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  font-size: 11px;
  color: #8E8E9F;
}

/* word-reveal scaffolding for SplitHeadline + manifesto */
[data-word-wrap] { display: inline-block; overflow: hidden; vertical-align: bottom; }
[data-word]      { display: inline-block; will-change: transform; transform: translateY(100%); }
[data-mword]     { opacity: 0.18; transition: color 0.3s ease; }

/* manifesto pin invert helper */
.invert-on-pin { transition: background-color 0.6s var(--ease-in-out-cubic), color 0.6s var(--ease-in-out-cubic); }

/* hairline */
.border-hairline { border-color: var(--hairline-rgba) !important; }
```

- [ ] **Step 1.3: Build to verify no CSS syntax errors**

Run: `cd skypulse && npm run build`
Expected: `[build] Complete!` (warnings about unused IDs are fine; errors are not).

- [ ] **Step 1.4: Commit**

```bash
git add skypulse/src/styles/global.css
git commit -m "Home port: add Elysse-style margin/typography tokens + utilities"
```

---

## Task 2: Extend `motion.ts` with Observer + new init functions

**Files:**
- Modify: `skypulse/src/scripts/motion.ts`

- [ ] **Step 2.1: Add Observer to the GSAP plugin import + registration**

Open `skypulse/src/scripts/motion.ts`. Replace lines 1–7 (the imports + `gsap.registerPlugin(...)` call) with:

```ts
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Observer } from "gsap/Observer";
import { Flip } from "gsap/Flip";
import Lenis from "lenis";
import VimeoPlayer from "@vimeo/player";

gsap.registerPlugin(ScrollTrigger, Observer, Flip);
```

- [ ] **Step 2.2: Append the 7 new init functions before the `BOOT` block**

Find the `BOOT` comment block near the bottom of `motion.ts` (around line 412 — `document.addEventListener("DOMContentLoaded", …)`). Insert this block of code immediately above the `BOOT` comment:

```ts
/* ============================================================
   HOME-PORT: SPLIT HEADLINE WORD REVEAL
   ============================================================ */
function initSplitHeadlines() {
  if (reduceMotion) {
    document.querySelectorAll<HTMLElement>("[data-word]").forEach(w => { w.style.transform = "translateY(0)"; });
    return;
  }
  document.querySelectorAll<HTMLElement>("[data-split-headline]").forEach((h) => {
    gsap.to(h.querySelectorAll("[data-word]"), {
      y: 0,
      duration: 1.0,
      ease: "expo.out",
      stagger: 0.08,
      scrollTrigger: { trigger: h, start: "top 88%", once: true },
    });
  });
}

/* ============================================================
   HOME-PORT: HERO SCROLL HINT
   ============================================================ */
function initHeroScrollHint() {
  if (reduceMotion) return;
  const hint = document.querySelector<HTMLElement>("[data-hero-scrollhint]");
  if (!hint) return;
  gsap.from(hint, { scaleY: 0, transformOrigin: "top center", duration: 0.8, ease: "power2.inOut", delay: 0.6 });
}

/* ============================================================
   HOME-PORT: MANIFESTO PIN + WORD REVEAL + COLOR INVERT + SVG WAVE
   ============================================================ */
function initManifestoPin() {
  const wrap = document.querySelector<HTMLElement>("[data-manifesto-wrap]");
  if (!wrap) return;
  if (reduceMotion) {
    wrap.querySelectorAll<HTMLElement>("[data-mword]").forEach(w => { w.style.opacity = "1"; });
    return;
  }

  ScrollTrigger.create({
    trigger: wrap,
    start: "top top",
    end: "+=150%",
    pin: true,
    scrub: 0.8,
    onEnter:     () => gsap.to(wrap, { backgroundColor: "#1A1A2E", color: "#FFFFFF", duration: 0.6 }),
    onLeave:     () => gsap.to(wrap, { backgroundColor: "#FFFFFF", color: "#1A1A2E", duration: 0.6 }),
    onEnterBack: () => gsap.to(wrap, { backgroundColor: "#1A1A2E", color: "#FFFFFF", duration: 0.6 }),
    onLeaveBack: () => gsap.to(wrap, { backgroundColor: "#FFFFFF", color: "#1A1A2E", duration: 0.6 }),
    animation: gsap.timeline()
      .to("[data-mword]", { opacity: 1, stagger: { amount: 1 } }, 0)
      .to("[data-manifesto-wave]", { strokeDashoffset: 0, duration: 1, ease: "none" }, 0),
  });
}

/* ============================================================
   HOME-PORT: FOUR WORLDS HORIZONTAL PIN
   ============================================================ */
function initFourWorlds() {
  const pin = document.querySelector<HTMLElement>("[data-worlds-pin]");
  const track = document.querySelector<HTMLElement>("[data-worlds-track]");
  const panels = gsap.utils.toArray<HTMLElement>("[data-world-panel]");
  const ticks = gsap.utils.toArray<HTMLElement>("[data-worlds-tick]");
  if (!pin || !track || panels.length === 0) return;
  if (reduceMotion || window.innerWidth < 768) {
    if (track) { track.style.flexDirection = "column"; track.style.position = "static"; track.style.transform = "none"; }
    pin.style.height = "auto";
    panels.forEach((p) => { p.style.width = "100vw"; p.style.height = "100vh"; });
    return;
  }
  const total = panels.length;
  ScrollTrigger.create({
    trigger: pin,
    start: "top top",
    end: () => `+=${window.innerWidth * (total - 1)}`,
    pin: true,
    scrub: 0.5,
    anticipatePin: 1,
    animation: gsap.to(track, { x: () => -window.innerWidth * (total - 1), ease: "none" }),
    onUpdate: (self) => {
      const idx = Math.round(self.progress * (total - 1));
      ticks.forEach((t, i) => gsap.to(t, { scaleX: i === idx ? 2.4 : 1, backgroundColor: i === idx ? "#8B6BAF" : "#1A1A2E1f", duration: 0.4 }));
    },
  });
}

/* ============================================================
   HOME-PORT: CAMEO FEATURE — scrubbed assembly of label/title/cta
   ============================================================ */
function initCameoFeature() {
  const section = document.querySelector<HTMLElement>("[data-section='cameo-feature']");
  if (!section || reduceMotion) return;
  ScrollTrigger.create({
    trigger: section,
    start: "top 70%",
    end: "bottom 30%",
    scrub: 0.6,
    animation: gsap.timeline()
      .from("[data-cameo-eyebrow]", { y: 40, opacity: 0, duration: 1 }, 0)
      .from("[data-cameo-title]",   { y: 60, opacity: 0, duration: 1 }, 0.2)
      .from("[data-cameo-body]",    { y: 30, opacity: 0, duration: 1 }, 0.4)
      .from("[data-cameo-cta]",     { y: 30, opacity: 0, duration: 1 }, 0.6),
  });
}

/* ============================================================
   HOME-PORT: INSIGHTS DRAG-SCROLL
   ============================================================ */
function initInsightsDrag() {
  const track = document.querySelector<HTMLElement>("[data-insights-track]");
  if (!track) return;
  let dragging = false, startX = 0, startScroll = 0;
  Observer.create({
    target: track,
    type: "pointer,touch",
    onPress: (self) => {
      dragging = true; startX = self.x ?? 0; startScroll = track.scrollLeft;
      track.style.cursor = "grabbing";
    },
    onDrag: (self) => {
      if (!dragging) return;
      track.scrollLeft = startScroll - ((self.x ?? 0) - startX);
    },
    onRelease: () => { dragging = false; track.style.cursor = "grab"; },
  });
}

/* ============================================================
   HOME-PORT: CONTACT FOOTER MARQUEE + HEADLINE
   ============================================================ */
function initContactFooter() {
  const section = document.querySelector<HTMLElement>("[data-section='contact-footer']");
  if (!section) return;
  if (!reduceMotion) {
    gsap.from("[data-contact-headline] span", {
      y: "100%", opacity: 0, stagger: 0.08, duration: 0.9, ease: "expo.out",
      scrollTrigger: { trigger: section, start: "top 70%", once: true },
    });
  }
  const marquee = section.querySelector<HTMLElement>("[data-footer-marquee]");
  if (marquee && !reduceMotion) {
    gsap.to(marquee, { xPercent: -50, duration: 30, ease: "none", repeat: -1 });
  }
}
```

- [ ] **Step 2.3: Wire the new inits into the `BOOT` block**

In the `document.addEventListener("DOMContentLoaded", () => { … })` block at the bottom, add the new init calls so the block reads:

```ts
document.addEventListener("DOMContentLoaded", () => {
  initLenis();
  initMagnetic();
  initReveals();
  initWaveform();
  initPulseGrid();
  initHeroTimeline();
  initVideoTiles();
  initCounters();
  initMarquee();
  // Home-port additions
  initSplitHeadlines();
  initHeroScrollHint();
  initManifestoPin();
  initFourWorlds();
  initCameoFeature();
  initInsightsDrag();
  initContactFooter();
});
```

- [ ] **Step 2.4: Build to verify no TS / import errors**

Run: `cd skypulse && npm run build`
Expected: `[build] Complete!` with no TypeScript or unresolved-import errors.

- [ ] **Step 2.5: Commit**

```bash
git add skypulse/src/scripts/motion.ts
git commit -m "Home port: register Observer + add 7 home-section motion inits"
```

---

## Task 3: SplitHeadline component

**Files:**
- Create: `skypulse/src/components/home/SplitHeadline.astro`

- [ ] **Step 3.1: Create the file**

Write `skypulse/src/components/home/SplitHeadline.astro` with:

```astro
---
interface Props {
  text: string;
  emphasisWords?: string[];
  /** Tailwind/utility classes for the <h1> element (e.g. "display-xl"). */
  class?: string;
}
const { text, emphasisWords = [], class: className = "display-xl" } = Astro.props;
const words = text.split(/\s+/);
const isEmphasis = (w: string) =>
  emphasisWords.some((e) => e.toLowerCase() === w.toLowerCase().replace(/[.,;:!?]/g, ""));
---
<h1 class:list={[className, "inline-block"]} data-split-headline>
  {words.map((w, i) => (
    <span data-word-wrap>
      <span class:list={[isEmphasis(w) && "serif-italic"]} data-word>
        {w}{i < words.length - 1 ? " " : ""}
      </span>
    </span>
  ))}
</h1>
```

- [ ] **Step 3.2: Verify it compiles**

Run: `cd skypulse && npm run build`
Expected: `[build] Complete!`. (The component isn't imported anywhere yet, so it'll be a no-op build, but Astro still type-checks `.astro` files in `src/`.)

- [ ] **Step 3.3: Commit**

```bash
git add skypulse/src/components/home/SplitHeadline.astro
git commit -m "Home port: add SplitHeadline word-reveal component"
```

---

## Task 4: Hero section

**Files:**
- Create: `skypulse/src/components/home/Hero.astro`

- [ ] **Step 4.1: Create the file**

Write `skypulse/src/components/home/Hero.astro` with:

```astro
---
import SplitHeadline from "./SplitHeadline.astro";
import { pick, type Lang } from "../../i18n/strings";

interface Props { lang?: Lang; }
const { lang = "el" } = Astro.props;
const s = pick(lang).overture;

// Emphasize the words inside `italic.em` so they get .serif-italic styling.
const emphasis = s.italic.em.split(/\s+/);
---
<section data-section="hero" class="relative z-10 min-h-screen flex flex-col justify-center page-x pb-24" aria-label="Intro">
  <p class="eyebrow-mono mb-8">Sky Pulse · Athens · {lang === "el" ? "από το 2020" : "since 2020"}</p>

  <SplitHeadline text={s.title} class="display-xl" />

  <p class="display-sm mt-10 max-w-[40ch]">
    {s.italic.pre}<span class="serif-italic">{s.italic.em}</span>{s.italic.post}
  </p>

  <div class="absolute bottom-10 page-pin-r flex items-center gap-4 text-[#8E8E9F] eyebrow-mono">
    <span>{lang === "el" ? "Κύλισε" : "Scroll"}</span>
    <span class="block h-14 w-px origin-top bg-[#1A1A2E]" data-hero-scrollhint></span>
  </div>
</section>
```

- [ ] **Step 4.2: Build**

Run: `cd skypulse && npm run build`
Expected: `[build] Complete!`.

- [ ] **Step 4.3: Commit**

```bash
git add skypulse/src/components/home/Hero.astro
git commit -m "Home port: add Hero section"
```

---

## Task 5: Manifesto section

**Files:**
- Create: `skypulse/src/components/home/Manifesto.astro`

- [ ] **Step 5.1: Create the file**

Write `skypulse/src/components/home/Manifesto.astro` with:

```astro
---
import { pick, type Lang } from "../../i18n/strings";

interface Props { lang?: Lang; }
const { lang = "el" } = Astro.props;
const m = pick(lang).manifesto;

// Combine the gr block (pre + em + post) into a single string for word-stagger.
const fullText = `${m.gr.pre}${m.gr.em}${m.gr.post}`;
const words = fullText.split(/(\s+)/);
const eyebrow = lang === "el" ? "II · Το μανιφέστο μας" : "II · Our manifesto";
---
<section
  data-section="manifesto"
  data-manifesto-wrap
  class="invert-on-pin relative z-10 overflow-hidden bg-[#FFFFFF] text-[#1A1A2E]"
  aria-label="Manifesto"
>
  <div class="h-screen flex items-center page-x">
    <div class="max-w-full md:max-w-[58ch]">
      <p class="eyebrow-mono mb-8">{eyebrow}</p>
      <p class="font-display tracking-[-0.015em] leading-[1.12]" style="font-size: clamp(28px, 3.6vw, 56px);">
        {words.map((w) =>
          /^\s+$/.test(w) ? w : <span data-mword>{w}</span>
        )}
      </p>
    </div>

    <svg class="pointer-events-none absolute inset-0 w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="none" aria-hidden="true">
      <path
        data-manifesto-wave
        d="M0 600 C 300 520, 600 680, 900 580 S 1200 640, 1200 640"
        stroke="currentColor"
        stroke-width="1.5"
        fill="none"
        stroke-dasharray="2500"
        stroke-dashoffset="2500"
        opacity="0.45"
      />
    </svg>
  </div>
</section>
```

- [ ] **Step 5.2: Build**

Run: `cd skypulse && npm run build`
Expected: `[build] Complete!`.

- [ ] **Step 5.3: Commit**

```bash
git add skypulse/src/components/home/Manifesto.astro
git commit -m "Home port: add pinned Manifesto with word reveal + invert"
```

---

## Task 6: FourWorlds section

**Files:**
- Create: `skypulse/src/components/home/FourWorlds.astro`

- [ ] **Step 6.1: Create the file**

Write `skypulse/src/components/home/FourWorlds.astro` with:

```astro
---
import { pick, type Lang } from "../../i18n/strings";

interface Props { lang?: Lang; }
const { lang = "el" } = Astro.props;
const t = pick(lang);

// Use the first 4 disciplines (FS / RG / AG / SC).
const cards = t.disciplines.cards.slice(0, 4);
const eyebrow = lang === "el" ? "III · Τέσσερις κόσμοι, μία ροή" : "III · Four worlds, one flow";
const heading = lang === "el" ? ["Τέσσερις κόσμοι,", "μία ροή."] : ["Four worlds,", "one flow."];

// Image per card (use the existing thumb-1..4 in /media). thumb-1 = FS, thumb-2 = RG, thumb-3 = AG, thumb-4 = SC.
const images = ["/media/thumb-1.jpg", "/media/thumb-2.jpg", "/media/thumb-3.jpg", "/media/thumb-4.jpg"];
---
<section data-section="four-worlds" class="relative z-10" aria-label="Four disciplines">
  <div data-worlds-pin class="relative h-screen overflow-hidden">

    <header class="pointer-events-none absolute top-0 left-0 right-0 page-x pt-24 pb-8 z-20 bg-gradient-to-b from-white via-white/92 to-transparent">
      <p class="eyebrow-mono mb-3">{eyebrow}</p>
      <h2 class="display-md max-w-[18ch]">
        {heading[0]}<br />
        <span class="serif-italic">{heading[1]}</span>
      </h2>
    </header>

    <div data-worlds-track class="absolute inset-0 flex">
      {cards.map((c, i) => (
        <article data-world-panel class="flex-shrink-0 w-screen h-screen relative page-x flex items-end pb-28 pt-64">
          <div class="grid grid-cols-12 gap-6 w-full items-end">
            <div class="col-span-12 md:col-span-7">
              <p class="eyebrow-mono text-[#8B6BAF] mb-3">0{i + 1} / 04</p>
              <h3 class="display-lg leading-[0.9] tracking-[-0.025em]">{c.name}</h3>
              <p class="eyebrow-mono text-[#8E8E9F] mt-5 max-w-md">{c.code} · {c.note}</p>
            </div>
            <div class="col-span-12 md:col-span-5 relative">
              <div class="aspect-[3/4] w-full overflow-hidden halftone" style="clip-path: polygon(0 0, 100% 6%, 94% 100%, 0 94%);">
                <img src={images[i]} alt={c.name} class="w-full h-full object-cover" loading={i === 0 ? "eager" : "lazy"} />
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>

    <div class="pointer-events-none absolute bottom-8 page-pin-l page-pin-r flex gap-2 z-20">
      {cards.map(() => <span data-worlds-tick class="h-px flex-1 bg-[#1A1A2E1f] origin-left scale-x-100"></span>)}
    </div>

  </div>
</section>
```

- [ ] **Step 6.2: Build**

Run: `cd skypulse && npm run build`
Expected: `[build] Complete!`.

- [ ] **Step 6.3: Commit**

```bash
git add skypulse/src/components/home/FourWorlds.astro
git commit -m "Home port: add pinned FourWorlds horizontal-scroll section"
```

---

## Task 7: CameoFeature section (Aurora Variations Vimeo)

**Files:**
- Create: `skypulse/src/components/home/CameoFeature.astro`

- [ ] **Step 7.1: Create the file**

Write `skypulse/src/components/home/CameoFeature.astro` with:

```astro
---
import { pick, localeUrl, type Lang } from "../../i18n/strings";

interface Props { lang?: Lang; }
const { lang = "el" } = Astro.props;
const t = pick(lang);

// Featured video = first entry in work.videos (Aurora Variations).
const featured = t.work.videos[0];
const eyebrow = lang === "el" ? "IV · Επιλεγμένη σύνθεση" : "IV · Featured composition";
const headingPre = lang === "el" ? "Γραμμένο" : "Composed";
const headingEm  = lang === "el" ? "για τον πάγο." : "for the ice.";
const ctaLabel   = lang === "el" ? "Δες όλα τα έργα" : "View all work";
---
<section data-section="cameo-feature" class="relative z-10 min-h-[120vh] flex items-center page-x" aria-label="Featured composition">
  <div class="grid grid-cols-12 gap-6 w-full items-center">

    <div class="col-span-12 md:col-span-7">
      <button
        type="button"
        class="video-tile group relative aspect-[16/9] w-full overflow-hidden block bg-[#F3EEF8] cursor-pointer halftone"
        data-vimeo={featured.id}
        aria-label={`Play: ${featured.title}`}
      >
        <img src={featured.thumb} alt={featured.title} class="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]" loading="lazy" />
        <span class="absolute inset-0 grid place-items-center">
          <span class="inline-flex items-center justify-center w-20 h-20 rounded-full border border-white text-white">
            <svg width="22" height="22" viewBox="0 0 22 22"><path d="M6 3v16l14-8L6 3z" fill="currentColor"/></svg>
          </span>
        </span>
      </button>
    </div>

    <div class="col-span-12 md:col-span-5">
      <p class="eyebrow-mono text-[#8E8E9F] mb-4" data-cameo-eyebrow>{eyebrow}</p>
      <h2 class="display-lg leading-[0.9] tracking-[-0.02em]" data-cameo-title>
        {headingPre}<br/><span class="serif-italic">{headingEm}</span>
      </h2>
      <p class="mt-6 max-w-md text-[#8E8E9F] body-serif" data-cameo-body>{featured.desc}</p>
      <div class="mt-10" data-cameo-cta>
        <a class="sp-btn sp-btn-primary" href={localeUrl(lang, "/work")} data-magnetic="0.35">
          <span>{ctaLabel}</span>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7h12m0 0L8 2m5 5L8 12" stroke="currentColor" stroke-width="1.4"/></svg>
        </a>
      </div>
    </div>

  </div>
</section>
```

- [ ] **Step 7.2: Build**

Run: `cd skypulse && npm run build`
Expected: `[build] Complete!`.

- [ ] **Step 7.3: Commit**

```bash
git add skypulse/src/components/home/CameoFeature.astro
git commit -m "Home port: add CameoFeature with featured Vimeo + scrubbed reveal"
```

---

## Task 8: Counters section

**Files:**
- Create: `skypulse/src/components/home/Counters.astro`

- [ ] **Step 8.1: Create the file**

Write `skypulse/src/components/home/Counters.astro` with:

```astro
---
import { pick, type Lang } from "../../i18n/strings";

interface Props { lang?: Lang; }
const { lang = "el" } = Astro.props;
const s = pick(lang).studio;

// stats = [148, 37, 12], statsLabels = ["Programs scored", "National podiums", "Countries"]
const captions = lang === "el"
  ? ["Από το 2020", "Σε 4 αθλήματα", "Έδρα Αθήνα"]
  : ["Since 2020", "Across 4 disciplines", "HQ Athens"];
const eyebrow = lang === "el" ? "V · Με αριθμούς" : "V · By the numbers";
---
<section data-section="counters" class="relative z-10 min-h-screen flex flex-col justify-center page-x" aria-label="By the numbers">
  <p class="eyebrow-mono mb-12">{eyebrow}</p>
  <div class="w-full grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
    {s.stats.map((n, i) => (
      <div>
        <p class="eyebrow-mono mb-4">0{i + 1}</p>
        <p class="font-display tracking-[-0.025em] leading-none whitespace-nowrap" style="font-size: clamp(56px, 7.2vw, 110px);" data-count={n}>0</p>
        <p class="mt-6 text-[#1A1A2E]">{s.statsLabels[i]}</p>
        <p class="eyebrow-mono mt-2 text-[#8E8E9F]">{captions[i]}</p>
      </div>
    ))}
  </div>
</section>
```

(`data-count` is read by the existing `initCounters()` in `motion.ts` — no extra wiring needed.)

- [ ] **Step 8.2: Build**

Run: `cd skypulse && npm run build`
Expected: `[build] Complete!`.

- [ ] **Step 8.3: Commit**

```bash
git add skypulse/src/components/home/Counters.astro
git commit -m "Home port: add Counters section (148/37/12)"
```

---

## Task 9: Insights section (Work videos drag-scroll)

**Files:**
- Create: `skypulse/src/components/home/Insights.astro`

- [ ] **Step 9.1: Create the file**

Write `skypulse/src/components/home/Insights.astro` with:

```astro
---
import { pick, localeUrl, type Lang } from "../../i18n/strings";

interface Props { lang?: Lang; }
const { lang = "el" } = Astro.props;
const t = pick(lang);
const videos = t.work.videos; // 4 videos
const eyebrow = lang === "el" ? "VI · Επιλεγμένα έργα" : "VI · Selected work";
const headingPre = lang === "el" ? "Πρόσφατα" : "Recent";
const headingEm  = lang === "el" ? "σήματα." : "signals.";
const viewAll = lang === "el" ? "Δες όλα →" : "View all →";
---
<section data-section="insights" id="insights" class="relative z-10 min-h-[80vh] py-24 overflow-hidden" aria-label="Selected work">

  <header class="page-x mb-10 flex items-end justify-between">
    <div>
      <p class="eyebrow-mono mb-3">{eyebrow}</p>
      <h2 class="display-md">{headingPre} <span class="serif-italic">{headingEm}</span></h2>
    </div>
    <a href={localeUrl(lang, "/work")} class="eyebrow-mono text-[#8E8E9F] hover:text-[#8B6BAF] transition-colors">{viewAll}</a>
  </header>

  <div data-insights-track class="flex gap-8 overflow-x-auto scroll-smooth cursor-grab page-l" role="list" style="scrollbar-width: none;">
    {videos.map((v, i) => (
      <article role="listitem" class="flex-shrink-0 w-[min(520px,80vw)] group">
        <button type="button" class="video-tile relative block w-full aspect-[4/3] overflow-hidden bg-[#F3EEF8] halftone cursor-pointer" data-vimeo={v.id} aria-label={`Play: ${v.title}`}>
          <img src={v.thumb} alt={v.title} class="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]" loading={i < 2 ? "eager" : "lazy"} />
          <span class="absolute inset-0 grid place-items-center">
            <span class="inline-flex items-center justify-center w-16 h-16 rounded-full border border-white text-white">
              <svg width="18" height="18" viewBox="0 0 22 22"><path d="M6 3v16l14-8L6 3z" fill="currentColor"/></svg>
            </span>
          </span>
        </button>
        <div class="mt-4 flex items-center gap-3 eyebrow-mono">
          <span>{v.sport.split("·")[0].trim()}</span>
          <span class="h-px flex-1 bg-[#E0D8EC]"></span>
          <span>{v.duration} · {v.bpm} bpm</span>
        </div>
        <h3 class="mt-3 font-display text-2xl leading-tight">{v.title}</h3>
        <p class="mt-2 text-[#8E8E9F] body-serif max-w-md">{v.desc}</p>
      </article>
    ))}
    <div class="flex-shrink-0 page-w"></div>
  </div>

</section>

<style>
  [data-insights-track]::-webkit-scrollbar { display: none; }
</style>
```

- [ ] **Step 9.2: Build**

Run: `cd skypulse && npm run build`
Expected: `[build] Complete!`.

- [ ] **Step 9.3: Commit**

```bash
git add skypulse/src/components/home/Insights.astro
git commit -m "Home port: add drag-scrollable Insights track for Work videos"
```

---

## Task 10: ContactFooter section

**Files:**
- Create: `skypulse/src/components/home/ContactFooter.astro`

- [ ] **Step 10.1: Create the file**

Write `skypulse/src/components/home/ContactFooter.astro` with:

```astro
---
import { pick, localeUrl, type Lang } from "../../i18n/strings";

interface Props { lang?: Lang; }
const { lang = "el" } = Astro.props;
const t = pick(lang);
const cta = t.cta;
const c = t.common;
const f = t.footer;
const eyebrow = lang === "el" ? "VII · Πες ένα γεια" : "VII · Say hello";
// Split cta.title into two lines around its last word for the masked entrance.
const titleWords = cta.title.split(/\s+/);
const lastWord = titleWords.pop() ?? "";
const firstLine = titleWords.join(" ");
---
<section data-section="contact-footer" id="contact" class="relative z-10 min-h-[90vh] page-x pt-32 pb-12 overflow-hidden" aria-label="Contact">

  <p class="eyebrow-mono mb-6">{eyebrow}</p>

  <h2 class="font-display tracking-[-0.025em] leading-[1.0]" style="font-size: clamp(48px, 7.5vw, 112px);" data-contact-headline>
    <span class="inline-block">{firstLine}</span><br/>
    <span class="inline-block"><span class="serif-italic">{lastWord}</span></span>
  </h2>

  <p class="mt-8 max-w-[50ch] text-[#8E8E9F] body-serif">{cta.sub}</p>

  <div class="mt-24 grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl">
    <div>
      <p class="eyebrow-mono mb-3">{lang === "el" ? "Στούντιο" : "Studio"}</p>
      <p>{c.address}</p>
      <p class="text-[#8E8E9F]">{f.coords}</p>
    </div>
    <div>
      <p class="eyebrow-mono mb-3">{lang === "el" ? "Επικοινωνία" : "Talk to us"}</p>
      <p><a href={`mailto:${c.email}`} class="hover:text-[#8B6BAF] transition-colors">{c.email}</a></p>
      <p><a href={c.phoneHref} class="hover:text-[#8B6BAF] transition-colors">{c.phone}</a></p>
    </div>
    <div>
      <p class="eyebrow-mono mb-3">{lang === "el" ? "Ώρες" : "Hours"}</p>
      <p>{cta.hoursValue}</p>
      <p class="text-[#8E8E9F]">{cta.responseLabel}: {cta.responseValue}</p>
    </div>
  </div>

  <div class="mt-32 overflow-hidden" aria-hidden="true">
    <div data-footer-marquee class="whitespace-nowrap will-change-transform font-display tracking-[-0.03em] opacity-30" style="font-size: clamp(120px, 18vw, 260px); color: #8B6BAF;">
      <span class="inline-block pr-8">SKY PULSE</span><span class="inline-block pr-8">SKY PULSE</span><span class="inline-block pr-8">SKY PULSE</span><span class="inline-block pr-8">SKY PULSE</span>
    </div>
  </div>

  <div class="mt-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-8 border-t border-hairline eyebrow-mono">
    <p>{f.copy}</p>
    <p>{f.tag}</p>
    <nav aria-label="Legal" class="flex gap-6">
      <a href={f.privacyHref} class="hover:text-[#8B6BAF] transition-colors">{f.privacy}</a>
    </nav>
  </div>

</section>
```

- [ ] **Step 10.2: Build**

Run: `cd skypulse && npm run build`
Expected: `[build] Complete!`.

- [ ] **Step 10.3: Commit**

```bash
git add skypulse/src/components/home/ContactFooter.astro
git commit -m "Home port: add ContactFooter with split headline + brand marquee"
```

---

## Task 11: Wire the new sequence into both home pages

**Files:**
- Modify: `skypulse/src/pages/index.astro` (full rewrite)
- Modify: `skypulse/src/pages/en/index.astro` (full rewrite)

- [ ] **Step 11.1: Replace `skypulse/src/pages/index.astro`**

Overwrite the file with:

```astro
---
import Page from "../layouts/Page.astro";
import Hero           from "../components/home/Hero.astro";
import Manifesto      from "../components/home/Manifesto.astro";
import FourWorlds     from "../components/home/FourWorlds.astro";
import CameoFeature   from "../components/home/CameoFeature.astro";
import Counters       from "../components/home/Counters.astro";
import Insights       from "../components/home/Insights.astro";
import ContactFooter  from "../components/home/ContactFooter.astro";
import { pick } from "../i18n/strings";

const lang = "el";
const m = pick(lang).meta.home;
---

<Page lang={lang} path="/" title={m.title} description={m.description}>
  <Hero          lang={lang} />
  <Manifesto     lang={lang} />
  <FourWorlds    lang={lang} />
  <CameoFeature  lang={lang} />
  <Counters      lang={lang} />
  <Insights      lang={lang} />
  <ContactFooter lang={lang} />
</Page>
```

- [ ] **Step 11.2: Replace `skypulse/src/pages/en/index.astro`**

Overwrite the file with:

```astro
---
import Page from "../../layouts/Page.astro";
import Hero           from "../../components/home/Hero.astro";
import Manifesto      from "../../components/home/Manifesto.astro";
import FourWorlds     from "../../components/home/FourWorlds.astro";
import CameoFeature   from "../../components/home/CameoFeature.astro";
import Counters       from "../../components/home/Counters.astro";
import Insights       from "../../components/home/Insights.astro";
import ContactFooter  from "../../components/home/ContactFooter.astro";
import { pick } from "../../i18n/strings";

const lang = "en";
const m = pick(lang).meta.home;
---

<Page lang={lang} path="/" title={m.title} description={m.description}>
  <Hero          lang={lang} />
  <Manifesto     lang={lang} />
  <FourWorlds    lang={lang} />
  <CameoFeature  lang={lang} />
  <Counters      lang={lang} />
  <Insights      lang={lang} />
  <ContactFooter lang={lang} />
</Page>
```

- [ ] **Step 11.3: Build**

Run: `cd skypulse && npm run build`
Expected: `[build] Complete!`. If a section component is missing or has a TypeScript error, the build will list the file and line — fix and re-run.

- [ ] **Step 11.4: Commit**

```bash
git add skypulse/src/pages/index.astro skypulse/src/pages/en/index.astro
git commit -m "Home port: swap home pages to Elysse-style section sequence"
```

---

## Task 12: Visual verification + final commit

**Files:** none (verification only)

- [ ] **Step 12.1: Start the dev server**

Run: `cd skypulse && npm run dev`
Expected: server starts on `http://localhost:4321/` (or similar port).

- [ ] **Step 12.2: Walk the Greek home page**

Open `http://localhost:4321/` in a browser. Scroll top → bottom and verify:
1. **Hero:** mono eyebrow, headline reveals word-by-word, italic-purple "την κίνηση…" phrase visible, scroll hint line on the right.
2. **Manifesto:** as you scroll into it the page background turns ink (`#1A1A2E`), text inverts to white, words fade-up, SVG wave draws across.
3. **FourWorlds:** page pins, you scroll horizontally through 4 disciplines (Καλλιτεχνικό Πατινάζ → Ρυθμική → Ενόργανη → Show); ticker bottom updates active.
4. **CameoFeature:** Aurora Variations Vimeo poster on the left, "Composed for the ice." headline on the right, clicking the poster opens the existing Vimeo overlay.
5. **Counters:** 148 / 37 / 12 tween from 0 when entering viewport.
6. **Insights:** 4 video cards, draggable horizontally with mouse/trackpad; click opens Vimeo overlay.
7. **ContactFooter:** "Ξεκίνα τη δική σου σύνθεση." headline, three meta columns, infinite "SKY PULSE" marquee at the bottom.
8. **DevTools console:** zero errors. (Vimeo player may log harmless analytics info; that's fine.)

- [ ] **Step 12.3: Walk the English home page**

Open `http://localhost:4321/en/` and repeat all checks. Confirm copy is English ("Sound that defines your presence.", "Begin your composition.", etc).

- [ ] **Step 12.4: Toggle reduced motion**

In macOS System Settings → Accessibility → Display, enable "Reduce motion." Reload the page. Verify:
- No pinned scrolling.
- Words appear immediately (no translateY).
- Counters show final values immediately.
- No console errors about ScrollTrigger.

Disable Reduce motion when done.

- [ ] **Step 12.5: Mobile check**

Open DevTools → device emulation → iPhone 14 Pro (390 × 844). Verify:
- FourWorlds stacks vertically (no horizontal pin on small screens).
- Insights track scrolls with finger drag.
- All sections are legible without horizontal scrollbars.

- [ ] **Step 12.6: Stop the server, commit any final tweaks**

If steps 12.2–12.5 surfaced fixes (typos, broken images, layout bugs), make the smallest possible patch commits — one commit per fix, descriptive messages — and re-verify. If everything passed, no extra commit is needed; the previous task already commits the page swap.

- [ ] **Step 12.7: Final summary commit (optional)**

If desired, make an empty annotation commit:
```bash
git commit --allow-empty -m "Home port: verified GR + EN, reduced-motion + mobile parity"
```

---

## Out-of-scope notes (intentionally excluded)

- **OGL particle-flow background.** Elysse runs a fragment-shader gradient behind every section. SkyPulse already has `#hero-wave` (canvas) and `#pulse-grid` for hero atmosphere; replacing those with an OGL shader would be its own initiative.
- **GlobalMap section.** SkyPulse is Athens-only; a "carried worldwide" map adds noise.
- **Removing the existing `sections/*.astro` components.** They're still imported by `process.astro`, `studio.astro`, `work.astro`, and the `_elysse-ref/` is read-only. Cleanup of unused legacy components is a follow-up.
- **Font replacement.** Elysse uses Fraunces; SkyPulse uses Newsreader. Both are variable serifs with optical-size + italic axes; swapping fonts is an aesthetic decision the user declined.
- **Brand-purple retint of Elysse's WebGL gradient.** Not relevant here — the WebGL background isn't being ported.

---

## Self-review

**Spec coverage:** Hero ← `overture` (T4), Manifesto ← `manifesto` (T5), FourWorlds ← first 4 of `disciplines.cards` (T6), CameoFeature ← `work.videos[0]` (T7), Counters ← `studio.stats` (T8), Insights ← `work.videos` (T9), ContactFooter ← `cta` + `footer` (T10), GlobalMap skipped (noted out-of-scope), bilingual via `lang` prop everywhere (T4–T10), brand purple preserved (T1 tokens), Vimeo overlay reuse via `.video-tile` + `data-vimeo` (T7, T9). ✅

**Type consistency:** All section components take `Props { lang?: Lang }` and import `pick` from `../../i18n/strings` consistently. The featured Vimeo uses `t.work.videos[0]` and the Insights track uses `t.work.videos` — same array, no name drift. `data-count` matches the existing `initCounters()` selector (line 365 of `motion.ts`); `data-vimeo` matches `initVideoTiles()` (line 331). ✅

**No placeholders:** Every step has a concrete file path, full astro/ts code body, exact `npm run build` invocation, and a single-line commit message. ✅

---

## Execution Handoff

Plan complete and saved to `/Users/marios/Desktop/Cursor/markidis/PLAN.md`. Two execution options:

1. **Subagent-Driven (recommended)** — fresh subagent per task, two-stage review between tasks, fast iteration.
2. **Inline Execution** — execute tasks in this session with checkpoints for review.

Which approach?
