# Off Meta Gaming — website

Multipage site with the random skin-pull system. Pages live under `staging/` until launch;
the repo-root `index.html` / `404.html` are a launch-lock placeholder that the **Deploy button
in `admin.html`** promotes over when the shop is ready to go live.

## Structure

```
staging/
  index.html    Home — hero, "What we play", singles & want-list, links out
  events.html   Game nights (config-driven event cards)
  visit.html    Hours, address, directions, socials
  photos.html   Photo gallery + lightbox
assets/
  omg.css       every shared style, including all 12 skin worlds
  skin-roll.js  rolls the skin BEFORE first paint (loaded synchronously in <head>)
  omg-app.js    pull-toast, collection/pity, and the config.json-driven facts
config.json     owner-editable facts (hours, events, photos, socials, announcement)
index.html      launch-lock placeholder (root) — replaced at deploy
404.html        launch-lock placeholder (root) — replaced at deploy
```

Every page shares the same `<head>` assets, top nav, footer, skins engine, and pull-toast.
Inter-page links are relative and assets are referenced absolutely (`/assets/...`), so the pages
work both under `/staging/` (pre-launch) and at the site root (after deploy).

## The skins system

Every visit rolls a random site skin before first paint (gacha, Common → a 1-in-2,000 one-of-one,
with a 6-pull pity rule). The rolled skin is **one pull per visit**: it is saved in `sessionStorage`
and carried as the visitor moves between pages, so navigation doesn't re-roll. "Pull again" rerolls
(and carries the new skin forward); "Pin this skin" persists it across visits via `localStorage`;
`?skin=<id>` forces one for shareable links. No-JS falls back to the coherent `classic` skin.

## Owner edits (admin.html)

`admin.html` (password + GitHub publish key) edits `config.json` and can add/remove photos. When a
new site version is staged, its **Deploy** step promotes **every** `staging/*.html` page to the site
root in one commit (with `404.html` mirroring the home page) — so launching the multipage site is
still one click.

## Deploy (GitHub Pages, free)

Hosted at `offmetagaming.net` via GitHub Pages from `main` / root. `.nojekyll` stops Jekyll.
To go live, use the Deploy button in `admin.html` (or copy `staging/*.html` to the repo root and
set `404.html` to the home page, in one commit).
