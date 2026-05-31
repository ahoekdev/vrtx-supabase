import type { LodgeSummary } from "../types/lodges";

interface Data {
  from: LodgeSummary;
  to: LodgeSummary;
}

export function convertStagesToNeighbourLodges(data: Data[], lodgeId: string) {
  return Array.from(
    data.reduce(
      (acc, { from, to }) => acc.add(from.id === lodgeId ? to : from),
      new Set<LodgeSummary>(),
    ),
  ).toSorted((a, b) => a.name.localeCompare(b.name));
}
