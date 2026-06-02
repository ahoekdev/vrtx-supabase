import { createClient, type SupabaseContext } from "../../supabase";
import type { TourVariant } from "../../types/tours";

interface GetToursOptions {
  limit?: number;
}

export async function getTours(
  context: SupabaseContext,
  options: GetToursOptions = {},
) {
  let toursQuery = createClient(context)
    .from("tour_variants")
    .select(
      `
      id,
      label,
      slug,
      is_primary,
      tour:tour!inner(
        id,
        name,
        slug
      ),
      tour_variant_stages(
        stage:stages(
          distance
        )
      )
    `,
    )
    .order("label", { ascending: true })
    .order("is_primary", { ascending: false });

  if (options.limit) {
    toursQuery = toursQuery.limit(options.limit);
  }

  const { data, error } = await toursQuery;

  if (error) {
    throw error;
  }

  if (!data) {
    return [];
  }

  const tourVariants: TourVariant[] = [];

  for (const row of data) {
    const distanceMeters = row.tour_variant_stages.reduce(
      (sum, stage) => sum + (stage.stage.distance ?? 0),
      0,
    );

    const stageCount = row.tour_variant_stages.length;

    tourVariants.push({
      tour: row.tour,
      variant: {
        id: row.id,
        label: row.label,
        slug: row.slug,
        is_primary: row.is_primary,
        distanceMeters,
        stageCount,
      },
      variantCount: row.tour_variant_stages.length,
    });
  }

  return tourVariants;
}
