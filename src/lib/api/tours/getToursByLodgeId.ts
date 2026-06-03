import { createClient, type SupabaseContext } from "../../supabase";
import { buildTourVariants } from "./mappers/buildTourVariants";

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

  return buildTourVariants(rows, (row) => ({
    tour: {
      id: row.tour.id,
      name: row.tour.name,
      slug: row.tour.slug,
    },
    variant: {
      id: row.id,
      label: row.label,
      slug: row.slug,
      is_primary: row.is_primary,
    },
    stages: row.all_stages,
    variantCount: row.tour.tour_variants[0]?.count ?? 1,
  }));
}
