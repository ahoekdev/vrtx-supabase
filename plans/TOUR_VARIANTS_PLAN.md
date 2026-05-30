# Tour Variants Plan

## Target Model

- `tour`
  - `id`
  - `name`
  - `slug`
  - shared public concept and landing page

- `tour_variants`
  - `id`
  - `tour_id`
  - `label`
  - `slug`
  - `is_primary`
  - optional `created_at`
  - one row per concrete route variant

- `tour_variant_stages`
  - `id`
  - `tour_variant_id`
  - `stage_id`
  - `order`
  - ordered stage membership for that variant

## Constraints

- `tour_variants`
  - unique `(tour_id, slug)`
  - partial unique index on `(tour_id)` where `is_primary = true`
  - foreign key to `tour` with delete restricted

- `tour_variant_stages`
  - unique `(tour_variant_id, order)`
  - foreign key to `tour_variants` with `on delete cascade`
  - foreign key to `stages` with delete restricted unless stage deletion should cascade too

## Migration Shape

1. Create `tour_variants`.
2. Backfill one variant per existing `tour`.
3. Set the backfilled variant as primary.
4. Derive its slug from the existing tour slug or a default label like `default`.
5. Rename `tour_stages` to `tour_variant_stages`.
6. Add `tour_variant_id`.
7. Backfill `tour_variant_id` from the old `tour_id`.
8. Drop or deprecate `tour_id`.
9. Add the uniqueness and primary constraints.
10. Update the app to read from the new tables.
11. Update write paths for create, promote/demote primary, and stage reordering.

## Backfill Strategy

- Existing tours become:
  - one `tour`
  - one `tour_variant`
  - one set of `tour_variant_stages`
- That preserves all current data and keeps the app functional during the migration.

## Runtime Behavior

- The parent `tour` page resolves to the primary variant.
- The parent `tour` page also lists alternate variants as links.
- Variant pages live at `/tours/:tourSlug/:variantSlug`.
- The first variant created for a tour becomes primary automatically.
- Variant stage order starts at `1` and should be kept contiguous by the write path.

