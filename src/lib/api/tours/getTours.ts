import { createClient, type SupabaseContext } from "../../supabase";
import { buildTourVariants } from "./mappers/buildTourVariants";

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
        slug,
        tour_variants(count)
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

  return buildTourVariants(data, (row) => ({
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
    stages: row.tour_variant_stages,
    variantCount: row.tour.tour_variants[0]?.count ?? 1,
  }));
}
