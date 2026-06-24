Migration helper: export data from Supabase to local Postgres

Usage

1. Install dependencies:

```bash
npm install
npm install @supabase/supabase-js pg dotenv
```

2. Create a `.env` file with:

```
NEXT_PUBLIC_SUPABASE_URL=https://gabahsccughvaujlzbke.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhYmFoc2NjdWdodmF1amx6YmtlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3ODYyMzksImV4cCI6MjA5NzM2MjIzOX0.LUg5aXfERhESnna_UpiC0oU1VB1mqWMkbKCMRZOQfGM
DATABASE_URL=postgres://user:pass@localhost:5432/yourdb
```

3. Ensure local Postgres has the same tables (use your migrations or SQL dumps).

4. Run migration:

```bash
npm run migrate:supabase-to-local
```

Notes
- The script uses `ON CONFLICT DO NOTHING` for inserts, so it won't overwrite existing rows.
- Adjust `tables` array in `scripts/export_supabase_to_local.js` to match your schema.
- For large tables consider batching and upserts.
