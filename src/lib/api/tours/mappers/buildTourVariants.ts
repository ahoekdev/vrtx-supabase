import type { TourVariant } from "../../../types/tours";

type StageLike = {
  stage: {
    distance: number;
  };
};

export type BuildTourVariantInput = {
  tour: TourVariant["tour"];
  variant: Omit<TourVariant["variant"], "distanceMeters" | "stageCount">;
  stages: StageLike[];
  variantCount: number;
};

export function buildTourVariants<T>(
  rows: T[],
  mapRow: (row: T) => BuildTourVariantInput,
): TourVariant[] {
  return rows.map((row) => {
    const { tour, variant, stages, variantCount } = mapRow(row);

    const distanceMeters = stages.reduce(
      (sum, { stage: { distance } }) => sum + distance,
      0,
    );

    return {
      tour,
      variant: {
        ...variant,
        distanceMeters,
        stageCount: stages.length,
      },
      variantCount,
    };
  });
}
