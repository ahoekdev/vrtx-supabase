import { createClient, type SupabaseContext } from "../../supabase";

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
    .order("order", { ascending: true })
    .eq("tour_variant_id", variantId);

  if (error) {
    throw error;
  }

  return data;
}
