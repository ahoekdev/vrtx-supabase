import { type Tables } from "../database.types";
import { createClient, type SupabaseContext } from "../supabase";

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

// TODO refactor to use a single query with joins instead of multiple queries and in-memory processing
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
