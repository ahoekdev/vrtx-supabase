import { createClient, type SupabaseContext } from "../../supabase";

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
