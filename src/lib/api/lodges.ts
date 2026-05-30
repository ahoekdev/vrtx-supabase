import { type SupabaseClient } from "@supabase/supabase-js";
import { createClient, type SupabaseContext } from "../supabase";
import { type Tables } from "../database.types";

interface GetLodgesOptions {
  limit?: number;
}

export function getLodges(
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

  return query;
}

export function getLodgeBySlug(context: SupabaseContext, slug: string) {
  return createClient(context)
    .from("lodges")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
}

type TourSummary = Pick<Tables<"tour">, "id" | "name" | "slug">;
type TourVariantSummary = Pick<
  Tables<"tour_variants">,
  "id" | "label" | "slug" | "is_primary"
>;
type NeighbouringLodge = Pick<Tables<"lodges">, "id" | "name" | "slug">;

export async function getNeighbouringLodges(
  context: SupabaseContext,
  lodgeId: string,
) {
  const { data, error } = await createClient(context)
    .from("stages")
    .select(
      `
      from:lodges!from_lodge_id(id, name, slug),
      to:lodges!to_lodge_id(id, name, slug)
    `,
    )
    .or(`from_lodge_id.eq.${lodgeId},to_lodge_id.eq.${lodgeId}`);

  if (error) {
    throw error;
  }

  const neighbouringLodges = new Map<string, NeighbouringLodge>();

  for (const stage of data ?? []) {
    const neighbour = stage.from.id === lodgeId ? stage.to : stage.from;

    if (!neighbouringLodges.has(neighbour.id)) {
      neighbouringLodges.set(neighbour.id, neighbour);
    }
  }

  return Array.from(neighbouringLodges.values());
}

export async function getToursByLodgeId(
  context: SupabaseContext,
  lodgeId: string,
) {
  const { data, error } = await createClient(context)
    .from("tour_variant_stages")
    .select(
      `
      stage:stages!inner(
        from_lodge_id,
        to_lodge_id
      ),
      tour_variant:tour_variants!inner(
        id,
        label,
        slug,
        is_primary,
        tour:tour!inner(id, name, slug)
      )
    `,
    )
    .or(`from_lodge_id.eq.${lodgeId},to_lodge_id.eq.${lodgeId}`, {
      referencedTable: "stage",
    });

  if (error) {
    throw error;
  }

  const tours = new Map<
    string,
    {
      tour: TourSummary;
      variants: TourVariantSummary[];
    }
  >();

  type LodgeTourRow = {
    stage: Pick<Tables<"stages">, "from_lodge_id" | "to_lodge_id"> | null;
    tour_variant: {
      id: string;
      label: string;
      slug: string;
      is_primary: boolean;
      tour: TourSummary;
    } | null;
  };

  for (const row of (data ?? []) as LodgeTourRow[]) {
    const tour = row.tour_variant?.tour;
    const variant = row.tour_variant
      ? {
          id: row.tour_variant.id,
          label: row.tour_variant.label,
          slug: row.tour_variant.slug,
          is_primary: row.tour_variant.is_primary,
        }
      : null;

    if (tour && variant) {
      const entry = tours.get(tour.id);

      if (entry) {
        if (!entry.variants.some(({ id }) => id === variant.id)) {
          entry.variants.push(variant);
        }
      } else {
        tours.set(tour.id, {
          tour,
          variants: [variant],
        });
      }
    }
  }

  const selectedVariants = Array.from(tours.values())
    .map((entry) => {
      const selectedVariant =
        entry.variants.find(({ is_primary }) => is_primary) ??
        entry.variants[0];

      return selectedVariant
        ? {
            tour: entry.tour,
            variant: selectedVariant,
          }
        : null;
    })
    .filter(
      (
        entry,
      ): entry is {
        tour: TourSummary;
        variant: TourVariantSummary;
      } => entry !== null,
    )
    .sort((left, right) => left.tour.name.localeCompare(right.tour.name));

  const variantIds = selectedVariants.map(({ variant }) => variant.id);

  const { data: variantStages, error: statsError } = await createClient(context)
    .from("tour_variant_stages")
    .select(
      `
      tour_variant_id,
      stage:stages!inner(
        distance
      )
    `,
    )
    .in("tour_variant_id", variantIds);

  if (statsError) {
    throw statsError;
  }

  type VariantStageStatsRow = {
    tour_variant_id: string;
    stage: {
      distance: number;
    } | null;
  };

  const statsByVariantId = new Map<
    string,
    { stageCount: number; distanceMeters: number }
  >();

  for (const row of (variantStages ?? []) as VariantStageStatsRow[]) {
    if (!row.stage) {
      continue;
    }

    const current = statsByVariantId.get(row.tour_variant_id) ?? {
      stageCount: 0,
      distanceMeters: 0,
    };

    current.stageCount += 1;
    current.distanceMeters += row.stage.distance;

    statsByVariantId.set(row.tour_variant_id, current);
  }

  return selectedVariants.map(({ tour, variant }) => {
    const stats = statsByVariantId.get(variant.id) ?? {
      stageCount: 0,
      distanceMeters: 0,
    };

    return {
      tour,
      variant,
      stageCount: stats.stageCount,
      distanceMeters: stats.distanceMeters,
    };
  });
}

interface CreateLodgeDTO {
  name: string;
}

export async function createLodge(
  { name }: CreateLodgeDTO,
  client: SupabaseClient,
) {
  const { data, error } = await client
    .from("lodges")
    .insert({ name })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteLodge(id: string, client: SupabaseClient) {
  const { error } = await client.from("lodges").delete().eq("id", id);

  if (error) {
    throw error;
  }
}
