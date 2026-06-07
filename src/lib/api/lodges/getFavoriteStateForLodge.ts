import { createClient, type SupabaseContext } from "../../supabase";

export async function getFavoriteStateForLodge(
  context: SupabaseContext,
  lodgeId: string,
) {
  const client = createClient(context);
  const { data, error } = await client
    .from("user_lodge_favorites")
    .select("id")
    .eq("lodge_id", lodgeId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return Boolean(data);
}
