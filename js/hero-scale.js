/* hero-scale.js — email scales up as the user scrolls toward it.
 * Scroll-linked, eased, synced to the shared smooth ticker.
 * Reduced motion -> static large size (handled by CSS fallback).
 */
(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const el = document.querySelector("[data-hero-scale]");
  if (!el || reduce) return;

  let raf = 0;

  function update() {
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight;
    // 0 when element top is one viewport below fold, 1 when it reaches ~30% up
    const start = vh;          // begins growing as it enters
    const end = vh * 0.3;      // fully grown near upper third
    let p = (start - rect.top) / (start - end);
    p = Math.min(1, Math.max(0, p));
    // ease out cubic
    const e = 1 - Math.pow(1 - p, 3);
    const scale = 0.35 + e * 0.65; // 0.35 -> 1.0
    el.style.transform = `scale(${scale.toFixed(4)})`;
    el.style.opacity = (0.45 + e * 0.55).toFixed(3);
  }

  function onTick() {
    if (raf) return;
    raf = requestAnimationFrame(() => { raf = 0; update(); });
  }

  el.style.willChange = "transform, opacity";
  el.style.transformOrigin = "center center";

  if (window.smooth) window.smooth.onTick(onTick);
  window.addEventListener("resize", update);
  update();
})();
