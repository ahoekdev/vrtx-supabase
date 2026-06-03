import type { TourVariant } from "../../../types/tours";

type TourVariantRow = {
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

export function buildTourVariants(rows: TourVariantRow[]): TourVariant[] {
  return rows.map((row) => ({
    tour: {
      id: row.tour_id,
      name: row.tour_name,
      slug: row.tour_slug,
    },
    variant: {
      id: row.id,
      label: row.label,
      slug: row.slug,
      is_primary: row.is_primary,
      distanceMeters: row.distance_meters,
      stageCount: row.stage_count,
    },
    variantCount: row.variant_count,
  }));
}
