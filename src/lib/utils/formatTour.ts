import { formatDistance } from "./formatStage";

export function formatTourMetrics(stageCount: number, distanceMeters: number) {
  const stageLabel = stageCount === 1 ? "stage" : "stages";

  return `${stageCount} ${stageLabel} · ${formatDistance(distanceMeters)}`;
}
