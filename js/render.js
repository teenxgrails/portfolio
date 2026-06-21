/* render.js — build grid pages from /data/*.json.
 * <body data-render="websites|programs|videos|designs">, container [data-render-into].
 * Projects (websites/programs) use VIDEO (desktop + iPhone-framed mobile), alternating.
 * Videos page: full-width clips stacked with captions. Designs: dense image grid.
 */
(function () {
  const ROOT = document.querySelector("[data-render-into]");
  if (!ROOT) return;
  const kind = ROOT.getAttribute("data-render-into");
  const src = "/data/" + kind + ".json";

  const esc = (s) => String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  // a <video> (with optional extra <source> for .mov) or a placeholder box
  function videoEl(srcMp4, srcAlt, dim, extraClass) {
    const cls = "media" + (extraClass ? " " + extraClass : "");
    if (!srcMp4 && !srcAlt) {
      return `<div class="${cls}"><span class="placeholder" data-dim="${esc(dim)}"></span></div>`;
    }
    const sources =
      (srcMp4 ? `<source src="${esc(srcMp4)}" type="video/mp4" />` : "") +
      (srcAlt ? `<source src="${esc(srcAlt)}" type="video/quicktime" />` : "");
    return `<div class="${cls}"><video autoplay loop muted playsinline preload="metadata" data-autoplay>${sources}</video></div>`;
  }

  function phone(inner) {
    return `<div class="phone"><div class="phone__screen">${inner}</div></div>`;
  }

  function renderProjects(data) {
    ROOT.classList.add("projects");
    ROOT.innerHTML = (data.items || []).map((it) => {
      const layout = it.layout || "desktop-mobile";
      const desk = videoEl(it.desktopVideo, it.desktopVideoAlt, "DESKTOP", "media--desktop");
      const mob = it.layout === "desktop-only" ? "" :
        phone(videoEl(it.mobileVideo, it.mobileVideoAlt, "MOBILE", "media--mobile"));

      let shots, capAlign;
      if (layout === "desktop-only") {
        shots = `<div class="shots shots--solo">${desk}</div>`;
        capAlign = "is-center";
      } else if (layout === "mobile-desktop") {
        shots = `<div class="shots shots--mobile-first">${mob}${desk}</div>`;
        capAlign = "is-center";
      } else {
        shots = `<div class="shots shots--desktop-first">${desk}${mob}</div>`;
        capAlign = "is-left";
      }

      const desc = it.description ? ` <span class="muted">/ ${esc(it.description)} ……</span>` : "";
      return `<figure class="project" data-reveal>
        ${shots}
        <figcaption class="project__cap ${capAlign}">
          <span class="project__title">${esc(it.title)}</span>${desc}
        </figcaption>
      </figure>`;
    }).join("");
  }

  function renderVideos(data) {
    ROOT.classList.add("videos");
    ROOT.innerHTML = (data.items || []).map((it) => {
      return `<figure class="film" data-reveal>
        ${videoEl(it.video, it.videoAlt, "VIDEO 16:9", "media--film")}
        <figcaption class="project__cap is-left">
          <span class="project__title">${esc(it.title)}</span>
          ${it.description ? `<span class="muted">/ ${esc(it.description)} ……</span>` : ""}
        </figcaption>
      </figure>`;
    }).join("");
  }

  function renderDesigns(data) {
    ROOT.classList.add("designs-grid");
    ROOT.setAttribute("data-lightbox-group", "");
    ROOT.innerHTML = (data.items || []).map((it, i) => {
      const cap = it.title ? ` data-caption="${esc(it.title)}"` : "";
      const delay = Math.min(i, 24) * 40; // cap the stagger so later rows don't lag
      return `<button class="cell" type="button" style="--d:${delay}ms" data-lightbox data-full="${esc(it.image)}"${cap}
                aria-label="${esc(it.title || "Open design")}">
        <img src="${esc(it.image)}" alt="${esc(it.title || "")}" loading="lazy" />
      </button>`;
    }).join("");
  }

  function playVisibleVideos() {
    const vids = ROOT.querySelectorAll("video[data-autoplay]");
    if (!vids.length || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        const v = e.target;
        if (e.isIntersecting && e.intersectionRatio >= 0.4) {
          const p = v.play(); if (p && p.catch) p.catch(() => {});
        } else v.pause();
      });
    }, { threshold: [0, 0.4, 1] });
    vids.forEach((v) => io.observe(v));
  }

  fetch(src)
    .then((r) => r.json())
    .then((data) => {
      if (kind === "videos") renderVideos(data);
      else if (kind === "designs") renderDesigns(data);
      else renderProjects(data);
      playVisibleVideos();
      if (window.reveal) window.reveal.observe();
      document.dispatchEvent(new CustomEvent("render:done", { detail: { kind } }));
    })
    .catch(() => {
      ROOT.innerHTML = `<p class="muted" style="padding:2rem 0">Could not load ${esc(kind)}.</p>`;
    });
})();
