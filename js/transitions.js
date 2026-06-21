/* transitions.js — fashion page transition: the screen darkens with a vignette
 * and the "Été23" wordmark, then the next page fades back in. A bit slower than
 * a plain fade so it reads as a moment, not a flicker.
 *
 * Multi-page site: a [data-transition] click plays the DARKEN half and sets a
 * flag; the next page reads the flag on load and plays the REVEAL half.
 * Reduced motion: plain navigation.
 */
(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var DUR = 640;

  var style = document.createElement("style");
  style.textContent =
    ".curtain{position:fixed;inset:0;z-index:9999;opacity:0;pointer-events:none;" +
    "display:flex;align-items:center;justify-content:center;" +
    "background:radial-gradient(ellipse at center,#0c0c0c 0%,#000 70%);" +
    "transition:opacity " + DUR + "ms ease}" +
    ".curtain.is-on{opacity:1}" +
    ".curtain__mark{font-family:var(--font);font-weight:500;text-transform:uppercase;" +
    "letter-spacing:.12em;font-size:clamp(22px,5vw,54px);color:#fff;" +
    "opacity:0;transform:scale(.96);" +
    "transition:opacity .5s ease .08s,transform " + (DUR + 160) + "ms ease}" +
    ".curtain.is-on .curtain__mark{opacity:1;transform:scale(1)}";
  document.head.appendChild(style);

  var cur = document.createElement("div");
  cur.className = "curtain";
  cur.innerHTML = '<span class="curtain__mark">Été23</span>';
  function mount() { document.body.appendChild(cur); }
  if (document.body) mount(); else document.addEventListener("DOMContentLoaded", mount);

  // REVEAL — fade the darken away on load if we just navigated.
  function reveal() {
    if (!sessionStorage.getItem("ete-nav")) return;
    sessionStorage.removeItem("ete-nav");
    cur.classList.add("is-on"); // opaque, no transition yet
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        cur.classList.remove("is-on"); // fade out (stays in DOM, opacity:0)
      });
    });
  }
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", reveal);
  else reveal();

  // DARKEN — fade to vignette, then navigate.
  function darken(url) {
    sessionStorage.setItem("ete-nav", "1");
    requestAnimationFrame(function () { cur.classList.add("is-on"); });
    var done = false;
    function go() { if (done) return; done = true; location.href = url; }
    cur.addEventListener("transitionend", function (e) {
      if (e.target === cur && e.propertyName === "opacity") go();
    });
    setTimeout(go, DUR + 160); // safety net
  }

  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[data-transition]");
    if (!a) return;
    var href = a.getAttribute("href");
    if (!href || href.charAt(0) === "#" || a.target === "_blank") return;
    try { if (new URL(href, location.href).origin !== location.origin) return; }
    catch (_) { return; }
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    if (reduce) return; // plain navigation
    e.preventDefault();
    darken(href);
  });
})();
