import { createClient, type SupabaseContext } from "../supabase";

interface GetStagesOptions {
  limit?: number;
  lodgeId?: string;
}

export function getAllStages(
  context: SupabaseContext,
  options: GetStagesOptions = {},
) {
  let query = createClient(context).from("stages").select(
    `
  id,
  from:lodges!from_lodge_id(name),
  to:lodges!to_lodge_id(name)`,
  );

  if (options.lodgeId) {
    query = query.or(
      `from_lodge_id.eq.${options.lodgeId},to_lodge_id.eq.${options.lodgeId}`,
    );
  }

  if (options.limit) {
    query = query.limit(options.limit);
  }

  return query;
}

export function getStagesByLodgeId(
  context: SupabaseContext,
  lodgeId: string,
) {
  return getAllStages(context, { lodgeId });
}
