# SKY PULSE — Master Rebuild Plan (Astro + GSAP)

> A cinematic, award-tier redesign of **sky-pulse.gr** — bespoke music production for elite athletes (figure skating, rhythmic/artistic gymnastics, show choreography).
> Target quality: Awwwards / FWA / CSSDA "Site of the Day." Budget-equivalent: **€10,000+**.

---

## 1. AUDIT OF THE EXISTING SITE

### 1.1 Business Identity (crawled)
- **Name:** Sky Pulse (styled `sky**pulse**`)
- **Proposition:** "Specialized Music Productions for Athletes"
- **Tagline GR:** *"ο ήχος της κίνησής σου"* (the sound of your movement)
- **Tagline EN:** *Precision. Performance. Emotion.*
- **Niches:** Figure skating · Rhythmic gymnastics · Artistic gymnastics · Show choreography · Performance sports
- **Services:** Composition & Orchestration · High-Quality Production & Recording · Mixing & Mastering for competition · Duration/movement-tailored edits
- **Contact:** info@sky-pulse.gr · +30 6932 669999
- **Languages:** Greek (primary) + English
- **Copyright:** © 2026 skypulse

### 1.2 Verbatim Copy to Reuse
- **Hero (GR):** "Εξειδικευμένες Μουσικές Παραγωγές για Αθλητές"
- **Hero (EN):** "Specialized Music Productions for Athletes"
- **Pull-quote (GR):** "Η μουσική μας δεν είναι απλώς συνοδεία — είναι στρατηγικό εργαλείο απόδοσης, σχεδιασμένο να ενισχύει την παρουσία, να προκαλεί συναίσθημα και να μετατρέπει κάθε εμφάνιση σε εμπειρία."
- **Pull-quote (EN):** "Our music is more than accompaniment — it's a strategic element of performance, designed to enhance presence, evoke emotion, and transform every routine into an experience."
- **Sub-copy:** "Each composition is individually crafted — from orchestration and production to mixing and final mastering — designed to fully meet competition requirements and highlight the athlete's dynamics and character."

### 1.3 Extracted Assets (download & re-host)
| Asset | URL |
|-------|-----|
| Logo (SVG) | `https://www.sky-pulse.gr/wp-content/uploads/2026/03/skypulse-logo.svg` |
| Thumb 1 | `…/2026/03/1.skypulse-music-by-HC-mock-video.jpg` |
| Thumb 2 | `…/2026/03/2.skypulse-music-by-HC-mock-video.jpg` |
| Thumb 3 | `…/2026/03/3.skypulse-music-by-HC-mock-video.jpg` |
| Thumb 4 | `…/2026/03/4.skypulse-music-music-by-HC-4.jpg` |
| Contact image | `…/2026/03/skypulse-contact.jpg` |
| PNC icon | `…/2026/03/sky-pulse-pnc-icon.png` |

**Vimeo video IDs** (embed via `https://player.vimeo.com/video/{id}`):
`1176307949` · `1176307154` · `1176309212` · `1176465736`

### 1.4 Existing Brand Palette (from `main.css`)
| Token | Hex | Role |
|-------|-----|------|
| `--bg` | `#0A0A0F` (new, darker) | Canvas |
| `--ink` | `#F5F5F7` (new) | Primary text |
| `--accent-violet` | `#8B6BAF` | Primary brand |
| `--accent-indigo` | `#2A3890` | Depth |
| `--accent-sky` | `#6DCFF6` | Highlight / pulse |
| `--accent-amber` | `#F7931D` | Warm accent (sparingly) |
| `--muted` | `#6C6E70` | Secondary text |

**Typography kept & extended:** Manrope (200–800) + **Fraunces** (serif display, variable, for editorial hero) + **JetBrains Mono** (timecodes, data labels).

### 1.5 What's Weak Today (why a rebuild is justified)
- Static WordPress with thumbnail grid; no motion, no narrative.
- No audio presence on a *music* brand — inexcusable.
- No athlete case studies, no process story, no booking flow.
- Zero typography hierarchy; generic Manrope body on off-white.
- Mobile is functional but flat; no haptic/scroll delight.
- Contact is an anchor, not a conversion surface.

---

## 2. CREATIVE DIRECTION — "The Sound of Motion"

### 2.1 Concept
A brand is a *score*. The site is its **performance**. Every section is a movement in a four-part suite — **Overture → Performance → Craft → Encore** — choreographed to the viewer's scroll. Audio waveforms are the through-line: they shape the hero, write the headings, reveal the videos, and sign off the footer.

### 2.2 Mood
**Dolby Atmos × Ballet × Editorial Magazine.** Rich matte-black canvas, deep violet-to-sky gradients that breathe like a subwoofer, hairline serifs for emotion, mono for data. Think: Apple Music Classical × Linear × Stripe Sessions × a figure-skating spotlight.

### 2.3 Signature Motifs
1. **Living waveform** — a WebGL/canvas audio-reactive line that reacts to an ambient master-track playing at low volume; users opt-in via a floating "Play the Room" button. When muted, it follows scroll velocity.
2. **Kinetic type** — headings split into glyphs (SplitText) and animated with stagger + blur-in + slight 3D tilt on cursor proximity.
3. **Scroll-scrubbed film strip** — the four Vimeo thumbnails become a horizontal track scrubbed by scroll, each tile parallaxes, and on click morphs (FLIP) into a full-bleed player with a crossfade.
4. **Pulse grid** — a subtle dot grid behind sections that ripples outward from the cursor (GSAP `to` on distance field).
5. **Magnetic cursor & buttons** — custom cursor with inertia; CTAs gravitate toward it within radius.

---

## 3. INFORMATION ARCHITECTURE

```
/                           (GR, default)
/en                         (EN)
/work                       Portfolio index (4 videos + future)
/work/[slug]                Per-routine case study (sport, athlete, duration, BPM curve, mixing notes)
/process                    From brief to master — 5-step stepper
/about                      Composer bio, studio, gear, credits
/contact                    Booking form + direct lines
/privacy                    Legacy compliance page
```

Nav: `Work · Process · About · Contact · EN/GR`. Sticky micro-player shows currently-playing master.

---

## 4. PAGE-BY-PAGE BLUEPRINT

### 4.1 Home — the Suite
1. **Overture (Hero)** — Fullscreen matte black. Fraunces mega-type "Precision. Performance. Emotion." reveals glyph-by-glyph over a live audio-reactive waveform (Canvas/WebGL). Sub-headline in Manrope. Ambient-play toggle. Scroll cue is a vertical BPM bar pulsing to 72 BPM (resting heart rate).
2. **Manifesto** — the pull-quote as editorial drop-cap, pinned with ScrollTrigger as translated Greek fades to English (bilingual transition).
3. **The Portfolio Track** — horizontal scroll-scrubbed strip of the **four Vimeo videos**. Each tile has: title, sport tag, duration, BPM target. Click → FLIP morph to immersive player with side panel of production notes. *This is the hero of the crawled asset set.*
4. **Disciplines** — a 3D rotating ring (CSS 3D + GSAP) listing Figure Skating · Rhythmic Gymnastics · Artistic Gymnastics · Show Choreography · Performance Sports. Each card flips to reveal a tailored compositional constraint (ISU rules, FIG timing, etc.).
5. **Process (teaser)** — 5 numbered steps scroll-stitched on a single timeline: *Brief → Sketch → Record → Mix → Master*. Audio snippet plays per step.
6. **Studio & Craft** — split-screen: left is a still from the studio (reuse `skypulse-contact.jpg` cropped/graded); right is a list of tools (DAWs, plugins, mastering chain). Numbers count up (tracks mixed, athletes served, years).
7. **Testimonial carousel** — placeholder for 3 coach/athlete quotes, with headshot ring and a waveform that animates as the quote "speaks."
8. **Booking CTA** — giant Fraunces "Score your next routine." Magnetic button → /contact.
9. **Footer** — sign-off "sky**pulse**" where the final **e** is a looping waveform; legal, socials, language toggle.

### 4.2 Work / Case Study
- Hero: full-bleed Vimeo video, muted autoplay, unmute pill.
- Sticky left rail: Athlete · Sport · Event · Program length · Target BPM · Year.
- Long-form: *Brief → Musical concept → Reference tracks → Final master.* Inline waveform player (WaveSurfer.js) with chapter markers tied to choreography beats.
- Related routines grid at bottom.

### 4.3 Process
Horizontal stepper pinned with GSAP ScrollTrigger. Each of the 5 steps is a "movement" with its own color accent and micro-copy, driven by a master timeline.

### 4.4 Contact
Two-column: left, a booking form (sport, program length, deadline, reference, contact); right, a live "availability" module (fake-real calendar), plus phone + email with click-to-copy confirmation animation.

---

## 5. TECH STACK

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | **Astro 4.x** (islands architecture) | Static-first, blazing TTFB, zero JS by default, perfect for a marketing site with isolated interactive islands. |
| Styling | **Tailwind CSS 3** + CSS variables for brand tokens | Fast, design-system-ready. |
| Animation | **GSAP 3** + ScrollTrigger + SplitText + Flip + Observer + CustomEase | Industry standard for cinematic scroll choreography. |
| 3D / FX | **OGL** or **three.js** (only if needed) for waveform | Lightweight. Fallback: pure Canvas 2D. |
| Audio | **Howler.js** + **WaveSurfer.js** | Cross-browser audio + waveform rendering. |
| Video | **Vimeo Player SDK** | Already hosts the four videos — reuse IDs. |
| Forms | **Astro Actions** → Resend or Formspree | Simple booking email. |
| i18n | **astro-i18n** or built-in `astro:i18n` | GR (default) + EN. |
| Content | **Astro Content Collections** (MDX) for /work entries | Git-based CMS, no DB. |
| Images | `astro:assets` (AVIF/WebP, responsive) | Auto-optimized. |
| Analytics | **Plausible** (privacy-first) | GDPR-clean for Greek audience. |
| Hosting | **Vercel** or **Netlify** | Edge + preview deploys. |
| Perf budget | LCP < 1.8s, CLS < 0.05, INP < 150ms, JS < 120KB initial | Awwwards-tier. |

---

## 6. GSAP ANIMATION CHOREOGRAPHY (the "score")

### 6.1 Global primitives
- **Lenis** smooth scroll (ScrollTrigger-synced).
- **Custom cursor**: 12px dot + 36px ring, GSAP `quickTo` for 60fps inertia.
- **SplitText** on every `h1/h2`, words + chars, reveal on `ScrollTrigger.enter`.

### 6.2 Hero timeline
```
tl
 .from('.hero-bg', { scale:1.15, duration:2, ease:'expo.out' })
 .from('.hero-char', { yPercent:110, rotate:6, stagger:0.02, ease:'power4.out' }, '-=1.4')
 .from('.hero-sub',  { opacity:0, y:24, duration:0.8 }, '-=0.6')
 .from('.bpm-bar',   { scaleY:0, transformOrigin:'bottom', duration:1 }, '-=0.4');
```
Plus an `Observer` that tilts `.hero-type` toward the cursor (±4deg, ±8px).

### 6.3 Portfolio track
Pinned horizontal scroll:
```
ScrollTrigger.create({
  trigger:'.track', pin:true, scrub:1,
  end:()=> '+=' + document.querySelector('.track-inner').offsetWidth
})
```
Each `.tile` parallaxes its `img` with `yPercent: -20 → 20` on scrub; on click: **Flip.from(state, { duration:0.8, ease:'expo.inOut' })** morphs the tile to a full-bleed video frame; Vimeo player loads on transition end.

### 6.4 Waveform (ambient, opt-in)
Web Audio API `AnalyserNode` → requestAnimationFrame → draw on `<canvas>` with a GSAP-eased smoothing buffer so the line feels musical, not jittery. When paused, the line follows scroll velocity instead.

### 6.5 Pulse grid
A single canvas, 60 × 30 dot field. Each dot's radius = `base + sin(distanceToCursor) * amp`, animated via `gsap.ticker`. ~0.3ms per frame.

### 6.6 Page transitions
Astro **View Transitions API** + GSAP outro/intro (cover slide in brand violet, logo pulse, cover slide out). Back/forward preserves scroll.

---

## 7. ACCESSIBILITY & PERFORMANCE NON-NEGOTIABLES

- `prefers-reduced-motion` disables all non-essential motion; waveform becomes a static SVG.
- Full keyboard tab order; focus rings in `--accent-sky`.
- AA contrast on the dark canvas (text at ≥ `#C8CAD0`).
- Captions on all Vimeo embeds (request from client).
- Lighthouse ≥ 95 / 100 / 100 / 100. Images AVIF with WebP fallback, `loading="lazy"`, `fetchpriority="high"` only on LCP.
- Critical CSS inlined; GSAP imported per-page only.

---

## 8. DELIVERY PLAN (5 sprints, 6–7 weeks)

| # | Sprint | Deliverables |
|---|--------|-------------|
| 1 | Discovery + design system | Brand tokens, type scale, Figma of Home + 1 case study, motion spec video |
| 2 | Astro scaffold + content | Repo, CI, content collections, GR/EN routing, all copy migrated, assets re-hosted |
| 3 | Home build | Hero, manifesto, portfolio track, disciplines, process teaser, footer — GSAP timelines wired |
| 4 | Work/Process/About/Contact | Case-study template, booking form + email, process stepper |
| 5 | Polish + QA + launch | Perf pass, a11y audit, cross-browser, analytics, SEO (Schema.org `MusicGroup` + `Service`), domain switchover |

---

## 9. THE MASTER PROMPT (paste this to your builder)

> Copy the block below into Claude Code / Cursor / your AI IDE as the project-starter prompt.

```prompt
ROLE
You are a senior creative developer (ex-Active Theory / Resn caliber) building an
Awwwards-tier rebuild of sky-pulse.gr — a Greek studio that composes bespoke
music for elite athletes (figure skating, rhythmic & artistic gymnastics, show
choreography). Target a site that would reasonably bill at €10,000+.

STACK (non-negotiable)
- Astro 4 (islands), TypeScript strict
- Tailwind CSS with CSS variables for brand tokens
- GSAP 3 + ScrollTrigger, SplitText, Flip, Observer, CustomEase
- Lenis smooth scroll (ScrollTrigger-synced)
- Vimeo Player SDK for four existing videos (IDs: 1176307949, 1176307154,
  1176309212, 1176465736)
- WaveSurfer.js for waveforms, Howler.js for ambient audio
- astro:assets for AVIF/WebP; Plausible analytics; i18n GR (default) + EN
- Deploy on Vercel

BRAND
- Name: Sky Pulse (styled sky**pulse**)
- Tagline GR: "ο ήχος της κίνησής σου"
- Tagline EN: "Precision. Performance. Emotion."
- Palette:
    --bg #0A0A0F  --ink #F5F5F7
    --violet #8B6BAF  --indigo #2A3890  --sky #6DCFF6  --amber #F7931D
    --muted #6C6E70
- Type: Fraunces (variable serif, display), Manrope (200–800, body),
  JetBrains Mono (data labels).
- Tone: cinematic, editorial, confident, musical. Never generic SaaS.

CONTENT (use verbatim, bilingual)
- Hero EN: "Specialized Music Productions for Athletes" / GR: "Εξειδικευμένες
  Μουσικές Παραγωγές για Αθλητές"
- Manifesto EN: "Our music is more than accompaniment — it's a strategic element
  of performance, designed to enhance presence, evoke emotion, and transform
  every routine into an experience."
- Services: Composition & Orchestration · Production & Recording · Mixing &
  Mastering for competition · Duration/movement-tailored edits
- Contact: info@sky-pulse.gr · +30 6932 669999
- Re-host these from the current site and optimize:
  logo: /wp-content/uploads/2026/03/skypulse-logo.svg
  thumbs 1-4: /wp-content/uploads/2026/03/{1,2,3,4}.skypulse-music-by-HC*.jpg
  contact: /wp-content/uploads/2026/03/skypulse-contact.jpg

SITE MAP
/ (home)  /work  /work/[slug]  /process  /about  /contact  /privacy
with /en mirrors.

HOME SECTIONS (in order)
1. OVERTURE: matte-black hero, Fraunces mega-type revealed glyph-by-glyph via
   SplitText; live audio-reactive waveform canvas behind; ambient-play toggle;
   72bpm vertical pulse scroll cue.
2. MANIFESTO: editorial drop-cap quote, bilingual crossfade on scroll.
3. PORTFOLIO TRACK: horizontal pinned scroll (ScrollTrigger scrub) of the four
   Vimeo thumbnails. Parallax images. Click → GSAP Flip morph into full-bleed
   Vimeo player with side panel of production notes.
4. DISCIPLINES: 3D rotating ring with sport cards that flip to reveal timing/
   rule constraints.
5. PROCESS TEASER: five steps on one scroll-stitched timeline, audio snippet
   per step (Brief → Sketch → Record → Mix → Master).
6. STUDIO & CRAFT: split layout, counter-up stats, gear list in JetBrains Mono.
7. TESTIMONIALS: carousel with waveform that "speaks" the quote.
8. BOOKING CTA: giant Fraunces line + magnetic button → /contact.
9. FOOTER: looping-waveform wordmark, socials, legal, GR/EN toggle.

MOTION SYSTEM
- Custom cursor (dot + ring) with gsap.quickTo inertia.
- Magnetic buttons within 120px radius.
- Pulse-grid canvas behind sections, ripples from cursor.
- Page transitions via Astro View Transitions + GSAP cover slide.
- Respect prefers-reduced-motion: replace all motion with opacity fades;
  waveform becomes a static SVG.

QUALITY BAR
- Lighthouse ≥ 95/100/100/100.
- LCP < 1.8s, CLS < 0.05, INP < 150ms, JS < 120KB initial.
- WCAG AA contrast, full keyboard nav, captions on all videos.
- SEO: schema.org MusicGroup + Service, OG images per route, sitemap,
  hreflang GR/EN.

DELIVERABLES
1. Pnpm monorepo, Astro app, Tailwind config with brand tokens, motion
   primitives folder (cursor, magnetic, splitReveal, waveform, pulseGrid).
2. All nine home sections implemented with real copy & the four Vimeo videos.
3. /work/[slug] template with MDX content collection and WaveSurfer player.
4. Booking form wired to Resend (env-gated).
5. README with perf + a11y checklist, Lighthouse screenshots, motion demo gif.

PROCESS
- Scaffold the project.
- Build the design system (tokens, type, buttons, section shells).
- Build motion primitives in isolation (Storybook or /playground route).
- Compose the home page section-by-section, verifying scroll choreography
  in the browser at each step.
- Ship /work, /process, /contact.
- Perf + a11y + SEO pass.
- Deploy preview on Vercel.

Begin by proposing the repo structure and the design tokens, then wait for my
approval before scaffolding.
```

---

## 10. NOTES FOR YOU (the human)

- **Ask the client for:** (a) consent to reuse the four Vimeo videos and their thumbnails, (b) a 30–60s ambient master to drive the hero waveform, (c) 3 athlete/coach testimonials + headshots, (d) studio photos at 3000px, (e) a short bio, (f) a Vimeo Pro token if you want to hide player chrome.
- **Cheap wins if budget slips:** keep Vimeo default player skinning, drop the 3D ring for a 2D flip grid, replace WebGL waveform with a Canvas 2D version.
- **Premium adds:** a routine-builder widget (input sport + duration → preview a stitched demo), a Spotify-style "Now playing" mini-bar that persists across routes.

**Files produced by this plan:** `/SKYPULSE_MASTER_PLAN.md` (this doc).
Next step: approve, then scaffold `apps/skypulse` with Astro.
