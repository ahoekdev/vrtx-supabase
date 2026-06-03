import { createClient, type SupabaseContext } from "../../supabase";
import { buildTourVariants } from "./mappers/buildTourVariants";

interface GetToursOptions {
  limit?: number;
}

export async function getTours(
  context: SupabaseContext,
  options: GetToursOptions = {},
) {
  const { data, error } = await createClient(context).rpc(
    "get_tour_variants",
    options.limit ? { p_limit: options.limit } : {},
  );

  if (error) {
    throw error;
  }

  return buildTourVariants(data);
}
