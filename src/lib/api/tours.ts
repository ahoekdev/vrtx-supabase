import { createClient, type SupabaseContext } from "../supabase";

interface GetToursOptions {
  limit?: number;
  lodgeId?: string;
}

type TourListItem = {
  tour: {
    name: string;
    slug: string;
  };
  variant: {
    slug: string;
    label: string;
  };
  variantCount: number;
  stageCount: number;
  distanceMeters: number;
};

type TourVariantStageRow = {
  stage: {
    distance: number;
    from_lodge_id?: string;
    to_lodge_id?: string;
  } | null;
};

type TourListRow = {
  id: string;
  label: string;
  slug: string;
  is_primary: boolean;
  tour: {
    id: string;
    name: string;
    slug: string;
  } | null;
  tour_variant_stages: TourVariantStageRow[] | null;
};

function summarizeVariantStages(
  rows: TourVariantStageRow[] | null | undefined,
) {
  return (rows ?? []).reduce(
    (stats, row) => {
      if (!row.stage) {
        return stats;
      }

      stats.stageCount += 1;
      stats.distanceMeters += row.stage.distance;
      return stats;
    },
    {
      stageCount: 0,
      distanceMeters: 0,
    },
  );
}

export async function getTours(
  context: SupabaseContext,
  options: GetToursOptions = {},
) {
  const client = createClient(context);

  let toursQuery = client
    .from("tour_variants")
    .select(
      `
      id,
      label,
      slug,
      is_primary,
      tour:tour!inner(
        id,
        name,
        slug
      ),
      tour_variant_stages(
        stage:stages(
          distance,
          from_lodge_id,
          to_lodge_id
        )
      )
    `,
    )
    .order("is_primary", { ascending: false });

  const { data, error } = await toursQuery;

  if (error) {
    throw error;
  }

  const filteredRows = ((data ?? []) as TourListRow[]).filter((row) => {
    if (!options.lodgeId) {
      return true;
    }

    return (row.tour_variant_stages ?? []).some(({ stage }) => {
      if (!stage) {
        return false;
      }

      return (
        stage.from_lodge_id === options.lodgeId ||
        stage.to_lodge_id === options.lodgeId
      );
    });
  });

  const rows = filteredRows.sort((left, right) => {
    const leftTourName = left.tour?.name ?? "";
    const rightTourName = right.tour?.name ?? "";

    const tourNameComparison = leftTourName.localeCompare(rightTourName);

    if (tourNameComparison !== 0) {
      return tourNameComparison;
    }

    if (left.is_primary !== right.is_primary) {
      return left.is_primary ? -1 : 1;
    }

    return left.label.localeCompare(right.label);
  });

  const variantCountByTourSlug = rows.reduce<Map<string, number>>(
    (counts, row) => {
      if (!row.tour) {
        return counts;
      }

      counts.set(row.tour.slug, (counts.get(row.tour.slug) ?? 0) + 1);
      return counts;
    },
    new Map(),
  );

  const limitedRows = options.limit ? rows.slice(0, options.limit) : rows;

  return limitedRows
    .map((row): TourListItem | null => {
      if (!row.tour) {
        return null;
      }

      const stats = summarizeVariantStages(row.tour_variant_stages);
      const variantCount = variantCountByTourSlug.get(row.tour.slug) ?? 0;

      return {
        tour: {
          name: row.tour.name,
          slug: row.tour.slug,
        },
        variant: {
          slug: row.slug,
          label: row.label,
        },
        variantCount,
        stageCount: stats.stageCount,
        distanceMeters: stats.distanceMeters,
      };
    })
    .filter((entry): entry is TourListItem => entry !== null);
}
