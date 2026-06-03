import { createClient, type SupabaseContext } from "../../supabase";

interface GetLodgesOptions {
  limit?: number;
}

export async function getLodges(
  context: SupabaseContext,
  options: GetLodgesOptions = {},
) {
  let query = createClient(context)
    .from("lodges")
    .select("*")
    .order("name", { ascending: true });

  if (options.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data ?? [];
}
