# Panda CSS Implementation Checklist

## 1. Set up Panda
- [ ] Add Panda dependencies in [`package.json`](/home/ahoek91/Code/projects/vrtx-supabase/package.json).
- [ ] Add Panda config files at the repo root, typically `panda.config.ts` plus any generated output folder Panda expects.
- [ ] Wire Panda’s generated CSS into [`src/layouts/SiteLayout.astro`](/home/ahoek91/Code/projects/vrtx-supabase/src/layouts/SiteLayout.astro) first so the site shell can consume the new base system.

## 2. Move base styles over
- [ ] Port the current reset from [`src/styles/reset.css`](/home/ahoek91/Code/projects/vrtx-supabase/src/styles/reset.css) into Panda base styles.
- [ ] Port layout primitives from [`src/styles/layout.css`](/home/ahoek91/Code/projects/vrtx-supabase/src/styles/layout.css), especially `page-container`.
- [ ] Port typography defaults from [`src/styles/typography.css`](/home/ahoek91/Code/projects/vrtx-supabase/src/styles/typography.css).
- [ ] Trim [`src/styles/global.css`](/home/ahoek91/Code/projects/vrtx-supabase/src/styles/global.css) down to only any unavoidable leftovers.

## 3. Update the shared layouts
- [ ] Convert [`src/layouts/SiteLayout.astro`](/home/ahoek91/Code/projects/vrtx-supabase/src/layouts/SiteLayout.astro) to use Panda base tokens and shared primitives.
- [ ] Convert [`src/layouts/AdminLayout.astro`](/home/ahoek91/Code/projects/vrtx-supabase/src/layouts/AdminLayout.astro) to the same system.
- [ ] Make sure both layouts use the same container, heading, and spacing rules.

## 4. Convert shared Astro components
- [ ] Update [`src/components/server/SiteHeader.astro`](/home/ahoek91/Code/projects/vrtx-supabase/src/components/server/SiteHeader.astro) first.
- [ ] Then update [`src/components/server/StageList.astro`](/home/ahoek91/Code/projects/vrtx-supabase/src/components/server/StageList.astro).
- [ ] Then update [`src/components/server/TourList.astro`](/home/ahoek91/Code/projects/vrtx-supabase/src/components/server/TourList.astro).
- [ ] Then update [`src/components/server/TourContent.astro`](/home/ahoek91/Code/projects/vrtx-supabase/src/components/server/TourContent.astro).
- [ ] Replace inline `<style>` blocks with Panda recipes/primitives where practical.

## 5. Convert Astro pages that depend on shared styling
- [ ] Update [`src/pages/index.astro`](/home/ahoek91/Code/projects/vrtx-supabase/src/pages/index.astro).
- [ ] Update [`src/pages/explore/index.astro`](/home/ahoek91/Code/projects/vrtx-supabase/src/pages/explore/index.astro).
- [ ] Update [`src/pages/lodges/index.astro`](/home/ahoek91/Code/projects/vrtx-supabase/src/pages/lodges/index.astro).
- [ ] Update [`src/pages/lodges/[slug].astro`](/home/ahoek91/Code/projects/vrtx-supabase/src/pages/lodges/[slug].astro).
- [ ] Update [`src/pages/stages/index.astro`](/home/ahoek91/Code/projects/vrtx-supabase/src/pages/stages/index.astro).
- [ ] Update [`src/pages/tours/index.astro`](/home/ahoek91/Code/projects/vrtx-supabase/src/pages/tours/index.astro).
- [ ] Update [`src/pages/tours/[slug]/index.astro`](/home/ahoek91/Code/projects/vrtx-supabase/src/pages/tours/[slug]/index.astro).
- [ ] Update [`src/pages/tours/[slug]/[variantSlug].astro`](/home/ahoek91/Code/projects/vrtx-supabase/src/pages/tours/[slug]/[variantSlug].astro).
- [ ] Keep the React login form untouched for now.

## 6. Clean up and verify
- [ ] Run typecheck and build.
- [ ] Review the main routes in the browser.
- [ ] Remove any CSS that Panda fully replaces.
- [ ] Keep only the smallest possible escape hatch for custom CSS.

## 7. Migrate the React island last
- [ ] Convert [`src/components/client/LoginForm.module.css`](/home/ahoek91/Code/projects/vrtx-supabase/src/components/client/LoginForm.module.css).
- [ ] Update [`src/components/client/LoginForm.tsx`](/home/ahoek91/Code/projects/vrtx-supabase/src/components/client/LoginForm.tsx) to use Panda styling instead of the CSS Module.
