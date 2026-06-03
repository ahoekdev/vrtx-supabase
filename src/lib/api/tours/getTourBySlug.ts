import { createClient, type SupabaseContext } from "../../supabase";

export async function getTourBySlug(context: SupabaseContext, slug: string) {
  const { data, error } = await createClient(context)
    .from("tour")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}
