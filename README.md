# All For Ummah Website

Landing page for All For Ummah, built with Svelte + Vite..

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Production build

```bash
npm run build
npm run preview
```

Output goes to `dist/`.

## Deploy to Cloudflare Pages

### Option A — Git (recommended)

1. Push this repo to GitHub/GitLab.
2. In [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create** → **Pages** → **Import repository**.
3. Use these settings:

| Setting | Value |
|---|---|
| Framework preset | Vite |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Deploy command | `npx wrangler pages deploy dist` |
| Environment variable | `NODE_VERSION=22` |

Important:
- Use **`wrangler pages deploy`**, not `wrangler deploy`
- Set **`NODE_VERSION=22`** (Wrangler needs Node 22+)

If Cloudflare still fails auth on the deploy step, try this as Deploy command instead (no-op, Pages already has `dist`):

```bash
true
```

4. Deploy. Cloudflare will rebuild on every push to your production branch.

### Option B — CLI

Requires Node.js 22+.

```bash
npm install
npx wrangler login
npm run deploy
```

This builds the site and uploads `dist/` to Cloudflare Pages.

## Notes

- Background video and images are loaded from Cloudflare R2.
- Social links and YouTube embeds are configured in `src/App.svelte` / `src/lib/SocialLinks.svelte`.
