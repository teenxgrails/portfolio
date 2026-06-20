/* parallax.js — subtle translateY on [data-parallax] images during scroll.
 * Factor from the attribute (default 0.2). Ticks off the shared smooth loop.
 * Reduced motion: no-op.
 */
(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let els = [];

  function collect() {
    els = [...document.querySelectorAll("[data-parallax]")].map((el) => ({
      el,
      factor: parseFloat(el.getAttribute("data-parallax")) || 0.2,
    }));
  }

  function update() {
    const vh = window.innerHeight;
    for (const item of els) {
      const rect = item.el.getBoundingClientRect();
      if (rect.bottom < -200 || rect.top > vh + 200) continue;
      // distance of element center from viewport center, normalized
      const center = rect.top + rect.height / 2 - vh / 2;
      const y = -center * item.factor;
      item.el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
    }
  }

  window.parallax = {
    refresh() { collect(); update(); },
  };

  if (reduce) {
    // ensure no residual transforms
    window.parallax.refresh = function () {};
    return;
  }

  function init() {
    collect();
    if (window.smooth) window.smooth.onTick(update);
    window.addEventListener("resize", () => { collect(); update(); });
    update();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
