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

## Deploy to Cloudflare

### Option A — GitHub Actions (recommended)

Build runs on GitHub runners, then uploads to Cloudflare Workers (static assets).

1. Create an **Account-scoped** Cloudflare API token:
   [API Tokens](https://dash.cloudflare.com/profile/api-tokens) → **Create Token** → **Create Custom Token**:

| Permission | Access |
|---|---|
| Account → Workers Scripts | Edit |
| Account → Account Settings | Read |

Under **Account Resources**, select your account only.  
Do **not** rely on User → Memberships → Read (Account-scoped tokens cannot have it).

2. Put your Cloudflare Account ID in `wrangler.toml` (Dashboard → Workers & Pages → Account ID):

```toml
account_id = "your-cloudflare-account-id"
```

This skips Wrangler’s `/memberships` auto-discovery.

3. In GitHub → **Settings** → **Secrets and variables** → **Actions**:

| Secret | Value |
|---|---|
| `CLOUDFLARE_API_TOKEN` | Your Account-scoped token |
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare Account ID (optional backup; also in wrangler.toml) |

4. Push to `main` (or run the workflow manually under **Actions**).

Workflow file: `.github/workflows/deploy.yml`

First deploy creates the Worker named `allforummah-website` automatically. You’ll get a `*.workers.dev` URL (and can attach a custom domain later).

If you previously connected Cloudflare Pages Git builds for this repo, disable them to avoid conflicts.

### Option B — CLI

Requires Node.js 22+.

```bash
npm install
npx wrangler login
npm run deploy
```

### Option C — Cloudflare Pages (dashboard Git build)

Only if you prefer classic Pages. Create the Pages project first in the dashboard, then:

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Build output directory | `dist` |
| Deploy command | `true` |
| Env var | `NODE_VERSION=22` |
## Notes

- Background video and images are loaded from Cloudflare R2.
- Social links and YouTube embeds are configured in `src/App.svelte` / `src/lib/SocialLinks.svelte`.
