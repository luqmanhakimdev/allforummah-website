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

### Option A — GitHub Actions (recommended)

Build runs on GitHub runners, then uploads `dist/` to Cloudflare Pages.

1. Create a Cloudflare API token: [API Tokens](https://dash.cloudflare.com/profile/api-tokens) → **Create Token**
   - Use **Edit Cloudflare Workers**, or custom permissions with **Account → Cloudflare Pages → Edit**
2. In GitHub repo → **Settings** → **Secrets and variables** → **Actions**, add:

| Secret | Value |
|---|---|
| `CLOUDFLARE_API_TOKEN` | Your API token |
| `CLOUDFLARE_ACCOUNT_ID` | From Cloudflare dashboard URL / Workers & Pages overview |

3. Push to `main` (or run the workflow manually under **Actions**).

Workflow file: `.github/workflows/deploy.yml`

If you previously connected the repo to Cloudflare’s own Pages Git build, **disable automatic builds** there so you don’t get double deploys.

### Option B — Cloudflare Git build

1. In [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Pages** → import the repo.
2. Settings:

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Build output directory | `dist` |
| Deploy command | `true` |
| Env var | `NODE_VERSION=22` |

### Option C — CLI

Requires Node.js 22+.

```bash
npm install
npx wrangler login
npm run deploy
```

## Notes

- Background video and images are loaded from Cloudflare R2.
- Social links and YouTube embeds are configured in `src/App.svelte` / `src/lib/SocialLinks.svelte`.
