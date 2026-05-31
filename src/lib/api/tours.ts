import { createClient, type SupabaseContext } from "../supabase";
import { type Tables } from "../database.types";

interface GetToursOptions {
  limit?: number;
}

interface GetTourVariantsOptions {
  tourIds?: string[];
}

interface GetTourVariantStagesOptions {
  variantIds?: string[];
}

interface GetTourListOptions {
  limit?: number;
}

type TourSummary = Pick<Tables<"tour">, "id" | "name" | "slug">;
type TourVariantSummary = Pick<
  Tables<"tour_variants">,
  "id" | "tour_id" | "label" | "slug" | "is_primary"
>;
type TourStageStats = {
  stageCount: number;
  distanceMeters: number;
};

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
    .select("id, tour_id, label, slug, is_primary, description")
    .order("tour_id", { ascending: true })
    .order("is_primary", { ascending: false })
    .order("label", { ascending: true });

  if (options.tourIds?.length) {
    query = query.in("tour_id", options.tourIds);
  }

  return query;
}

export async function getTourList(
  context: SupabaseContext,
  options: GetTourListOptions = {},
) {
  let toursQuery = createClient(context)
    .from("tour")
    .select("id, name, slug")
    .order("name", { ascending: true });

  if (options.limit) {
    toursQuery = toursQuery.limit(options.limit);
  }

  const { data: tours, error: toursError } = await toursQuery;

  if (toursError) {
    throw toursError;
  }

  const tourIds = (tours ?? []).map((tour) => tour.id);

  if (!tourIds.length) {
    return [];
  }

  const { data: variants, error: variantsError } = await createClient(context)
    .from("tour_variants")
    .select("id, tour_id, label, slug, is_primary")
    .in("tour_id", tourIds)
    .order("tour_id", { ascending: true })
    .order("is_primary", { ascending: false })
    .order("label", { ascending: true });

  if (variantsError) {
    throw variantsError;
  }

  const typedVariants = (variants ?? []) as TourVariantSummary[];
  const variantIds = typedVariants.map(({ id }) => id);

  const { data: variantStages, error: stagesError } = await createClient(
    context,
  )
    .from("tour_variant_stages")
    .select(
      `
      tour_variant_id,
      stage:stages!inner(
        distance
      )
    `,
    )
    .in("tour_variant_id", variantIds);

  if (stagesError) {
    throw stagesError;
  }

  type VariantStageStatsRow = {
    tour_variant_id: string;
    stage: {
      distance: number;
    } | null;
  };

  const statsByVariantId = new Map<string, TourStageStats>();

  for (const row of (variantStages ?? []) as VariantStageStatsRow[]) {
    if (!row.stage) {
      continue;
    }

    const current = statsByVariantId.get(row.tour_variant_id) ?? {
      stageCount: 0,
      distanceMeters: 0,
    };

    current.stageCount += 1;
    current.distanceMeters += row.stage.distance;

    statsByVariantId.set(row.tour_variant_id, current);
  }

  const variantsByTourId = new Map<string, TourVariantSummary[]>();

  for (const variant of typedVariants) {
    const existing = variantsByTourId.get(variant.tour_id) ?? [];
    existing.push(variant);
    variantsByTourId.set(variant.tour_id, existing);
  }

  return tours
    .map((tour) => {
      const tourVariants = variantsByTourId.get(tour.id) ?? [];
      const selectedVariant =
        tourVariants.find(({ is_primary }) => is_primary) ?? tourVariants[0];

      if (!selectedVariant) {
        return null;
      }

      const stats = statsByVariantId.get(selectedVariant.id) ?? {
        stageCount: 0,
        distanceMeters: 0,
      };

      return {
        tour,
        variant: selectedVariant,
        stageCount: stats.stageCount,
        distanceMeters: stats.distanceMeters,
      };
    })
    .filter(
      (
        entry,
      ): entry is {
        tour: TourSummary;
        variant: TourVariantSummary;
        stageCount: number;
        distanceMeters: number;
      } => entry !== null,
    );
}

export function getTourVariantBySlug(
  context: SupabaseContext,
  tourId: string,
  slug: string,
) {
  return createClient(context)
    .from("tour_variants")
    .select("id, tour_id, label, slug, is_primary, description")
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
        duration,
        distance,
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
