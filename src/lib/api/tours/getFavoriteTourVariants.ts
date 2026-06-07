import { createClient, type SupabaseContext } from "../../supabase";

export interface FavoriteTourVariant {
  id: string;
  label: string;
  slug: string;
  is_primary: boolean;
  tour: {
    id: string;
    name: string;
    slug: string;
  };
}

export async function getFavoriteTourVariants(
  context: SupabaseContext,
): Promise<FavoriteTourVariant[]> {
  const { data, error } = await createClient(context)
    .from("user_tour_variant_favorites")
    .select(
      "created_at, variant:tour_variants(id, label, slug, is_primary, tour:tour(id, name, slug))",
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data?.map(({ variant }) => variant) ?? [];
}
