# Supabase

Run locally

`supabase start`
`supabase stop`
`supabase db reset`

The app's local auth redirect URL is `http://localhost:4321`.

Local auth emails are captured by Mailpit at `http://localhost:54324` after `supabase start`.
That is the default local email tester; it does not send to a real mailbox.

Create migration:

`supabase db diff --use-migra -f <migration_name>`

Deploy to remote:

`supabase db push`

Generate types:

`npx supabase gen types typescript --local > database.types.ts`
