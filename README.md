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

1. **Environment variables**  
   In Cloudflare Pages → your project → Settings → Environment variables, add:
   - `NEXT_PUBLIC_SUPABASE_URL` (e.g. `https://xxx.supabase.co`)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`  
   Set them for **Production** (and Preview if you use previews). Both are needed at **build time**.

2. **Build configuration** (Cloudflare Pages dashboard)
   - **Build command:** `npm run build`
   - **Build output directory:** leave as default or use the value given after the first build (OpenNext may use `.open-next` or a custom folder; check build logs).
   - **Root directory:** (blank if repo root)

3. **Deploy**
   - **From Git:** connect the repo; Cloudflare will run `npm run build` and deploy the output.
   - **Direct upload / CLI:** run locally:
     ```bash
     npm run build
     npm run deploy
     ```
     Or use `npx wrangler pages deploy` with the build output directory from the OpenNext build logs.

### Local preview (Cloudflare build)

```bash
npm run build
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
