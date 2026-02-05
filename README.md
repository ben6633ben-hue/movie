# Movie Site

Next.js movie/series site with Supabase. Supports deployment to **Cloudflare Pages** (recommended) or any Node.js host (Vercel, etc.).

## Local development

```bash
npm install
npm run dev
```

Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local` (see `.env.example`).

## Cloudflare Pages deployment

The app is built for Cloudflare using [OpenNext Cloudflare](https://opennext.js.org/cloudflare).

### Build & deploy

1. **Environment variables (required before first build)**  
   In Cloudflare Pages go to your project → **Settings** → **Builds & deployments** → **Build configuration** → **Environment variables**. Add:
   - `NEXT_PUBLIC_SUPABASE_URL` (e.g. `https://xxx.supabase.co`)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`  
   Add them for **Production** (main branch) and **Preview** (other branches) as needed. Both are needed at **build time**. After adding or changing them, trigger a new deploy (retry or push a commit).

2. **Build configuration** (Cloudflare Pages dashboard)
   - **Build command:** `npm run build:cloudflare` (OpenNext runs `npm run build` internally for the Next.js step; the top-level command must be `build:cloudflare`.)
   - **Build output directory:** leave as default or use the value given after the first build (OpenNext may use `.open-next` or a custom folder; check build logs).
   - **Root directory:** (blank if repo root)

**Build time and “stuck” builds:** The OpenNext + Next.js build often takes **10–15+ minutes** and may show little output after “OpenNext — Building Next.js app” while compilation runs. Wait at least 15 minutes before assuming it’s stuck. Cloudflare Pages has a 20-minute build timeout. If the build runs out of memory, add in Build configuration → Environment variables: `NODE_OPTIONS` = `--max-old-space-size=4096` (or `8192`). The project already enables `experimental.webpackMemoryOptimizations` in `next.config` to reduce memory use.

3. **Deploy**
   - **From Git:** connect the repo; Cloudflare will run `npm run build:cloudflare` and deploy the output.
   - **Direct upload / CLI:** run locally:
     ```bash
     npm run build:cloudflare
     npm run deploy
     ```
     Or use `npx wrangler pages deploy` with the build output directory from the OpenNext build logs.

### Local preview (Cloudflare build)

```bash
npm run build:cloudflare
npm run preview
```

Runs the production build locally with Wrangler.

### Other hosts (Vercel, Node)

To use the standard Next.js build instead of OpenNext:

```bash
npm run build:next
npm start
```

Set the same env vars in your host’s dashboard.

## Rate limiting

Bot blocking and per-IP rate limiting run in `lib/requestGuard.ts`. On Cloudflare Workers/Pages, rate limits are **per isolate** (not global). For site-wide limits, use Cloudflare Rate Limiting in the dashboard or an external store.
