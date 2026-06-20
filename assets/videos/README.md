# assets/videos

Drop your **video files** here.

Two uses:

### 1. Dashboard loop clips (homepage)
Short, compressed, muted loops that play behind each category tile.
Recommended names (referenced by `index.html`):

- `websites.mp4`  (+ optional `websites.jpg` poster frame)
- `programs.mp4`  (+ `programs.jpg`)
- `videos.mp4`    (+ `videos.jpg`)
- `designs.mp4`   (+ `designs.jpg`)

Keep them small (H.264/MP4, a few seconds, ~1–3 MB each). After adding a clip,
open `index.html` and uncomment the `<video>` block inside the matching tile
(it sits next to the placeholder `<div>`).

### 2. Video works (videos page)
For the Videos grid, host the full clip anywhere (or place it here) and set its
URL in `data/videos.json` → `videoUrl`, plus an optional `poster` image.

Until a clip is added, tiles show a gray placeholder box — nothing breaks.
