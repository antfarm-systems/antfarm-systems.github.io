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
  through `absolute_url`, so an absolute URL comes out doubled.

- **Attribute quotations or don't set them as quotations.** If a `>` block is Luis's
  own paraphrase, make it prose. If it's someone's words, add
  `> <cite>Name</cite>` — see `.markdown-body blockquote cite`. Never invent a
  source; if you can't find one, say so.

Flag but don't change: prose, structure, pacing, and anything with a voice. Luis
writes and commits his own words.

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
