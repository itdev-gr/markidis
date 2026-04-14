# Sky Pulse — Rebuild

Award-tier rebuild of [sky-pulse.gr](https://www.sky-pulse.gr/) — bespoke music composition for elite athletes (figure skating, rhythmic & artistic gymnastics, performance sports).

## Stack
- **Astro 4** (islands)
- **Tailwind CSS v4**
- **GSAP 3** + ScrollTrigger + Flip
- **Lenis** smooth scroll
- **Vimeo Player SDK**

## Aesthetic
Concert-program × cinema title card × night observatory. Warm coffee-noir canvas (`#1D1A14`), cream type (`#F4ECD8`), amber accent (`#E8A33D`). Fraunces display, Instrument Serif italic, Manrope body, JetBrains Mono for data.

## Run
```bash
cd skypulse
npm install
npm run dev        # http://localhost:4321
npm run build
npm run preview
```

## Structure
```
skypulse/
├── public/media/          # logo, 4 video thumbs, contact image (from sky-pulse.gr)
├── src/
│   ├── components/        # Header, Footer
│   ├── layouts/Base.astro
│   ├── pages/index.astro  # 9-movement home
│   ├── scripts/motion.ts  # GSAP choreography
│   └── styles/global.css  # design tokens
SKYPULSE_MASTER_PLAN.md    # full strategy doc
```

## Home page movements
1. **Overture** — audio-reactive waveform hero
2. **Manifesto** — bilingual GR/EN editorial quote
3. **Selected Work** — pinned horizontal scroll, 4 Vimeo routines
4. **Disciplines** — FS · RG · AG · SC · PS grid + marquee
5. **Process** — 5-step editorial stepper
6. **Studio** — stats counter + gear list
7. **Words** — coach/athlete testimonials
8. **Encore** — booking form
9. **Footer** — wordmark, legal, coords
