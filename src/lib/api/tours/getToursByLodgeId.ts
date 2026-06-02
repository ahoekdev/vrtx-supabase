import { createClient, type SupabaseContext } from "../../supabase";
import type { TourVariant } from "../../types/tours";

export async function getToursByLodgeId(
  context: SupabaseContext,
  lodgeId: string,
) {
  const { data, error } = await createClient(context)
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
        slug,
        tour_variants(count)
      ),
      matching_stages:tour_variant_stages!inner(
        stage:stages!inner(
          from_lodge_id,
          to_lodge_id
        )
      ),
      all_stages:tour_variant_stages(
        stage:stages(
          distance
        )
      )
    `,
    )
    .or(`from_lodge_id.eq.${lodgeId},to_lodge_id.eq.${lodgeId}`, {
      referencedTable: "matching_stages.stage",
    });

  if (error) {
    throw error;
  }

  const rows = data ?? [];

  const tourVariants: TourVariant[] = [];

  for (const row of rows) {
    const distanceMeters = row.all_stages.reduce(
      (sum, { stage }) => sum + (stage?.distance ?? 0),
      0,
    );
    const stageCount = row.all_stages.length;
    const variantCount = row.tour.tour_variants[0]?.count ?? 1;

    const { tour } = row;

    tourVariants.push({
      tour: { id: tour.id, name: tour.name, slug: tour.slug },
      variant: {
        id: row.id,
        label: row.label,
        slug: row.slug,
        is_primary: row.is_primary,
        distanceMeters,
        stageCount,
      },
      variantCount,
    });
  }

  return tourVariants;
}
