/* render.js — build grid items from data/*.json.
 * One renderer, per-page config via <body data-render="websites"> etc.
 * Layouts:
 *   - "projects": desktop + phone-frame mobile, alternating L/R, caption below
 *                 (websites, programs)
 *   - "videos":   thumbnail grid -> modal/lightbox, caption below
 *   - "designs":  dense ~3-col grid -> lightbox
 * Images may be missing -> placeholder boxes (gray + dimension label).
 */
(function () {
  const ROOT = document.querySelector("[data-render]");
  if (!ROOT) return;
  const kind = ROOT.getAttribute("data-render");
  const src = ROOT.getAttribute("data-src") || ("data/" + kind + ".json");

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  // a media cell: real <img> if src present, else placeholder box
  function mediaCell(img, dim, opts) {
    opts = opts || {};
    const cls = ["media-cell"];
    if (opts.phone) cls.push("media-cell--phone");
    if (img) {
      return `<button class="${cls.join(" ")}" type="button"
                data-lightbox data-full="${esc(img)}" data-caption="${esc(opts.caption || "")}"
                aria-label="${esc(opts.caption || "Open image")}">
                <img src="${esc(img)}" alt="${esc(opts.caption || "")}" loading="lazy" />
              </button>`;
    }
    const phoneCls = opts.phone ? " placeholder--phone" : "";
    return `<button class="${cls.join(" ")}" type="button"
              data-lightbox data-dim="${esc(dim || "IMAGE")}" data-caption="${esc(opts.caption || "")}"
              aria-label="${esc(opts.caption || "Open image")}">
              <span class="placeholder${phoneCls}" data-dim="${esc(dim || "IMAGE")}"></span>
            </button>`;
  }

  function renderProjects(data) {
    ROOT.classList.add("grid-projects");
    ROOT.setAttribute("data-lightbox-group", "");
    ROOT.innerHTML = (data.items || []).map((it, i) => {
      const flip = i % 2 === 1 ? " project--flip" : "";
      const desk = mediaCell(it.imageDesktop, "DESKTOP · 1600×1000", { caption: it.title });
      const mob = mediaCell(it.imageMobile, "MOBILE · 390×844", { phone: true, caption: it.title });
      const cap = `<figcaption class="project__cap">
          <span class="project__title">${esc(it.title)}</span>
          <span class="project__desc muted">${esc(it.description || "")}</span>
        </figcaption>`;
      return `<figure class="project${flip}" data-reveal data-reveal-group>
          <div class="project__shots" data-parallax-group>
            <div class="project__desk" data-parallax="0.2">${desk}</div>
            <div class="project__mob" data-parallax="0.12">${mob}</div>
          </div>
          ${cap}
        </figure>`;
    }).join("");
  }

  function renderVideos(data) {
    ROOT.classList.add("grid-videos");
    ROOT.setAttribute("data-lightbox-group", "");
    ROOT.innerHTML = (data.items || []).map((it) => {
      const thumb = it.poster
        ? `<button class="media-cell" type="button" data-lightbox data-full="${esc(it.poster)}"
             data-video="${esc(it.videoUrl || "")}" data-caption="${esc(it.title)}"
             aria-label="${esc(it.title)}">
             <img src="${esc(it.poster)}" alt="${esc(it.title)}" loading="lazy" />
             <span class="play-badge" aria-hidden="true">▶</span>
           </button>`
        : `<button class="media-cell" type="button" data-lightbox data-dim="VIDEO · 16:9"
             data-video="${esc(it.videoUrl || "")}" data-caption="${esc(it.title)}"
             aria-label="${esc(it.title)}">
             <span class="placeholder" data-dim="VIDEO · 16:9"></span>
             <span class="play-badge" aria-hidden="true">▶</span>
           </button>`;
      return `<figure class="vid" data-reveal>
          ${thumb}
          <figcaption class="project__cap">
            <span class="project__title">${esc(it.title)}</span>
            <span class="project__desc muted">${esc(it.description || "")}</span>
          </figcaption>
        </figure>`;
    }).join("");
  }

  function renderDesigns(data) {
    ROOT.classList.add("grid-designs");
    ROOT.setAttribute("data-lightbox-group", "");
    ROOT.innerHTML = (data.items || []).map((it) => {
      return mediaCell(it.image, "DESIGN · 2560×2560", { caption: it.title });
    }).map((m) => `<div class="design-cell" data-reveal>${m}</div>`).join("");
  }

  fetch(src)
    .then((r) => r.json())
    .then((data) => {
      if (kind === "videos") renderVideos(data);
      else if (kind === "designs") renderDesigns(data);
      else renderProjects(data);
      // re-scan for reveal + parallax now that DOM exists
      if (window.reveal) window.reveal.observe();
      if (window.parallax) window.parallax.refresh();
      document.dispatchEvent(new CustomEvent("render:done", { detail: { kind } }));
    })
    .catch((err) => {
      ROOT.innerHTML = `<p class="muted" style="padding:2rem">Could not load ${esc(kind)} data.</p>`;
    });
})();
