import { createClient, type SupabaseContext } from "../../supabase";
import { buildTourVariants } from "./mappers/buildTourVariants";

export async function getToursByLodgeId(
  context: SupabaseContext,
  lodgeId: string,
) {
  const { data, error } = await createClient(context).rpc("get_tour_variants", {
    p_lodge_id: lodgeId,
  });

  if (error) {
    throw error;
  }

  return buildTourVariants(data);
}
