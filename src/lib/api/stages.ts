import { createClient, type SupabaseContext } from "../supabase";

interface GetStagesOptions {
  limit?: number;
}

export function getStages(
  context: SupabaseContext,
  options: GetStagesOptions = {},
) {
  let query = createClient(context).from("stages").select(
    `
  id,
  from:lodges!from_lodge_id(name),
  to:lodges!to_lodge_id(name)`,
  );

  if (options.limit) {
    query = query.limit(options.limit);
  }

  return query;
}
