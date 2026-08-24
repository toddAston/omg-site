# Off Meta Gaming — website

Single-file site (`index.html`) with the random skin-pull system. `404.html` is a copy so
deep links still land somewhere useful. `.nojekyll` stops GitHub Pages from running Jekyll.

## Deploy (GitHub Pages, free)

1. Create an empty GitHub repo (e.g. `omg-site`), then from this folder:
   git remote add origin git@github.com:<YOU>/omg-site.git
   git push -u origin main
2. Repo → Settings → Pages → Source: "Deploy from a branch" → `main` / root.
3. Buy the domain (Porkbun or Cloudflare Registrar are at-cost). Then in Settings → Pages
   set the custom domain (this creates the CNAME file), and check "Enforce HTTPS" once the
   cert issues (~15 min).
4. At the registrar, add DNS records:
   - A     @    185.199.108.153
   - A     @    185.199.109.153
   - A     @    185.199.110.153
   - A     @    185.199.111.153
   - CNAME www  <YOU>.github.io
