import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import Lenis from "lenis";
import VimeoPlayer from "@vimeo/player";

gsap.registerPlugin(ScrollTrigger, Flip);

const reduceMotion =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ============================================================
   LENIS SMOOTH SCROLL
   ============================================================ */
function initLenis() {
  if (reduceMotion) return;
  const lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });
  function raf(time: number) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.lagSmoothing(0);
}

/* ============================================================
   CUSTOM CURSOR
   ============================================================ */
function initCursor() {
  if (window.matchMedia("(hover: none)").matches) return;

  const dot = document.createElement("div");
  dot.className = "sp-cursor-dot";
  const ring = document.createElement("div");
  ring.className = "sp-cursor-ring";
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  const xTo = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3.out" });
  const yTo = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3.out" });
  const xDot = gsap.quickTo(dot, "x", { duration: 0.1, ease: "power3.out" });
  const yDot = gsap.quickTo(dot, "y", { duration: 0.1, ease: "power3.out" });

  window.addEventListener("mousemove", (e) => {
    xTo(e.clientX);
    yTo(e.clientY);
    xDot(e.clientX);
    yDot(e.clientY);
  });

  const hoverables = document.querySelectorAll(
    'a, button, [data-hover], [role="button"], .sp-btn, .sp-link, .video-tile'
  );
  hoverables.forEach((el) => {
    el.addEventListener("mouseenter", () => ring.setAttribute("data-hover", "true"));
    el.addEventListener("mouseleave", () => ring.setAttribute("data-hover", "false"));
  });
}

/* ============================================================
   MAGNETIC BUTTONS
   ============================================================ */
function initMagnetic() {
  if (reduceMotion) return;
  document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((el) => {
    const strength = parseFloat(el.dataset.magnetic || "0.35");
    const xTo = gsap.quickTo(el, "x", { duration: 0.55, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.55, ease: "power3.out" });

    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * strength);
      yTo((e.clientY - (r.top + r.height / 2)) * strength);
    });
    el.addEventListener("mouseleave", () => {
      xTo(0); yTo(0);
    });
  });
}

/* ============================================================
   SPLIT + REVEAL (no SplitText plugin dependency)
   ============================================================ */
function splitChars(el: HTMLElement) {
  const text = el.textContent || "";
  el.setAttribute("aria-label", text);
  el.textContent = "";
  const words = text.split(/(\s+)/);
  words.forEach((word) => {
    if (/^\s+$/.test(word)) {
      el.appendChild(document.createTextNode(word));
      return;
    }
    const wrap = document.createElement("span");
    wrap.className = "reveal-clip";
    wrap.setAttribute("aria-hidden", "true");
    [...word].forEach((ch) => {
      const s = document.createElement("span");
      s.className = "reveal-char";
      s.textContent = ch;
      wrap.appendChild(s);
    });
    el.appendChild(wrap);
  });
}

function initReveals() {
  document.querySelectorAll<HTMLElement>("[data-split]").forEach((el) => splitChars(el));

  document.querySelectorAll<HTMLElement>("[data-split]").forEach((el) => {
    gsap.to(el.querySelectorAll(".reveal-char"), {
      y: 0,
      rotate: 0,
      opacity: 1,
      ease: "power4.out",
      duration: 1.1,
      stagger: 0.018,
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
      },
    });
  });

  /* Simple fade-up on data-reveal */
  document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
    gsap.from(el, {
      y: 40,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 88%",
      },
    });
  });
}

/* ============================================================
   HERO AUDIO-REACTIVE WAVEFORM (scroll-driven, no audio required)
   ============================================================ */
function initWaveform() {
  const canvas = document.getElementById("hero-wave") as HTMLCanvasElement | null;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
  function resize() {
    const r = canvas!.getBoundingClientRect();
    w = r.width; h = r.height;
    canvas!.width = w * dpr; canvas!.height = h * dpr;
    ctx!.scale(dpr, dpr);
  }
  resize();
  window.addEventListener("resize", resize);

  let t = 0;
  let velocity = 0;
  let lastY = window.scrollY;
  window.addEventListener("scroll", () => {
    velocity = Math.min(60, Math.abs(window.scrollY - lastY));
    lastY = window.scrollY;
  });

  function draw() {
    ctx!.clearRect(0, 0, w, h);
    const bands = 3;
    for (let b = 0; b < bands; b++) {
      ctx!.beginPath();
      const alpha = 0.55 - b * 0.18;
      const grad = ctx!.createLinearGradient(0, 0, w, 0);
      grad.addColorStop(0, `rgba(139,107,175,${alpha})`);
      grad.addColorStop(0.5, `rgba(232,163,61,${alpha})`);
      grad.addColorStop(1, `rgba(109,207,246,${alpha})`);
      ctx!.strokeStyle = grad;
      ctx!.lineWidth = 1.25 - b * 0.25;
      const amp = 22 + velocity * 0.8 + b * 8;
      const freq = 0.012 + b * 0.004;
      const phase = t * (0.6 + b * 0.25);
      for (let x = 0; x <= w; x += 2) {
        const y =
          h / 2 +
          Math.sin(x * freq + phase) * amp *
            Math.sin(x * 0.003 + phase * 0.4);
        if (x === 0) ctx!.moveTo(x, y);
        else ctx!.lineTo(x, y);
      }
      ctx!.stroke();
    }
    t += 0.02;
    velocity *= 0.94;
    requestAnimationFrame(draw);
  }
  draw();
}

/* ============================================================
   PULSE GRID (dots that ripple from cursor)
   ============================================================ */
function initPulseGrid() {
  const canvas = document.getElementById("pulse-grid") as HTMLCanvasElement | null;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
  let mx = -9999, my = -9999;

  function resize() {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas!.style.width = w + "px";
    canvas!.style.height = h + "px";
    canvas!.width = w * dpr; canvas!.height = h * dpr;
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener("resize", resize);
  window.addEventListener("mousemove", (e) => { mx = e.clientX; my = e.clientY; });

  const gap = 42;
  function draw() {
    ctx!.clearRect(0, 0, w, h);
    for (let x = gap / 2; x < w; x += gap) {
      for (let y = gap / 2; y < h; y += gap) {
        const dx = x - mx, dy = y - my;
        const d = Math.sqrt(dx * dx + dy * dy);
        const influence = Math.max(0, 1 - d / 220);
        const r = 0.6 + influence * 2.8;
        ctx!.fillStyle = `rgba(232,163,61,${0.08 + influence * 0.55})`;
        ctx!.beginPath();
        ctx!.arc(x, y, r, 0, Math.PI * 2);
        ctx!.fill();
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
}

/* ============================================================
   PORTFOLIO HORIZONTAL SCROLL (pinned scrub)
   ============================================================ */
function initPortfolioTrack() {
  const track = document.querySelector<HTMLElement>("[data-track]");
  const inner = document.querySelector<HTMLElement>("[data-track-inner]");
  if (!track || !inner) return;
  if (window.innerWidth < 900) return; // mobile: vertical stack

  const getX = () => -(inner.scrollWidth - window.innerWidth);

  const trackTween = gsap.to(inner, {
    x: getX,
    ease: "none",
    scrollTrigger: {
      trigger: track,
      pin: true,
      scrub: 1,
      start: "top top",
      end: () => `+=${inner.scrollWidth - window.innerWidth}`,
      invalidateOnRefresh: true,
    },
  });

  // parallax images, driven by the track scroll
  gsap.utils.toArray<HTMLElement>(".video-tile img").forEach((img) => {
    gsap.fromTo(
      img,
      { scale: 1.1, yPercent: -3 },
      {
        scale: 1,
        yPercent: 3,
        ease: "none",
        scrollTrigger: {
          trigger: img.closest(".video-tile"),
          containerAnimation: trackTween,
          start: "left right",
          end: "right left",
          scrub: true,
        },
      }
    );
  });
}

/* ============================================================
   VIDEO TILE OPEN (Flip)
   ============================================================ */
function initVideoTiles() {
  const overlay = document.getElementById("video-overlay") as HTMLElement | null;
  const overlayInner = document.getElementById("video-overlay-inner") as HTMLElement | null;
  const overlayClose = document.getElementById("video-overlay-close");
  if (!overlay || !overlayInner) return;

  let currentPlayer: VimeoPlayer | null = null;

  function close() {
    if (currentPlayer) {
      currentPlayer.destroy().catch(() => {});
      currentPlayer = null;
    }
    overlayInner!.innerHTML = "";
    gsap.to(overlay!, {
      opacity: 0,
      duration: 0.4,
      ease: "power3.out",
      onComplete: () => {
        overlay!.style.pointerEvents = "none";
        overlay!.style.display = "none";
        document.body.classList.remove("no-scroll");
      },
    });
  }

  overlayClose?.addEventListener("click", close);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });
  window.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });

  document.querySelectorAll<HTMLElement>(".video-tile").forEach((tile) => {
    tile.addEventListener("click", () => {
      const id = tile.dataset.vimeo;
      if (!id) return;
      overlay.style.display = "flex";
      overlay.style.pointerEvents = "auto";
      document.body.classList.add("no-scroll");

      const iframe = document.createElement("iframe");
      iframe.src = `https://player.vimeo.com/video/${id}?autoplay=1&title=0&byline=0&portrait=0&dnt=1`;
      iframe.allow = "autoplay; fullscreen; picture-in-picture";
      iframe.setAttribute("allowfullscreen", "");
      iframe.style.width = "100%";
      iframe.style.height = "100%";
      iframe.style.border = "0";
      overlayInner.appendChild(iframe);
      currentPlayer = new VimeoPlayer(iframe);

      gsap.fromTo(
        overlay,
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: "power3.out" }
      );
      gsap.fromTo(
        overlayInner,
        { scale: 0.94, y: 30 },
        { scale: 1, y: 0, duration: 0.8, ease: "expo.out" }
      );
    });
  });
}

/* ============================================================
   NUMBER COUNTERS
   ============================================================ */
function initCounters() {
  document.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
    const target = parseInt(el.dataset.count || "0", 10);
    const obj = { v: 0 };
    gsap.to(obj, {
      v: target,
      duration: 2.2,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 85%" },
      onUpdate: () => { el.textContent = Math.round(obj.v).toString(); },
    });
  });
}

/* ============================================================
   HERO INTRO TIMELINE
   ============================================================ */
function initHeroTimeline() {
  const hero = document.querySelector(".hero");
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
  const safe = (sel: string, vars: gsap.TweenVars, at?: number) => {
    if (document.querySelector(sel)) tl.from(sel, vars, at);
  };
  safe(".hero-opus", { opacity: 0, y: 20, duration: 1 }, 0.1);
  safe(".hero-staff", { opacity: 0, y: 10, duration: 1.2 }, 0.4);
  safe(".hero-meta", { opacity: 0, y: 20, duration: 1 }, 0.6);
  safe(".hero-cta", { opacity: 0, y: 20, duration: 1 }, 0.9);
}

/* ============================================================
   DISCIPLINES RING (infinite marquee rotate)
   ============================================================ */
function initMarquee() {
  document.querySelectorAll<HTMLElement>("[data-marquee]").forEach((el) => {
    const inner = el.querySelector<HTMLElement>("[data-marquee-inner]");
    if (!inner) return;
    inner.innerHTML = inner.innerHTML + inner.innerHTML;
    const dist = inner.scrollWidth / 2;
    gsap.to(inner, {
      x: -dist,
      ease: "none",
      duration: 40,
      repeat: -1,
    });
  });
}

/* ============================================================
   BOOT
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  initLenis();
  // initCursor(); // disabled — use native cursor
  initMagnetic();
  initReveals();
  initWaveform();
  initPulseGrid();
  initHeroTimeline();
  initPortfolioTrack();
  initVideoTiles();
  initCounters();
  initMarquee();
});
