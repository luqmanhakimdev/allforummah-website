# All For Ummah Website

Official landing site for **All For Ummah** — a Malaysian nasyid group.

Built with **Svelte 5** + **Vite**, deployed as a Cloudflare Worker with static assets.

## Features

- Full-bleed hero with background video, brand, countdown, and social links
- Tentang kami with photo gallery
- SoundCloud track embed (Satu)
- YouTube video and Festival Nasyid playlist sections
- Facebook CTA section
- Sticky header with live countdown on scroll

## Requirements

- Node.js 22+

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Build

```bash
npm run build
npm run preview
```

Production files are written to `dist/`.

## Deploy

### GitHub Actions (recommended)

Pushes to `main` build and deploy via [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

1. Create an **Account-scoped** Cloudflare API token  
   [API Tokens](https://dash.cloudflare.com/profile/api-tokens) → **Create Token** → **Create Custom Token**:

   | Permission | Access |
   |---|---|
   | Account → Workers Scripts | Edit |
   | Account → Account Settings | Read |

   Limit **Account Resources** to your account only.

2. Set your Account ID in [`wrangler.toml`](wrangler.toml)  
   (Cloudflare Dashboard → Workers & Pages → copy **Account ID**):

   ```toml
   account_id = "your-cloudflare-account-id"
   ```

3. Add GitHub Actions secrets  
   **Settings → Secrets and variables → Actions**:

   | Secret | Value |
   |---|---|
   | `CLOUDFLARE_API_TOKEN` | The token from step 1 |
   | `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare Account ID |

4. Push to `main`, or run the workflow manually under **Actions**.

The Worker name is `allforummah-website`. First deploy creates it and a `*.workers.dev` URL. You can attach a custom domain later in the Cloudflare dashboard.

If this repo was previously connected to Cloudflare Pages Git builds, disable those to avoid conflicting deploys.

### CLI

```bash
npm install
npx wrangler login
npm run deploy
```

## Project structure

| Path | Purpose |
|---|---|
| `src/App.svelte` | Page sections, countdown, gallery, embeds |
| `src/app.css` | Site styles |
| `src/lib/SocialLinks.svelte` | Facebook, Instagram, TikTok, YouTube links |
| `public/` | Favicon and static public assets |
| `wrangler.toml` | Cloudflare Workers static assets config |

## Content notes

- Hero video, about gallery, and other media load from Cloudflare R2
- Social URLs live in `src/lib/SocialLinks.svelte`
- YouTube IDs, SoundCloud embed, and copy live in `src/App.svelte`
