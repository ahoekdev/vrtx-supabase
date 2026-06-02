import type { Tables } from "../database.types";

type TourSummary = Pick<Tables<"tour">, "id" | "name" | "slug">;

type TourVariantSummary = Pick<
  Tables<"tour_variants">,
  "id" | "slug" | "label" | "is_primary"
> & {
  distanceMeters: number;
  stageCount: number;
};

export type TourVariant = {
  tour: TourSummary;
  variant: TourVariantSummary;
  variantCount: number;
};
