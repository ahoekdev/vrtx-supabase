import dist from "@astrojs/react";

export function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (!hours) {
    return `${minutes}m`;
  }

  if (!remainingMinutes) {
    return `${hours}h`;
  }

  return `${hours}h${remainingMinutes}m`;
}

export function formatDistance(meters: number) {
  const kilometers = meters / 1000;
  const rounded = Math.round(kilometers * 10) / 10;

  return `${Number.isInteger(rounded) ? rounded.toFixed(0) : rounded.toFixed(1)} km`;
}

export function formatStageMetrics(
  durationMinutes: number | null,
  distanceMeters: number | null,
) {
  if (durationMinutes && distanceMeters) {
    return `${formatDuration(durationMinutes)} · ${formatDistance(distanceMeters)}`;
  }

  if (distanceMeters) {
    return formatDistance(distanceMeters);
  }

  if (durationMinutes) {
    return formatDuration(durationMinutes);
  }

  return "metrics unavailable";
}
