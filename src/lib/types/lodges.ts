import type { Tables } from "../database.types";

export type TourSummary = Pick<Tables<"tour">, "id" | "name" | "slug">;
export type TourVariantSummary = Pick<
  Tables<"tour_variants">,
  "id" | "label" | "slug" | "is_primary"
>;
export type LodgeSummary = Pick<Tables<"lodges">, "id" | "name" | "slug">;
