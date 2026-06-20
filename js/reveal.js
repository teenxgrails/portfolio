/* reveal.js — IntersectionObserver fade-up + slight blur on enter.
 * Children of [data-reveal-group] stagger by 60ms.
 * Reduced motion: elements are shown immediately (CSS fallback) and we
 * simply mark them in.
 */
(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const items = () => document.querySelectorAll("[data-reveal]");

  function showAll() {
    items().forEach((el) => el.classList.add("is-in"));
  }

  if (reduce || !("IntersectionObserver" in window)) {
    if (document.readyState === "loading")
      document.addEventListener("DOMContentLoaded", showAll);
    else showAll();
    return;
  }

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      // stagger within a group
      const group = el.closest("[data-reveal-group]");
      if (group) {
        const sibs = [...group.querySelectorAll("[data-reveal]")];
        const idx = sibs.indexOf(el);
        el.style.setProperty("--reveal-delay", Math.max(0, idx) * 60 + "ms");
      }
      el.classList.add("is-in");
      obs.unobserve(el);
    });
  }, { rootMargin: "0px 0px -10% 0px", threshold: 0.15 });

  function observe() { items().forEach((el) => io.observe(el)); }

  // expose so render.js can re-scan after injecting items
  window.reveal = { observe };

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", observe);
  else observe();
})();
