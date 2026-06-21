# HANDOFF — ete23.com (été23 portfolio)

Read this first, then skim `README.md`, `data/*.json`, `index.html`, `css/`, `js/`.
Don't re-derive what's already written here.

## What this is
Static portfolio (pure HTML/CSS/JS, **no build step**) on GitHub Pages, custom domain
**ete23.com**. Content-driven from `data/*.json`. Decap CMS admin at `/admin`.
Repo: `teenxgrails/portfolio`. Work branch: `claude/cool-goldberg-od49av` (deploy = `main`).

## Current state (done)
- Redesigned toward **luxury-fashion** (ERD / Balenciaga) and merged to `main` (PR #1, #2).
- **Clean URLs (folder-per-page):** `/`, `/websites`, `/programs`, `/videos`, `/designs`.
  Assets referenced root-absolute (`/css`, `/js`, `/assets`, `/data`).
- **Type:** Helvetica Neue Medium, tight tracking, monochrome (no blue), monochrome `::selection`.
- **Motion minimal:** removed custom cursor, language switcher (auto-detect only), moving
  dashed lines, blur reveals, scroll-scaling email, parallax. Kept subtle fades + Lenis scroll.
- **Dashboard:** 4 full-bleed video tiles + static email + `Été23` favicon.
- **Websites/Programs:** video projects (desktop clip + iPhone-CSS-framed mobile), alternating.
- **Videos:** full-width stacked clips. **Designs:** static dashed banner/avatar/other diagram
  + dense grid of the real ~93 images in `assets/images/designs/`.
- Empty placeholder projects removed — `data/*.json` reference only real media that exists.

## User's requirements (must respect)
- Aesthetic of **enfantsrichesdeprimes.com** + **balenciaga.com**; button/hover detail like
  **specialoffer.inc**. Must NOT look "AI-generated". Luxury, editorial, stark black.
- **Font = Helvetica Neue**, Medium weight, tighter letter-spacing, slightly taller.
- Auto language (no switcher). Clean URLs (`ete23.com`, `ete23.com/websites`).
- Text selection black/monochrome, never blue. Site name **Été23**.
- All 4 dashboard categories are video.

## Outstanding TODO
1. **Match the references precisely** — earlier sessions had NO internet, so the look was
   guessed from mockups. If internet is now available, open ERD + Balenciaga, capture the real
   font/scale/spacing/hover behavior, and tune `css/` to match. Verify first: `curl -sS -o /dev/null -w '%{http_code}' https://example.com` → expect `200`.
2. **`.mov` clips:** `assets/videos/websites/teenxgrailed2025/*.mov` won't play in Chrome/FF and
   are currently unused. Convert to `.mp4` H.264 (needs `ffmpeg`; previous env had none) and
   wire as a website project, or have the user re-upload mp4.
3. **Real font file:** no webfont bundled (Helvetica Neue is licensed). If a `.woff2` is added to
   `assets/fonts/`, hook it via `@font-face` in `css/tokens.css`.
4. **Final dashboard loops:** tiles use existing clips as placeholders; swap when user adds
   per-category loops.

## Hard constraints / gotchas
- Pages `fetch()` JSON → must serve over http (`python3 -m http.server`), not `file://`.
- GitHub write access needs the **Claude GitHub App installed** on the repo (not just OAuth).
- Network access is set by the **environment policy** and only applies to a **fresh session**.
- Deploy = merge to `main`; Pages rebuilds ~1 min. `CNAME` = ete23.com (DNS already verified).

## Key files
`index.html`; `{websites,programs,videos,designs}/index.html`; `css/{tokens,global,dashboard,
grid-page,lightbox}.css`; `js/{render,reveal,lightbox,i18n,scroll-smooth,transitions}.js`;
`data/*.json`; `admin/config.yml`.

## Working style (save tokens)
- Don't re-explore what's documented here. Make a short plan, then execute.
- Don't repeatedly poll the network/PR status or re-run checks "to be safe". One check is enough.
- Don't ask the user questions you can answer from the repo or sensible defaults; batch any
  genuine questions into one round. Prefer doing over asking.
