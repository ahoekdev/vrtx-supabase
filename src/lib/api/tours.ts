import { createClient, type SupabaseContext } from "../supabase";

interface GetToursOptions {
  limit?: number;
}

interface GetTourStagesOptions {
  tourIds?: string[];
}

export function getTours(
  context: SupabaseContext,
  options: GetToursOptions = {},
) {
  let query = createClient(context)
    .from("tour")
    .select("*")
    .order("name", { ascending: true });

  if (options.limit) {
    query = query.limit(options.limit);
  }

  return query;
}

export function getTourStages(
  context: SupabaseContext,
  options: GetTourStagesOptions = {},
) {
  let query = createClient(context)
    .from("tour_stages")
    .select(
      `
      tour_id,
      order,
      stage:stages(
        id,
        from:lodges!from_lodge_id(name),
        to:lodges!to_lodge_id(name)
      )
    `,
    )
    .order("tour_id", { ascending: true })
    .order("order", { ascending: true });

  if (options.tourIds?.length) {
    query = query.in("tour_id", options.tourIds);
  }

  return query;
}
