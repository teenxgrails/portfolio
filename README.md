# ete23.com

Underground / editorial portfolio for **été23** — websites, programs, videos and
designs. Pure HTML + CSS + JS, no framework and no build step. Hosted on GitHub
Pages. Content for the grid pages is driven by `data/*.json` and editable through a
Git-based admin (Decap CMS) — no code required to add new work.

## Structure

```
index.html            Dashboard — 4 category tiles (the navigation itself)
websites.html         Project grid (desktop + mobile shots)
programs.html         Project grid
videos.html           Video thumbnail grid → modal player
designs.html          VK-style annotated composite + dense designs grid
admin/                Decap CMS (config.yml + loader)
css/                  reset, tokens, global, dashboard, grid-page, lightbox
js/                   i18n, render, lightbox, cursor, scroll-smooth, transitions,
                      parallax, reveal, lines, hero-scale
data/*.json           Content for each grid page
assets/images/        Pictures (see assets/images/README.md)
assets/videos/        Dashboard loops + video works (see assets/videos/README.md)
CNAME                 Custom domain (ete23.com)
```

Only two external dependencies, both via CDN: **Lenis** (smooth scroll, ~6 kb) and
**Decap CMS** (admin only). Everything else is hand-written and ships as-is.

## Adding new work

### The easy way — `/admin`
1. Go to **https://ete23.com/admin/** (or `/admin/` on your Pages URL).
2. Sign in with GitHub (one-time OAuth setup below).
3. Pick a collection (Websites / Programs / Videos / Designs), add an item, upload
   images, save.
4. Decap commits the change to `data/*.json` on the `main` branch → GitHub Pages
   rebuilds automatically (~1 minute) → the new work appears live.

Project titles/descriptions are English only (kept simple for an international job
search). The UI chrome auto-translates (FR / DE / EN / IT / RU); content does not.

### The manual way
Edit the relevant `data/*.json` file directly and commit. Drop any referenced image
into `assets/images/...` (paths are relative to the site root). Empty image fields
render as gray placeholder boxes, so partial entries are safe.

## One-time admin (OAuth) setup

Decap's GitHub backend needs an OAuth handshake. GitHub Pages is static, so you host
a tiny free proxy once:

1. **Create a GitHub OAuth App**
   - GitHub → Settings → Developer settings → OAuth Apps → *New OAuth App*.
   - Homepage URL: `https://ete23.com`
   - Authorization callback URL: `https://YOUR-OAUTH-PROXY.vercel.app/callback`
   - Note the **Client ID** and **Client Secret**.

2. **Deploy the OAuth proxy on Vercel** (free)
   - Use the community proxy, e.g. `vencax/netlify-cms-github-oauth-provider`
     (a.k.a. the Decap/Netlify CMS GitHub OAuth proxy).
   - Set environment variables on Vercel:
     - `OAUTH_CLIENT_ID` = your Client ID
     - `OAUTH_CLIENT_SECRET` = your Client Secret
   - Deploy → you get a URL like `https://your-proxy.vercel.app`.
   - Put that same URL back as the OAuth App's callback (`/callback`).

3. **Point the CMS at the proxy**
   - In `admin/config.yml`, uncomment and set under `backend:`
     ```yaml
     base_url: https://YOUR-OAUTH-PROXY.vercel.app
     ```
   - Commit. Now `/admin` can log in.

`config.yml` already targets `repo: teenxgrails/portfolio`, `branch: main`, with
media uploads going to `assets/images/uploads`.

## Local preview

No build step — just serve the folder:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

(`file://` won't work because pages `fetch()` the JSON — use a local server.)

## Deploying

GitHub Pages serving `main` at the repo root. The `CNAME` file maps the site to
`ete23.com`; set that domain in repo **Settings → Pages** and add the DNS records
GitHub shows you. Build on a feature branch, merge to `main` to publish.

## Accessibility & motion

Respects `prefers-reduced-motion`: the custom cursor, smooth scroll, parallax, page
transitions, line animation and hero scaling all fall back to static, fully usable
versions. Lightbox is keyboard-navigable (arrows / Esc) with focus trapping and ARIA
dialog semantics.
