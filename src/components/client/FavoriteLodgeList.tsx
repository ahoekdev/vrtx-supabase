import { actions } from "astro:actions";
import { useState } from "react";
import { css } from "../../../styled-system/css";
import type { FavoriteLodge } from "../../lib/api/lodges/getFavoriteLodges";

interface FavoriteLodgeListProps {
  initialLodges: FavoriteLodge[];
}

export function FavoriteLodgeList({ initialLodges }: FavoriteLodgeListProps) {
  const [removedIds, setRemovedIds] = useState<string[]>([]);

  const filteredLodges = initialLodges.filter(
    ({ id }) => !removedIds.includes(id),
  );

  async function handleUnfavorite(lodgeId: string) {
    setRemovedIds((prev) => prev.concat(lodgeId));

    const { error } = await actions.setFavorite({ lodgeId, isFavorite: false });

    if (error) {
      setRemovedIds((prev) => prev.filter((id) => id !== lodgeId));
    }
  }

  if (!filteredLodges.length) {
    return <EmptyState />;
  }

  return (
    <ul>
      {filteredLodges.map((lodge) => (
        <li
          key={lodge.id}
          className={css({
            display: "flex",
            alignItems: "center",
            gap: ".5rem",
          })}
        >
          <button
            type="button"
            onClick={() => handleUnfavorite(lodge.id)}
            className={css({ cursor: "pointer" })}
          >
            <i className="ri-heart-fill" />
          </button>
          <a href={`/lodges/${lodge.slug}`}>{lodge.name}</a>
        </li>
      ))}
    </ul>
  );
}

function EmptyState() {
  return <p>You have not favorited any lodges yet.</p>;
}
