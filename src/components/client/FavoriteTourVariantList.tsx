import { actions } from "astro:actions";
import { useState } from "react";
import { css } from "../../../styled-system/css";
import type { FavoriteTourVariant } from "../../lib/api/tours/getFavoriteTourVariants";

interface FavoriteTourVariantListProps {
  initialVariants: FavoriteTourVariant[];
}

export function FavoriteTourVariantList({
  initialVariants,
}: FavoriteTourVariantListProps) {
  const [pendingIds, setPendingIds] = useState<string[]>([]);

  const filteredVariants = initialVariants.filter(
    ({ id }) => !pendingIds.includes(id),
  );

  async function handleUnfavorite(variantId: string) {
    setPendingIds((prev) => prev.concat(variantId));

    const { error } = await actions.setTourVariantFavorite({
      tourVariantId: variantId,
      isFavorite: false,
    });

    if (error) {
      setPendingIds((prev) => prev.filter((id) => id !== variantId));
    }
  }

  if (!filteredVariants.length) {
    return (
      <p>
        You have not favorited any tour variants yet.{" "}
        <a href="/tours">Browse tours</a>.
      </p>
    );
  }

  return (
    <ul>
      {filteredVariants.map(({ id, tour, is_primary, label }) => (
        <li
          key={id}
          className={css({
            display: "flex",
            alignItems: "center",
            gap: ".5rem",
          })}
        >
          <button
            type="button"
            onClick={() => handleUnfavorite(id)}
            className={css({ cursor: "pointer" })}
          >
            <i className="ri-heart-fill" />
          </button>
          <a href={`/tours/${tour.slug}${is_primary ? "" : `/${id}`}`}>
            {tour.name}
            <span
              className={css({
                marginInlineStart: "0.5rem",
                color: "#666",
              })}
            >
              ({label})
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
