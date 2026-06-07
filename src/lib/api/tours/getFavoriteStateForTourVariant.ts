import { createClient, type SupabaseContext } from "../../supabase";

export async function getFavoriteStateForTourVariant(
  context: SupabaseContext,
  tourVariantId: string,
) {
  const client = createClient(context);
  const { data, error } = await client
    .from("user_tour_variant_favorites")
    .select("id")
    .eq("tour_variant_id", tourVariantId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return Boolean(data);
}
