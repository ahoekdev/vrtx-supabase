import { createClient, type SupabaseContext } from "../supabase";

interface GetToursOptions {
  limit?: number;
}

interface GetTourVariantsOptions {
  tourIds?: string[];
}

interface GetTourVariantStagesOptions {
  variantIds?: string[];
}

export function getTours(
  context: SupabaseContext,
  options: GetToursOptions = {},
) {
  let query = createClient(context)
    .from("tour")
    .select("*")
    .order("name", { ascending: true });

  if (options.limit) {
    query = query.limit(options.limit);
  }

  return query;
}

export function getTourBySlug(
  context: SupabaseContext,
  slug: string,
) {
  return createClient(context)
    .from("tour")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
}

export function getTourVariants(
  context: SupabaseContext,
  options: GetTourVariantsOptions = {},
) {
  let query = createClient(context)
    .from("tour_variants")
    .select("id, tour_id, label, slug, is_primary")
    .order("tour_id", { ascending: true })
    .order("is_primary", { ascending: false })
    .order("label", { ascending: true });

  if (options.tourIds?.length) {
    query = query.in("tour_id", options.tourIds);
  }

  return query;
}

export function getTourVariantBySlug(
  context: SupabaseContext,
  tourId: string,
  slug: string,
) {
  return createClient(context)
    .from("tour_variants")
    .select("id, tour_id, label, slug, is_primary")
    .eq("tour_id", tourId)
    .eq("slug", slug)
    .maybeSingle();
}

export function getTourVariantStages(
  context: SupabaseContext,
  options: GetTourVariantStagesOptions = {},
) {
  let query = createClient(context)
    .from("tour_variant_stages")
    .select(
      `
      tour_variant_id,
      order,
      stage:stages(
        id,
        from:lodges!from_lodge_id(name, slug),
        to:lodges!to_lodge_id(name, slug)
      )
    `,
    )
    .order("tour_variant_id", { ascending: true })
    .order("order", { ascending: true });

  if (options.variantIds?.length) {
    query = query.in("tour_variant_id", options.variantIds);
  }

  return query;
}
