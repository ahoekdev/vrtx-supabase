import { createClient, type SupabaseContext } from "../../supabase";
import type { TourVariant } from "../../types/tours";

export async function getToursByLodgeId(
  context: SupabaseContext,
  lodgeId: string,
) {
  const { data = [], error } = await createClient(context)
    .from("tour_variant_stages")
    .select(
      `
      stage:stages!inner(
        from_lodge_id,
        to_lodge_id,
        distance
      ),
      tour_variant:tour_variants!inner(
        id,
        label,
        slug,
        is_primary,
        tour:tour!inner(
          id,
          name,
          slug
        )
      )
    `,
    )
    .or(`from_lodge_id.eq.${lodgeId},to_lodge_id.eq.${lodgeId}`, {
      referencedTable: "stage",
    });

  if (error) {
    throw error;
  }

  if (!data) {
    return [];
  }

  const tourVariants: Map<string, TourVariant> = new Map();

  for (const stage of data) {
    const variant = stage.tour_variant;

    if (tourVariants.has(variant.id)) {
      continue;
    }

    // distance and count are not calculated correctly
    const distanceMeters = data
      .filter(({ tour_variant }) => tour_variant.id === variant.id)
      .reduce((sum, { stage }) => sum + (stage?.distance ?? 0), 0);

    const stageCount = data.filter(
      ({ tour_variant }) => tour_variant?.id === variant.id,
    ).length;

    tourVariants.set(variant.id, {
      tour: variant.tour,
      variant: {
        id: variant.id,
        label: variant.label,
        slug: variant.slug,
        is_primary: variant.is_primary,
        distanceMeters,
        stageCount,
      },
      variantCount: stageCount,
    });
  }

  return Array.from(tourVariants.values());
}
