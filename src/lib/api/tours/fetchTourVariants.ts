import { createClient, type SupabaseContext } from "../../supabase";

type FetchTourVariantsOptions = {
  lodgeId?: string;
  limit?: number;
};

export type TourVariantRow = {
  tour_id: string;
  tour_name: string;
  tour_slug: string;
  id: string;
  label: string;
  slug: string;
  is_primary: boolean;
  stage_count: number;
  distance_meters: number;
  variant_count: number;
};

export async function fetchTourVariants(
  context: SupabaseContext,
  options: FetchTourVariantsOptions = {},
): Promise<TourVariantRow[]> {
  const args: Record<string, string | number> = {};

  if (options.lodgeId) {
    args.p_lodge_id = options.lodgeId;
  }

  if (options.limit !== undefined) {
    args.p_limit = options.limit;
  }

  const { data, error } = await createClient(context).rpc(
    "get_tour_variants",
    args,
  );

  if (error) {
    throw error;
  }

  return data;
}
