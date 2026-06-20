/* lightbox.js — FLIP expand from grid thumb to centered overlay.
 * Backdrop black .92 + blur. Prev/next + arrow keys, counter "03/12".
 * Mobile: drag-down to dismiss. ARIA dialog semantics.
 *
 * Usage: lightbox items are any element with [data-lightbox] inside a
 * [data-lightbox-group]. Optional data-full (large src), data-caption,
 * data-dim (for placeholder boxes).
 */
(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let items = [];
  let index = 0;
  let lastFocus = null;

  // ---- build overlay once ----
  const lb = document.createElement("div");
  lb.className = "lb";
  lb.setAttribute("role", "dialog");
  lb.setAttribute("aria-modal", "true");
  lb.setAttribute("aria-label", "Image viewer");
  lb.innerHTML = `
    <button class="lb__close" type="button" aria-label="Close" data-i18n-attr="aria-label:lightbox_close">×</button>
    <button class="lb__nav lb__nav--prev" type="button" aria-label="Previous">‹</button>
    <button class="lb__nav lb__nav--next" type="button" aria-label="Next">›</button>
    <div class="lb__stage"></div>
    <div class="lb__caption" aria-live="polite"></div>
    <div class="lb__counter"></div>`;
  function mount() { document.body.appendChild(lb); }
  if (document.body) mount(); else document.addEventListener("DOMContentLoaded", mount);

  const stage = lb.querySelector(".lb__stage");
  const captionEl = lb.querySelector(".lb__caption");
  const counterEl = lb.querySelector(".lb__counter");

  function makeMedia(el) {
    const video = el.getAttribute("data-video");
    if (video) {
      const v = document.createElement("video");
      v.className = "lb__media";
      v.src = video;
      v.controls = true;
      v.autoplay = true;
      v.playsInline = true;
      v.setAttribute("aria-label", el.getAttribute("data-caption") || "video");
      const poster = el.getAttribute("data-full");
      if (poster) v.poster = poster;
      return v;
    }
    const full = el.getAttribute("data-full");
    if (full) {
      const img = document.createElement("img");
      img.className = "lb__media";
      img.src = full;
      img.alt = el.getAttribute("data-caption") || "";
      return img;
    }
    // placeholder fallback
    const box = document.createElement("div");
    box.className = "lb__media placeholder";
    box.setAttribute("data-dim", el.getAttribute("data-dim") || "IMAGE");
    return box;
  }

  function pad(n) { return String(n + 1).padStart(2, "0"); }

  function render(fromEl) {
    const el = items[index];
    stage.innerHTML = "";
    const media = makeMedia(el);
    stage.appendChild(media);
    captionEl.textContent = el.getAttribute("data-caption") || "";
    counterEl.textContent = pad(index) + " / " + String(items.length).padStart(2, "0");

    // FLIP from origin thumb
    if (!reduce && fromEl && media.getBoundingClientRect) {
      const first = fromEl.getBoundingClientRect();
      requestAnimationFrame(() => {
        const last = media.getBoundingClientRect();
        const dx = first.left + first.width / 2 - (last.left + last.width / 2);
        const dy = first.top + first.height / 2 - (last.top + last.height / 2);
        const sx = first.width / last.width;
        const sy = first.height / last.height;
        media.style.transformOrigin = "center center";
        media.style.transform = `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;
        media.style.transition = "none";
        requestAnimationFrame(() => {
          media.style.transition = "transform 0.5s var(--ease)";
          media.style.transform = "none";
        });
      });
    }
  }

  function open(group, i, fromEl) {
    items = [...group.querySelectorAll("[data-lightbox]")];
    index = i;
    lastFocus = document.activeElement;
    lb.classList.add("is-open");
    document.documentElement.style.overflow = "hidden";
    if (window.smooth && window.smooth.lenis) window.smooth.lenis.stop();
    render(fromEl);
    lb.querySelector(".lb__close").focus();
  }

  function close() {
    lb.classList.remove("is-open");
    document.documentElement.style.overflow = "";
    if (window.smooth && window.smooth.lenis) window.smooth.lenis.start();
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function step(d) {
    index = (index + d + items.length) % items.length;
    render(null);
  }

  // ---- events ----
  lb.querySelector(".lb__close").addEventListener("click", close);
  lb.querySelector(".lb__nav--prev").addEventListener("click", () => step(-1));
  lb.querySelector(".lb__nav--next").addEventListener("click", () => step(1));
  lb.addEventListener("click", (e) => { if (e.target === lb) close(); });

  document.addEventListener("keydown", (e) => {
    if (!lb.classList.contains("is-open")) return;
    if (e.key === "Escape") close();
    else if (e.key === "ArrowLeft") step(-1);
    else if (e.key === "ArrowRight") step(1);
    else if (e.key === "Tab") {
      // simple focus trap
      const f = lb.querySelectorAll("button");
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  // drag-down to dismiss (touch)
  let startY = null;
  lb.addEventListener("touchstart", (e) => { startY = e.touches[0].clientY; }, { passive: true });
  lb.addEventListener("touchmove", (e) => {
    if (startY == null) return;
    const dy = e.touches[0].clientY - startY;
    if (dy > 0) { stage.style.transform = `translateY(${dy}px)`; stage.style.opacity = String(1 - dy / 500); }
  }, { passive: true });
  lb.addEventListener("touchend", (e) => {
    const dy = e.changedTouches[0].clientY - (startY || 0);
    stage.style.transform = ""; stage.style.opacity = "";
    if (dy > 120) close();
    startY = null;
  });

  // ---- delegation: open from any grouped thumb ----
  document.addEventListener("click", (e) => {
    const el = e.target.closest && e.target.closest("[data-lightbox]");
    if (!el) return;
    const group = el.closest("[data-lightbox-group]");
    if (!group) return;
    e.preventDefault();
    const list = [...group.querySelectorAll("[data-lightbox]")];
    open(group, list.indexOf(el), el);
  });

  window.lightbox = { open, close };
})();
