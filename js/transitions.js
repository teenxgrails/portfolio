/* transitions.js — fashion page transition: a black curtain wipes up across
 * the navigation (covers the old page, then keeps rising to reveal the new one),
 * with the été23 wordmark flashing on the cover. One continuous vertical wipe.
 *
 * Multi-page site: clicking a [data-transition] link plays the COVER half and
 * sets a flag; the next page reads the flag on load and plays the REVEAL half.
 * Reduced motion: plain navigation, no curtain.
 */
(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var DUR = 560;

  var style = document.createElement("style");
  style.textContent =
    ".curtain{position:fixed;inset:0;z-index:9999;background:#000;transform:translateY(100%);" +
    "display:flex;align-items:center;justify-content:center;pointer-events:none;will-change:transform}" +
    ".curtain__mark{font-family:var(--font);font-weight:500;text-transform:uppercase;" +
    "letter-spacing:.04em;font-size:clamp(20px,4vw,42px);color:#fff;opacity:0;transition:opacity .3s ease}" +
    ".curtain.is-cover{transform:translateY(0)}" +
    ".curtain.is-up{transform:translateY(-100%)}" +
    ".curtain.anim{transition:transform " + DUR + "ms cubic-bezier(.76,0,.24,1)}" +
    ".curtain.is-cover .curtain__mark{opacity:1}";
  document.head.appendChild(style);

  var cur = document.createElement("div");
  cur.className = "curtain";
  cur.innerHTML = '<span class="curtain__mark">été23</span>';
  function mount() { document.body.appendChild(cur); }
  if (document.body) mount(); else document.addEventListener("DOMContentLoaded", mount);

  // REVEAL half — runs on load if we just navigated through the curtain.
  function reveal() {
    if (!sessionStorage.getItem("ete-nav")) return;
    sessionStorage.removeItem("ete-nav");
    cur.classList.add("is-cover"); // cover instantly (no transition yet)
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        cur.classList.add("anim", "is-up");
        cur.classList.remove("is-cover");
        setTimeout(function () { cur.className = "curtain"; }, DUR + 60);
      });
    });
  }
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", reveal);
  else reveal();

  // COVER half — wipe up to cover, then navigate.
  function cover(url) {
    sessionStorage.setItem("ete-nav", "1");
    cur.classList.add("anim");
    requestAnimationFrame(function () { cur.classList.add("is-cover"); });
    var done = false;
    function go() { if (done) return; done = true; location.href = url; }
    cur.addEventListener("transitionend", go, { once: true });
    setTimeout(go, DUR + 140); // safety net
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
    cover(href);
  });
})();
