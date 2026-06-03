import { createClient, type SupabaseContext } from "../../supabase";

interface GetStagesOptions {
  limit?: number;
  lodgeId?: string;
}

export async function getStages(
  context: SupabaseContext,
  options: GetStagesOptions = {},
) {
  let query = createClient(context)
    .from("stages")
    .select(
      `
  id,
  duration,
  distance,
  from:lodges!from_lodge_id(id, name, slug),
  to:lodges!to_lodge_id(id, name, slug)`,
    );

  if (options.limit) {
    query = query.limit(options.limit);
  }

  if (options.lodgeId) {
    query = query.or(
      `from_lodge_id.eq.${options.lodgeId},to_lodge_id.eq.${options.lodgeId}`,
    );
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data ?? [];
}
