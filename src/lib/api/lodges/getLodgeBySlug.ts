import { createClient, type SupabaseContext } from "../../supabase";

export async function getLodgeBySlug(context: SupabaseContext, slug: string) {
  const { data, error } = await createClient(context)
    .from("lodges")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}
