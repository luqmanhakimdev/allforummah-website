# All For Ummah Website

Official landing site for **All For Ummah** — a Malaysian nasyid group.

Built with **Svelte 5** + **Vite**, deployed as a Cloudflare Worker with static assets, plus a small **CMS** (Workers + D1 + R2).

## Features

- Full-bleed hero with background video, brand, countdown, and social links
- Tentang kami with photo gallery
- SoundCloud track embed (Satu)
- YouTube video and Festival Nasyid playlist sections
- **Berita** section powered by the CMS API
- Facebook CTA section
- Sticky header with live countdown on scroll
- Admin UI at `/admin/`

## Requirements

- Node.js 22+
- Cloudflare account (Workers, D1, R2)

## Local development (frontend only)

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).  
Note: `/api/*` and Berita need the Worker (below).

## Local development (site + CMS)

```bash
cp .dev.vars.example .dev.vars
# edit CMS_ADMIN_TOKEN in .dev.vars

npm run db:migrate:local
npm run dev:worker
```

Then open the Wrangler URL (usually `http://127.0.0.1:8787`), and admin at `/admin/`.

## Build

```bash
npm run build
npm run preview
```

Production files are written to `dist/` (includes `/admin/`).

## CMS setup (one-time on Cloudflare)

1. Create resources (requires `wrangler login` or API token + account id):

```bash
npx wrangler d1 create allforummah-cms
npx wrangler r2 bucket create allforummah-cms-media
```

2. Put the returned **database_id** into [`wrangler.toml`](wrangler.toml) under `[[d1_databases]]`.

3. Set Worker secrets:

```bash
npx wrangler secret put CMS_ADMIN_TOKEN
# optional public R2 base, e.g. https://pub-xxxx.r2.dev
npx wrangler secret put R2_PUBLIC_BASE_URL
```

4. Apply migrations and deploy:

```bash
npm run db:migrate:remote
npm run deploy
```

5. **Protect `/admin`** with [Cloudflare Access](https://developers.cloudflare.com/cloudflare-one/applications/configure-apps/self-hosted-public-app/):  
   Zero Trust → Access → Applications → Self-hosted → path `/admin*`.  
   API writes also require the `CMS_ADMIN_TOKEN` bearer token (entered in the admin UI).

### GitHub Actions secrets

| Secret | Value |
|---|---|
| `CLOUDFLARE_API_TOKEN` | Account-scoped token (Workers Scripts Edit, Account Settings Read; also D1 + R2 edit) |
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare Account ID |
| `CMS_ADMIN_TOKEN` | Long random admin token |
| `R2_PUBLIC_BASE_URL` | Optional public R2 base URL |

Token permissions should also allow **D1 Edit** and **Workers R2 Storage Edit** for migrations/uploads.

## Deploy

### GitHub Actions (recommended)

Push to `main` (or run the workflow under **Actions**).  
Workflow: [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) — builds, migrates D1, deploys, syncs CMS secrets.

### CLI

```bash
npm install
npx wrangler login
CLOUDFLARE_ACCOUNT_ID=your-cloudflare-account-id npm run deploy
```

## Project structure

| Path | Purpose |
|---|---|
| `src/App.svelte` | Public page sections |
| `src/app.css` | Site styles |
| `src/lib/SocialLinks.svelte` | Social links |
| `worker/index.js` | CMS API (`/api/*`) |
| `migrations/` | D1 SQL migrations |
| `public/admin/` | CMS admin UI |
| `wrangler.toml` | Worker, assets, D1, R2 |

## API (summary)

| Method | Path | Auth |
|---|---|---|
| `GET` | `/api/posts` | Public (published only) |
| `GET` | `/api/posts?all=1` | Bearer admin (includes drafts) |
| `GET` | `/api/posts/:idOrSlug` | Public if published |
| `POST` | `/api/posts` | Bearer admin |
| `PUT` | `/api/posts/:idOrSlug` | Bearer admin |
| `DELETE` | `/api/posts/:idOrSlug` | Bearer admin |
| `POST` | `/api/upload` | Bearer admin (multipart `file`) |

## Content notes

- Hero video, about gallery, and other media load from Cloudflare R2
- Social URLs live in `src/lib/SocialLinks.svelte`
- YouTube / SoundCloud embeds live in `src/App.svelte`
- Berita posts are managed at `/admin/`
