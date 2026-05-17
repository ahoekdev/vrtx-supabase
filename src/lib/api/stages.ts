import { createClient, type SupabaseContext } from "../supabase";

export function getStagesQuery(context: SupabaseContext) {
  const client = createClient(context);

  return client.from("stages").select(
    `
  id,
  from:lodges!from_lodge_id(name),
  to:lodges!to_lodge_id(name)`,
  );
}
