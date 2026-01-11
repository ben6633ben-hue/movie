# Movie Site

A Next.js movie streaming site with Supabase backend..

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

**For Frontend (Next.js):**

```bash
cp .env.local.example .env.local
```

Then edit `.env.local` and add your Supabase keys.

**For Backend (Python Scraper):**

```bash
cp .env.example .env
```

Then edit `.env` and add your Supabase keys.

See [ENV_SETUP.md](./ENV_SETUP.md) for detailed instructions.

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🔒 Security

- **Service role key is NEVER committed to Git** ✅
- **Service role key is ONLY used in backend scripts** ✅
- **Frontend uses anon key with RLS protection** ✅

See [ENV_SETUP.md](./ENV_SETUP.md) and [SUPABASE_SECURITY.md](./SUPABASE_SECURITY.md) for security details.

## 📚 Documentation

- [ENV_SETUP.md](./ENV_SETUP.md) - Environment variables setup
- [SUPABASE_SECURITY.md](./SUPABASE_SECURITY.md) - Security configuration
- [supabase_rls_policies.sql](./supabase_rls_policies.sql) - RLS policies SQL

## 🚀 Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

**Important:** Set environment variables in Vercel dashboard:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Do NOT** set `SUPABASE_SERVICE_ROLE_KEY` in Vercel unless you need it for serverless functions.
