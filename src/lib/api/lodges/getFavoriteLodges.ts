import { createClient, type SupabaseContext } from "../../supabase";

export interface FavoriteLodge {
  id: string;
  name: string;
  slug: string;
}

export async function getFavoriteLodges(context: SupabaseContext) {
  const { data: favorites, error } = await createClient(context)
    .from("user_lodge_favorites")
    .select("created_at, lodge:lodges(id, name, slug)")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (favorites ?? [])
    .map((favorite) => favorite.lodge)
    .filter((lodge): lodge is FavoriteLodge => Boolean(lodge));
}
