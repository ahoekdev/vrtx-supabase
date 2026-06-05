# Repository Instructions

This repo is an Astro app with React islands, Supabase auth/data access, and Panda CSS.

Work rules:

- Prefer the repo's existing patterns before introducing new abstractions.
- Keep styling changes aligned with the repo's Panda CSS conventions.
- Verify changes with `npm run check` and `npm run build` when relevant.
- Do not rewrite unrelated files or clean up user changes unless the task requires it.

Panda-specific work:

- Use the Panda skill and Panda's official docs as the source of truth.
- Follow the repo's Panda styling conventions when working on styling.

Supabase work:

- Use the existing `supabase/` migrations and generated types workflow.
- Keep auth, query, and schema changes consistent with the current generated types and local migrations.
