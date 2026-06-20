/* scroll-smooth.js — Lenis smooth scroll + single shared rAF ticker.
 * Other modules (hero-scale, parallax) subscribe via window.smooth.onTick().
 * Disabled under prefers-reduced-motion (native scroll, ticker still runs
 * off requestAnimationFrame so subscribers keep working with native scrollY).
 */
(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const subscribers = new Set();
  let lenis = null;

  function progress() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
  }

  function emit(scroll) {
    const data = { scroll: scroll != null ? scroll : window.scrollY, progress: progress() };
    subscribers.forEach((fn) => {
      try { fn(data); } catch (e) { /* keep loop alive */ }
    });
  }

  function startLenis() {
    if (typeof Lenis === "undefined") return false;
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on("scroll", ({ scroll }) => emit(scroll));
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return true;
  }

  function startNative() {
    // emit on native scroll + a light rAF heartbeat for time-based effects
    window.addEventListener("scroll", () => emit(), { passive: true });
    function tick() { emit(); requestAnimationFrame(tick); }
    if (reduce) {
      // no continuous loop needed; rely on scroll events only
      emit();
    } else {
      requestAnimationFrame(tick);
    }
  }

  window.smooth = {
    onTick(fn) { subscribers.add(fn); return () => subscribers.delete(fn); },
    get lenis() { return lenis; },
    scrollTo(target, opts) {
      if (lenis) lenis.scrollTo(target, opts);
      else if (target && target.scrollIntoView) target.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    },
    progress,
  };

  function init() {
    if (reduce || !startLenis()) startNative();
    emit();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
