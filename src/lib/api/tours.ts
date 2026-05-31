import { createClient, type SupabaseContext } from "../supabase";
import { type Tables } from "../database.types";

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

export async function getTourBySlug(context: SupabaseContext, slug: string) {
  const { data, error } = await createClient(context)
    .from("tour")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export async function getTourVariantBySlug(
  context: SupabaseContext,
  tourId: string,
  slug: string,
) {
  const { data, error } = await createClient(context)
    .from("tour_variants")
    .select("id, tour_id, label, slug, is_primary, description")
    .eq("tour_id", tourId)
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export async function getTourVariantsByTourId(
  context: SupabaseContext,
  tourId: string,
) {
  const { data, error } = await createClient(context)
    .from("tour_variants")
    .select("id, tour_id, label, slug, is_primary, description")
    .order("tour_id", { ascending: true })
    .order("is_primary", { ascending: false })
    .order("label", { ascending: true })
    .eq("tour_id", tourId);

  if (error) {
    throw error;
  }

  return data;
}

export async function getTourVariantStagesByTourVariantId(
  context: SupabaseContext,
  variantId: string,
) {
  const { error, data } = await createClient(context)
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
    .order("order", { ascending: true })
    .eq("tour_variant_id", variantId);

  if (error) {
    throw error;
  }

  return data;
}

// TODO refactor this to be more efficient
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
