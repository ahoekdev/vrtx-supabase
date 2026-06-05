---
name: panda-css
description: Use when working on Panda CSS setup, theming, tokens, recipes, slot recipes, or docs in this repo.
---

# Panda CSS

Use this skill when a task involves Panda CSS setup, theming, tokens, recipes, slot recipes, or generated styles.

## Workflow

1. Prefer the official Panda docs for the exact API and current patterns.
2. If the repo has local Panda guidance, follow it before inventing a new structure.
3. Keep changes incremental: wire the base system first, then shared layouts, then shared components, then pages, then islands.
4. Prefer tokens, recipes, and shared primitives over ad hoc CSS.
5. Leave custom CSS only where Panda does not model the case cleanly.
6. Verify with the repo’s normal typecheck and build commands.

## Documentation sources

- `https://panda-css.com/llms.txt`
- `https://panda-css.com/llms-full.txt`
- Individual Panda docs pages via `.mdx` URLs when you need a focused topic

## When to read more

- Tokens, conditions, or theming: read the Panda theming docs.
- Recipes or slot recipes: read the relevant recipe docs.
- If the repo has a local style guide or implementation notes, read them first.
