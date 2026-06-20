# assets/images

Drop your **pictures** here.

| Folder | What goes in it |
|--------|-----------------|
| `designs/` | Old design works (2022–2023). Square exports live here. |
| `uploads/` | Created automatically by the admin (Decap CMS) when you add works through `/admin`. You normally don't touch this by hand. |

For website / program screenshots you can either:
1. Add them through **`/admin`** (recommended — they land in `uploads/` and the JSON is updated for you), or
2. Drop the files here manually and point to them in the matching `data/*.json`
   (`imageDesktop`, `imageMobile`, `poster`, `image`). Paths are relative to the
   site root, e.g. `assets/images/designs/095.jpg`.

Until an image path is filled in, the site shows a gray placeholder box with its
intended dimensions — nothing breaks.
