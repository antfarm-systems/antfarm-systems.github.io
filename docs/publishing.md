# Publishing, by hand

Two recipes: an Inktober day and a photo post. The short version only — the
reasons behind each step, and the traps, are in `CLAUDE.md`.

Both scripts have `--help`. Leave `--upload` off and they're a dry run: the
images land in `tmp/web-ready/` for you to look at, and nothing leaves the laptop.

## An Inktober day

```sh
# 1. Dry run. Look at the result in tmp/web-ready/inktober-2026/ — upright? cropped right?
bin/inktober-day 5 ~/Downloads/inktober-2026-day-5-smack.jpg

# 2. Upload the drawing and its thumbnail, and write _inktober/2026/05-smack.md
bin/inktober-day 5 ~/Downloads/inktober-2026-day-5-smack.jpg --upload
```

3. Open `_inktober/2026/05-smack.md` and replace the three stubs:
   - `alt:` — what's on the page, for anyone who can't see it
   - `excerpt:` — one line; it's the Google snippet and the link card
   - the `#### What I learned` notes (or delete the heading)

   Don't add `{% include photo.html %}` — the layout already draws the photo.

4. Check, build, ship:

```sh
grep -nE 'WRITE|DESCRIBE' _inktober/2026/05-smack.md   # should print nothing
bundle exec jekyll build                               # must finish with "done"
git add -- _inktober/2026/05-smack.md
git commit -m "Inktober 2026, day 5: Smack"
git push
```

Publish the day you draw it. Day N is dated October N, and a day dated in the
future doesn't appear — not even when the date arrives, until something else
gets pushed.

## A photo post

```sh
# 1. Dry run. Pick the album slug and file name now — the CDN path is permanent.
bin/prepare-photo alley-light ~/src/tmp-photos-for-uploads/img_0455.jpg --as alley-light.jpg

# 2. Upload. It prints a photo: block for the front matter.
bin/prepare-photo alley-light ~/src/tmp-photos-for-uploads/img_0455.jpg --as alley-light.jpg --upload

# 3. Check it's there. A bare curl gets 403 on purpose; send a Referer.
curl -sI -H "Referer: https://antfarm.systems/" \
  https://dlt23dunpqfwk.cloudfront.net/antfarm/alley-light/alley-light.jpg | head -1   # 200
```

If the script refuses to upload because a serial number or GPS tag survived,
stop. That's a real problem, not something to work around.

4. Start it as a draft: `_drafts/alley-light.md`, **no date in the filename and
   no `date:`**.

```yaml
---
title: Alley light
author: luis
excerpt: One line. It's the Google snippet and the link card.
photo:
  # paste the block the script printed, and write real alt text
---
{% include photo.html %}

The words.
```

5. Preview with drafts on, at `http://localhost:4000/posts/alley-light`
   (that port exactly — anything else gets 403s on the photo):

```sh
bundle exec jekyll serve --drafts
```

A draft can be committed and pushed safely; it never builds on the live site.

6. When it's ready, give it today's date and ship:

```sh
mv _drafts/alley-light.md _posts/2026-10-04-alley-light.md   # git mv if the draft was committed
grep -nE 'WRITE|DESCRIBE' _posts/2026-10-04-alley-light.md   # should print nothing
bundle exec jekyll build                                     # must finish with "done"
git add -- _posts/2026-10-04-alley-light.md                  # include _drafts/alley-light.md too if it was committed
git commit -m "Photo: alley light"
git push
```

## Every time

- **Build before you push.** One broken post (say, calling an include that
  isn't committed) fails the whole site build, and GitHub Pages quietly keeps
  serving the old version.
- **`git add` the file by name**, not `git add .`, so nothing half-written comes along.
- The pre-commit hook bumps `_data/canary.yml`. That's expected.
- The page is live a minute or two after the push. Styles (`stylesheets/style.css`)
  can take up to four hours to reach other people because of Cloudflare.
