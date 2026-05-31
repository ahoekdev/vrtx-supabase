import { createClient, type SupabaseContext } from "../../supabase";

export async function getTourVariantsByTourId(
  context: SupabaseContext,
  tourId: string,
) {
  const { data, error } = await createClient(context)
    .from("tour_variants")
    .select("id, tour_id, label, slug, is_primary, description")
    .order("label", { ascending: true })
    .order("is_primary", { ascending: false })
    .eq("tour_id", tourId);

  if (error) {
    throw error;
  }

  return data ?? [];
}
