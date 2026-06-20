/* transitions.js — page transitions via View Transitions API with a
 * fetch + swap fallback. Fade + scale (out -> 0.96, in <- 1.04), 600ms.
 * Intercepts same-origin links marked [data-transition].
 * Reduced motion: plain navigation (no animation).
 */
(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const supportsVT = "startViewTransition" in document;

  // inject transition keyframes for VT pseudo-elements
  if (supportsVT && !reduce) {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes ete-out { to { opacity: 0; transform: scale(0.96); } }
      @keyframes ete-in  { from { opacity: 0; transform: scale(1.04); } }
      ::view-transition-old(root) {
        animation: ete-out var(--dur-page, 600ms) var(--ease-page, cubic-bezier(0.65,0,0.35,1)) both;
      }
      ::view-transition-new(root) {
        animation: ete-in var(--dur-page, 600ms) var(--ease-page, cubic-bezier(0.65,0,0.35,1)) both;
      }`;
    document.head.appendChild(style);
  }

  function sameOrigin(href) {
    try { return new URL(href, location.href).origin === location.origin; }
    catch { return false; }
  }

  function go(url) {
    if (reduce) { location.href = url; return; }
    if (supportsVT) {
      document.startViewTransition(() => {
        return new Promise((resolve) => {
          // navigate after capturing old snapshot
          window.addEventListener("pagehide", resolve, { once: true });
          location.href = url;
        });
      });
    } else {
      location.href = url; // simple, robust fallback
    }
  }

  document.addEventListener("click", (e) => {
    const a = e.target.closest && e.target.closest("a[data-transition]");
    if (!a) return;
    const href = a.getAttribute("href");
    if (!href || href.startsWith("#") || a.target === "_blank") return;
    if (!sameOrigin(href)) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    go(href);
  });
})();
