# Supabase

Run locally

`supabase start`
`supabase stop`
`supabase db reset`

Create migration:

`supabase db diff --use-migra -f <migration_name>`

Deploy to remote:

`supabase db push`

Generate types:

`npx supabase gen types typescript --local > database.types.ts`
