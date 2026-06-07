import { actions } from "astro:actions";
import { useState } from "react";
import { css } from "../../../styled-system/css";
import type { FavoriteLodge } from "../../lib/api/lodges/getFavoriteLodges";

interface FavoriteLodgeListProps {
  initialLodges: FavoriteLodge[];
}

export function FavoriteLodgeList({ initialLodges }: FavoriteLodgeListProps) {
  const [lodges, setLodges] = useState(initialLodges);
  const [pendingIds, setPendingIds] = useState<string[]>([]);

  const filteredLodges = lodges.filter(({ id }) => !pendingIds.includes(id));

  async function handleUnfavorite(lodgeId: string) {
    setPendingIds((prev) => prev.concat(lodgeId));

    const res = await actions.setFavorite({ lodgeId, isFavorite: false });

    if (res.error) {
      setPendingIds((prev) => prev.filter((id) => id !== lodgeId));
    } else {
      setLodges((prev) => prev.filter((lodge) => lodge.id !== lodgeId));
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
