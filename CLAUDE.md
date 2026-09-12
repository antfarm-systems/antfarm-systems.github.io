# Working on this site

Jekyll on GitHub Pages. `bundle exec jekyll build` to check your work; `_site/` is
gitignored. Commit attribution rules live in `README.md` under Agent Guidelines.

## Reviewing a post

Fix these without asking — they're house style, not judgment calls:

- **YouTube embeds use `www.youtube-nocookie.com/embed/...`.** Pasting from YouTube
  gives you `www.youtube.com`, which sets tracking cookies on page load whether or
  not anyone watches. The nocookie host waits for a play. Swap the host, keep
  everything after `/embed/` including any `?si=` param. Plain `watch?v=` links in
  prose are fine as-is — this is only about `<iframe>` embeds.

- **Every post needs an explicit `excerpt:`.** Jekyll's default excerpt is the first
  content block, so a post that opens with an `<img>` or an `<iframe>` produces an
  empty one — and `_includes/head.html` feeds the excerpt to `description`,
  `og:description`, and `twitter:description`. The result is a blank Google snippet
  and a blank link card. One or two sentences in Luis's voice, ~160 chars.

- **Quote posts need `type: quote`.** Without it the layout renders the quote as
  ordinary prose and never prints `quote_source`, so the attribution vanishes from
  the page. Quote posts carry no `author` — they're deliberately unsigned. `title:`
  is a short human kicker, not the filename slug.

- **`image:` must be root-relative** (`/images/covers/foo.jpg`). `head.html` runs it
  through `absolute_url`, so an absolute URL comes out doubled. This rules out photo
  CDN URLs for covers even if you fix the doubling — see "Photos on the CDN" below.

- **Attribute quotations or don't set them as quotations.** If a `>` block is Luis's
  own paraphrase, make it prose. If it's someone's words, add
  `> <cite>Name</cite>` — see `.markdown-body blockquote cite`. Never invent a
  source; if you can't find one, say so.

Flag but don't change: prose, structure, pacing, and anything with a voice. Luis
writes and commits his own words.

## Publishing: one at a time

Editing a batch of posts should not publish a batch of posts. Unfinished work lives in
`_drafts/`, with **no date prefix on the filename and no `date:` in the front matter**:

```
_drafts/alley-light.md          →  git mv to _posts/2026-09-14-alley-light.md
```

Preview with `bundle exec jekyll serve --drafts`. Drafts never build in production, so
they can sit committed indefinitely — pushing a draft is safe, and the date is decided
at the moment you move it, not when you wrote it.

Because `permalink: /posts/:title` takes the slug from the filename **minus** the date
prefix, `_drafts/alley-light.md` and `_posts/2026-09-14-alley-light.md` both serve
`/posts/alley-light`. Restaggering dates never breaks a URL; renaming a file does.

Two other ways to hold a post back, and why they're worse:

- **`published: false`** hides it from `jekyll serve` too, so you can't look at it.
- **A future `date:`** excludes it from the build (`future` defaults to false), but
  GitHub Pages only builds on push — nothing rebuilds when the date arrives. That's
  not scheduling, it's a post that appears at some unrelated future push.

Posts sharing a date with no time all land at 00:00 and break ties
**reverse-alphabetically by filename**. Add a time (`date: 2026-09-14 09:15:00 -0600`)
if index order matters. There's no `timezone:` set, so it's local on your laptop and
UTC on GitHub Pages.

### Never push a post ahead of what it depends on

`bundle exec jekyll build` before pushing, always. A post that references an include or
a script that isn't committed yet doesn't just render badly — **Jekyll aborts the entire
build**, and GitHub Pages keeps serving the last good deploy while every new post
silently fails to appear:

```
Liquid Exception: Could not locate the included file 'photo.html' ...
```

This has already happened once: `_posts/2026-09-03-cottonwood.md` was pushed while
`_includes/photo.html` was still untracked. A post and the machinery it calls belong in
the same commit.

### CSS changes take up to 4 hours to reach anyone

`antfarm.systems` sits behind Cloudflare, which caches `stylesheets/style.css` with
`cache-control: max-age=14400`. A pushed CSS change is live at the origin but **not**
what visitors get:

```sh
curl -sI https://antfarm.systems/stylesheets/style.css | grep -iE 'cf-cache-status|age'
curl -s  https://antfarm-systems.github.io/stylesheets/style.css | grep <your-new-rule>
```

The second URL is GitHub Pages direct and bypasses Cloudflare — use it to tell "the
build hasn't finished" apart from "the edge is serving a stale copy." A hard reload
fixes your own browser but not anyone else's; that needs a Cloudflare cache purge.
So don't diagnose a layout bug from the live site right after a CSS push — you are
probably looking at the previous stylesheet.

## Photos on the CDN

Small site furniture (covers, icons, anything in a link card or the feed) lives in
`/images/` and is committed here. Photographs Luis took go to a CloudFront distribution
instead, so this repo doesn't accumulate megabytes of JPEG. Only his own work goes
there — the pipeline stamps his copyright on everything it touches, so it is the wrong
tool for someone else's picture.

Originals waiting to be published — straight off the X100F, say — sit in
`~/src/tmp-photos-for-uploads/`. That's a staging area outside any repo; nothing there
is backed up by git.

`bin/prepare-photo` does the whole job: resize, strip, upload, and print the front
matter to paste into the post.

```sh
bin/prepare-photo <album-slug> ~/src/tmp-photos-for-uploads/whatever.jpg --upload
```

Leave `--upload` off for a dry run; derivatives land in `tmp/` (gitignored) for you to
look at first. Two other flags, both used by the Inktober days:

- `--thumb` also writes `<base>-thumb.jpg` (480px, square-cropped) and adds `thumb:` to
  the block. For pages showing many photos at once — a grid of 31 full-size JPEGs is
  twenty-odd megabytes.
- `--no-exif` drops the camera data from **both** places: the printed block gets
  `exif: false` and no camera keys, and nothing is copied into the published JPEG
  either, which keeps only the copyright. So `exif: true` on its own can't bring the
  line back — there's nothing left to read. Re-run without the flag against the
  original in `~/src/tmp-photos-for-uploads/`.
- `--as <name>` names the published file instead of inheriting the camera's. One file
  at a time. Worth using: the CDN path goes into front matter and is cached
  `immutable` for a year, so `day-01-apple.jpg` beats `dsc_0421.jpg` permanently.

Then put the block it prints in the post's front matter and call the
include where the photo should sit in the body:

```liquid
{% include photo.html %}
```

```yaml
photo:
  src: "https://dlt23dunpqfwk.cloudfront.net/antfarm/alley-light/img_0455.jpg"
  alt: "A narrow alley, the far end blown out to white by direct sun"
  width: 1621
  height: 1080
  exif: true                 # false or absent prints the photo bare
  camera: "Fujifilm X100F"
  lens: "23mm"
  settings: "f/8 &middot; 1/60 &middot; ISO 1600 &middot; +1⅓ EV"
  taken: 2017-09-03
  # caption: "optional line of prose above the metadata"
  # credit: false            # suppress the copyright, or a string to override it
```

`exif: true` renders the camera line and `© Luis E. Cerezo` under the photo.
The name comes from `photo_credit` in `_config.yml`. **Always write real `alt` text** —
the script leaves a shouty placeholder there on purpose.

Worth knowing before you set `exif: false`: the credit is nested inside the same
`{% if p.exif %}` as the camera data, so turning EXIF off drops `© Luis E. Cerezo`
along with it and the photo renders with no `<figcaption>` at all. That's the
intended behaviour for the Inktober drawings — the copyright is still written into
the JPEG itself — but it's a surprise if you only meant to hide the camera line.

### What the pipeline does to the metadata

This is the one place antfarm deliberately differs from the luiscerezo.org gallery,
which strips metadata down to nothing. Here the EXIF is the point: the post says
"f/8, ISO 1600, +1⅓ EV" and the reader can see what that bought.

- **Kept:** make, model, lens, focal length, aperture, shutter, ISO, exposure
  compensation, metering, flash, white balance, capture date.
- **Dropped:** GPS of any kind, body and lens serial numbers, owner name, the software
  that touched the file, maker notes, all XMP and IPTC, embedded thumbnails.
- **Added:** copyright and artist.

The whitelist is enforced by construction — ImageMagick writes a file with no metadata
at all, then exiftool copies back only the named tags — so a tag nobody thought about
is dropped rather than leaked. The script then re-reads the output and **refuses to
upload** if a serial number or GPS tag somehow survived. If it ever does refuse, that
is a real finding; don't work around it.

Two traps in that code, both already stepped in:

- Orientation and ColorSpace are assigned with exiftool's `#` suffix
  (`-EXIF:Orientation#=1`). Without it, `Orientation=1` gets reverse-matched against
  the human-readable table and writes **3 — "Rotate 180"** — which browsers honour,
  publishing the photo upside down.
- The original's Orientation is *not* copied forward, because `-auto-orient` has
  already rotated the pixels. Carrying it over rotates the photo a second time.

### The Referer guard

Verify a URL with a Referer, not a bare request:

```sh
curl -sI -H "Referer: https://antfarm.systems/" <url> | head -1   # expect 200
```

**A bare `curl <url>` returns 403 by design — that is not a failed upload.** A
CloudFront viewer-request function rejects anything without an allowlisted
`Origin`/`Referer`, which is also why:

- **CDN URLs can't be `image:` covers.** Slack, Discord, and Twitter card crawlers send
  no Referer and get a 403, so the card renders blank. A photo post either falls back
  to `/images/ant.png` or needs a committed copy in `/images/covers/`.
- **CDN images break in RSS readers.** `feed.xml` ships the full `post.content`, and
  feed readers fetch images with no Referer. Broken-image icon in NetNewsWire/Feedly.
  Acceptable for a big in-post photo; not for anything load-bearing.
- **`X-Robots-Tag: noindex, noimageindex`** is set on every response, so these photos
  never appear in Google Images. Intentional.

The distribution itself is Terraform in `../luiscerezo.org-infra/photo-gallery/`;
`tofu output cdn_domain` is the source of truth for the hostname.

Replaced a file at a path that already shipped? Objects are cached
`max-age=31536000, immutable`, so invalidate:

```sh
cd ../luiscerezo.org-infra/photo-gallery
AWS_PROFILE=personal-lec aws cloudfront create-invalidation \
  --distribution-id $(tofu output -raw distribution_id) --paths '/antfarm/<album-slug>/*'
```

`https://antfarm.systems`, `https://www.antfarm.systems`, and `http://localhost:4000`
are already on the allowlist. Serving the site on a different port means 403s on every
photo; adding another host means editing `site_origins` in the infra module and
re-applying.

## Inktober lives in a collection, not in `_posts`

Luis is learning to draw. Every October he inks the day's
[Inktober](https://inktober.com/) prompt, photographs the page, and it goes up at
`/inktober/`. Thirty-one days of that would bury the writing, so **the days are a
Jekyll collection and not posts**:

```yaml
collections:
  inktober:
    output: true
    permalink: /inktober/:path     # _inktober/2026/04-cactus.md -> /inktober/2026/04-cactus
```

That one decision is doing all the work. `site.posts` never contains them, so
`index.html`, `feed.xml`, `best-of.html`, `collections.html` and the prev/next arrows
skip them **without a filter to maintain** — the next surface that loops over
`site.posts` gets the same behaviour for free. There's deliberately no Inktober feed.

`:path` is the file's path inside `_inktober/`, so the year directory lands in the URL.
Keep the year directories: 2027 will reuse prompt words, and a flat `_inktober/` would
force a rename, which is the one thing that breaks a URL for good.

Jekyll's `previous`/`next` work *within* a collection, so the arrows walk Day 4 → Day 5
and never wander into an essay. A scoped default in `_config.yml` gives every day
`layout: inktober` and `author: luis`.

### Publishing a day

```sh
bin/inktober-day 4 ~/src/tmp-photos-for-uploads/dscf1234.jpg --upload
```

It looks the prompt up in `_data/inktober.yml`, runs the photo through
`bin/prepare-photo` (album slug `inktober-<year>`) and writes
`_inktober/2026/04-cactus.md` with the front matter filled in. Leave `--upload` off for
a dry run. Three things are stubs on purpose and want a human: the photo's `alt:`, the
`excerpt:`, and the notes.

`_layouts/inktober.html` prints the day/prompt line and calls `photo.html`, so a day
file's body is *only* the notes — don't paste `{% include photo.html %}` into it or the
drawing renders twice.

- **Day N is dated October N**, so the grid and the arrows stay in calendar order however
  far behind he is. The script warns when that date is still in the future, because
  **Jekyll skips future-dated documents** — collections get the same `future: false`
  treatment posts do. Drawing ahead and pushing does nothing until the date passes, and
  nothing rebuilds when it arrives. Publish the day you draw.
- **A future-dated day is still in `site.inktober`.** Jekyll keeps it in the collection
  and only declines to *write* its page, so a naive grid renders a live tile pointing at
  a 404. `inktober.html` therefore gates every tile — and the `N of 31 inked` count — on
  `doc.date <= site.time`, unless `site.future` is on. If you add another surface that
  lists days, it needs the same gate. Verify by building both ways: without `--future`
  the count and the links must match what actually landed in `_site/`.
- **The days carry `exif: false`**, so a drawing renders bare: no camera line, and no
  visible `©` either (see the note in the photo section — they share one `if`). These
  are phone snapshots of ink on paper; "f/1.7 · ISO 711" describes nothing anyone
  wants to know about a drawing. `bin/inktober-day` passes `--no-exif`, so the
  published JPEG keeps only the copyright — no make, model or exposure at all.
- **Published filenames are `day-NN-prompt.jpg`**, via `--as`, because a phone's
  `DSC_0421` in a URL cached `immutable` for a year is a permanent shrug. Zero-padded
  so `aws s3 ls` sorts the album in calendar order and it lines up with the post
  filename (`01-apple.md`).
- **`_data/inktober.yml` is the prompt list**, one entry per year, newest first. `/inktober/`
  walks it, so every day has a cell from October 1st and the grid fills in as files
  appear. Nothing to edit there as days get drawn. Don't reword the prompts — they're
  Inktober's list, and the point is everyone got the same word. `list_url:` is where
  that year's list was announced, rendered as a **link and not an Instagram embed** —
  the embed loads `instagram.com/embed.js` and sets cookies on page load, same objection
  as YouTube embeds needing the nocookie host.

### Two things that bite here specifically

- **The grid needs thumbnails.** `bin/prepare-photo --thumb` writes a second
  `<base>-thumb.jpg` (480px, square-cropped) and adds `thumb:` to the front matter
  block. Without it the index loads 31 × 2048px JPEGs — twenty-odd megabytes. The
  grid falls back to `photo.src` if `thumb` is absent, so a missing thumbnail is slow,
  not broken.
- **`inktober.html` is styled with tachyons classes and inline `style`, on purpose.**
  It wants no rule in `stylesheets/style.css`, because Cloudflare caches that file for
  four hours — a tweak there is invisible to everyone but you for most of a day. Keep
  new grid styling inline.

Social cards fall back to `/images/ant.png`: a CDN photo can't be an `image:` cover
(the Referer guard 403s every crawler). Drop a committed
`/images/covers/inktober-<year>.jpg` in and `bin/inktober-day` picks it up for the whole
year automatically.

## Email: this domain doesn't send any

As of September 2026, `antfarm.systems` is locked down to receive-only. Nothing here
sends mail, and the DNS says so in the strongest terms available:

```
antfarm.systems         v=spf1 include:_spf.mx.cloudflare.net -all
_dmarc.antfarm.systems  v=DMARC1; p=reject; sp=reject; np=reject; rua=mailto:luis.cerezo@gmail.com
```

Inbound still works — Cloudflare Email Routing forwards to Gmail, and the MX records
are untouched. `-all` and `p=reject` only govern mail *claiming to come from* the
domain.

Why it's set this way: Cloudflare Email Routing is forward-only and can't send as the
domain, so there was no legitimate sender to protect. Meanwhile DMARC reports showed
botnets forging `From: antfarm.systems` on spam, and the old `p=none` policy explicitly
told receivers not to act on it. Now they reject it.

**If you ever need to send email as this domain** — a newsletter, a contact form, a
Gmail "send mail as" alias, a transactional service — the current records will cause it
to be **rejected outright and silently**, with the bounce going to the sender rather
than to Luis. So don't just wire up a sender and hope:

1. Add the sender to SPF (`include:` for the provider) and set up DKIM for it.
2. Drop DMARC back to `p=quarantine` while you watch the aggregate reports.
3. Only return to `p=reject` once the new sender is passing.

Fast rollback if something breaks and you need mail flowing now: `~all` on SPF and
`p=none` on DMARC. That's the old permissive state — it un-blocks legitimate mail and
the spoofers along with it, so treat it as temporary.

Records live in Cloudflare DNS, not in this repo. Google mails the aggregate reports to
luis.cerezo@gmail.com as daily zips.

## Things worth knowing

- `rating: "4.5"` on a post draws a 0–5 rating in ants (`_includes/rating.html`).
  Optional; used on book reviews.
- `bin/book-review` turns a note from Luis's Obsidian books vault into a post
  skeleton, cover and all.
- `---` in a post body is a full-bleed dotted rule that runs wider than the text
  column. It clears floats, so it won't cut through a floated book cover.
- `_data/authors.yml` holds bylines. `_config.yml` defaults posts to `antfarm`;
  `author: luis` is for the ones he wrote.
- `TODO.md` is gitignored working notes. `_posts/2025-11-24-aws-pricing-game.md` is
  untracked on purpose — leave it alone.
- Staged changes are often Luis's prose in progress. Always `git add` with an
  explicit pathspec so his work doesn't ride along in an agent commit.
