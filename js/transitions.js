/* transitions.js — page transitions for this multi-page site.
 *
 * Primary: cross-document View Transitions (CSS opt-in below) — the browser
 * captures old/new snapshots across the navigation and runs the fade + scale
 * keyframes (out -> 0.96, in <- 1.04, 600ms). Supported browsers get it for
 * free on any same-origin navigation.
 *
 * Fallback: browsers without cross-document VT just navigate normally. We add
 * a brief outgoing fade so the transition still reads, then let the full page
 * load handle the incoming side. This is more reliable than a script-rerun
 * fetch+swap given every page boots its own module scripts.
 *
 * Reduced motion: no opt-in, no fade — plain navigation.
 */
(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const supportsCrossDocVT =
    "startViewTransition" in document &&
    CSS && CSS.supports && CSS.supports("view-transition-name: none");

  if (!reduce) {
    const style = document.createElement("style");
    style.textContent = `
      @view-transition { navigation: auto; }
      @keyframes ete-out { to { opacity: 0; transform: scale(0.96); } }
      @keyframes ete-in  { from { opacity: 0; transform: scale(1.04); } }
      ::view-transition-old(root) {
        animation: ete-out var(--dur,600ms) var(--ease,cubic-bezier(0.65,0,0.35,1)) both;
      }
      ::view-transition-new(root) {
        animation: ete-in var(--dur,600ms) var(--ease,cubic-bezier(0.65,0,0.35,1)) both;
      }
      html.is-leaving { opacity: 0; transform: scale(0.98);
        transition: opacity .28s var(--ease), transform .28s var(--ease); }`;
    document.head.appendChild(style);
  }

  function sameOrigin(href) {
    try { return new URL(href, location.href).origin === location.origin; }
    catch { return false; }
  }

  function go(url) {
    // Cross-document VT browsers animate natively on navigation — just go.
    if (reduce || supportsCrossDocVT) { location.href = url; return; }
    // Fallback: quick outgoing fade, then navigate.
    document.documentElement.classList.add("is-leaving");
    setTimeout(() => { location.href = url; }, 260);
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
