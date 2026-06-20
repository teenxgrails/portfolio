# Été23 — ete23.com

Underground / luxury-fashion portfolio for **été23** — websites, programs, videos and
designs. Pure HTML + CSS + JS, no framework, no build step. Hosted on GitHub Pages.
Grid pages are driven by `data/*.json` and editable through a Git-based admin (Decap CMS).

## Structure (clean URLs via folders)

```
index.html            → ete23.com           (dashboard, 4 video tiles)
websites/index.html   → ete23.com/websites
programs/index.html   → ete23.com/programs
videos/index.html     → ete23.com/videos
designs/index.html    → ete23.com/designs
admin/                → Decap CMS
css/                  reset, tokens, global, dashboard, grid-page, lightbox
js/                   i18n, render, lightbox, scroll-smooth, transitions, reveal
data/*.json           content for each grid page
assets/               videos, programs, images/designs (your media)
favicon.svg           black square + white "é23"
CNAME                 ete23.com
```

All asset references are root-absolute (`/css/…`, `/js/…`, `/assets/…`), so the clean
URLs work on the custom domain.

## Look & behaviour
- **Font:** Helvetica Neue Medium (stack `"Helvetica Neue", Helvetica, Arial`). It renders
  true Helvetica Neue on Apple devices; on others it falls back to Helvetica/Arial. To
  guarantee it everywhere, drop a licensed `Helvetica Neue` `.woff2` into `assets/fonts/`
  and add an `@font-face` in `css/tokens.css`.
- **Language:** auto-detected from the browser (FR/DE/EN/IT/RU) — no switcher. Project
  titles/descriptions stay English.
- **Motion:** minimal (ERD-style) — subtle fades, refined hovers, Lenis smooth scroll.
  No custom cursor, no moving lines, monochrome text selection.

## Adding / editing work

### Via `/admin` (Decap CMS)
1. Open `ete23.com/admin/`, sign in with GitHub (one-time OAuth setup below).
2. Pick a collection (Websites / Programs / Videos / Designs), edit items, upload media, save.
3. Decap commits to `data/*.json` on `main` → GitHub Pages rebuilds (~1 min).

### Manually
Edit `data/*.json`. Project schema (websites/programs):
`{ title, description, layout, desktopVideo, mobileVideo, link }` where
`layout` is `desktop-mobile` | `mobile-desktop` | `desktop-only`. Designs: `{ image, title? }`.
Empty media fields render as gray placeholder boxes, so partial entries are safe.

### Media notes
- Put project clips under `assets/…` and reference them with root-absolute paths
  (e.g. `/assets/videos/teenxgrailed1.mp4`).
- **Use MP4 (H.264).** `.mov` files often won't play in Chrome/Firefox. The
  `teenxgrailed2025/*.mov` clips are currently unused for that reason — re-export them as
  `.mp4` and point the JSON at them.

## One-time admin (OAuth) setup
Decap's GitHub backend needs an OAuth proxy (GitHub Pages is static):
1. Create a GitHub OAuth App (callback `https://YOUR-PROXY.vercel.app/callback`).
2. Deploy the Decap/Netlify-CMS GitHub OAuth proxy on Vercel with env
   `OAUTH_CLIENT_ID` / `OAUTH_CLIENT_SECRET`.
3. Set `base_url: https://YOUR-PROXY.vercel.app` under `backend:` in `admin/config.yml`.

## Local preview
No build step — serve the folder (pages `fetch()` JSON, so `file://` won't work):
```bash
python3 -m http.server 8000   # http://localhost:8000
```

## Deploying
GitHub Pages serves `main` at the repo root; `CNAME` maps it to `ete23.com`.
Build on a feature branch, merge to `main` to publish.
