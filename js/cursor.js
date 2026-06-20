/* cursor.js — custom cursor: 12px white circle, mix-blend difference,
 * lerp follow 0.15. Hover clickable -> scale 40px + label.
 * Hidden on touch devices and under prefers-reduced-motion.
 */
(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
  if (reduce || isTouch) return;

  const el = document.createElement("div");
  el.className = "cursor";
  el.setAttribute("aria-hidden", "true");
  const label = document.createElement("span");
  label.className = "cursor__label";
  el.appendChild(label);

  function mount() {
    document.body.appendChild(el);
    document.documentElement.classList.add("has-cursor");
  }
  if (document.body) mount();
  else document.addEventListener("DOMContentLoaded", mount);

  let x = window.innerWidth / 2, y = window.innerHeight / 2;
  let tx = x, ty = y;
  let active = false;

  window.addEventListener("mousemove", (e) => {
    tx = e.clientX; ty = e.clientY;
    if (!active) { active = true; el.classList.add("is-visible"); }
  }, { passive: true });

  window.addEventListener("mouseout", (e) => {
    if (!e.relatedTarget) { active = false; el.classList.remove("is-visible"); }
  });

  // hover detection (event delegation)
  function hoverTarget(node) {
    return node && node.closest && node.closest('a, button, [data-cursor], .grid-item, [role="button"]');
  }
  document.addEventListener("mouseover", (e) => {
    const t = hoverTarget(e.target);
    if (t) {
      el.classList.add("is-active");
      const lbl = t.getAttribute("data-cursor-label");
      label.textContent = lbl || (window.i18n ? window.i18n.t("lightbox_open") : "Open");
    }
  });
  document.addEventListener("mouseout", (e) => {
    const t = hoverTarget(e.target);
    if (t && !hoverTarget(e.relatedTarget)) {
      el.classList.remove("is-active");
      label.textContent = "";
    }
  });

  function raf() {
    x += (tx - x) * 0.15;
    y += (ty - y) * 0.15;
    el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
})();
