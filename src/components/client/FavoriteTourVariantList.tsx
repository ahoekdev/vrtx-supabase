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
  const [variants, setVariants] = useState(initialVariants);
  const [pendingIds, setPendingIds] = useState<string[]>([]);

  async function handleUnfavorite(variantId: string) {
    if (pendingIds.includes(variantId)) {
      return;
    }

    let removedVariant: FavoriteTourVariant | undefined;
    let removedIndex = -1;

    setVariants((current) => {
      removedIndex = current.findIndex(({ id }) => id === variantId);

      if (removedIndex === -1) {
        return current;
      }

      removedVariant = current[removedIndex];

      return [
        ...current.slice(0, removedIndex),
        ...current.slice(removedIndex + 1),
      ];
    });

    setPendingIds((current) =>
      current.includes(variantId) ? current : [...current, variantId],
    );

    const res = await actions.setTourVariantFavorite({
      tourVariantId: variantId,
      isFavorite: false,
    });

    if (res.error && removedVariant) {
      const variantToRestore = removedVariant;

      setVariants((current) => {
        if (current.some(({ id }) => id === variantId)) {
          return current;
        }

        const nextIndex =
          removedIndex < 0
            ? current.length
            : Math.min(removedIndex, current.length);

        return [
          ...current.slice(0, nextIndex),
          variantToRestore,
          ...current.slice(nextIndex),
        ];
      });
    }

    setPendingIds((current) => current.filter((id) => id !== variantId));
  }

  if (variants.length === 0) {
    return (
      <p>
        You have not favorited any tour variants yet.{" "}
        <a href="/tours">Browse tours</a>.
      </p>
    );
  }

  return (
    <ul>
      {variants.map((variant) => {
        const isPending = pendingIds.includes(variant.id);
        const href = variant.is_primary
          ? `/tours/${variant.tour.slug}`
          : `/tours/${variant.tour.slug}/${variant.slug}`;

        return (
          <li
            key={variant.id}
            className={css({
              display: "flex",
              alignItems: "center",
              gap: ".5rem",
            })}
          >
            <button
              type="button"
              aria-label={`Remove ${variant.tour.name} (${variant.label}) from favorites`}
              title={`Remove ${variant.tour.name} (${variant.label}) from favorites`}
              disabled={isPending}
              onClick={() => handleUnfavorite(variant.id)}
              className={css({
                cursor: "pointer",
              })}
            >
              <i className="ri-heart-fill" />
            </button>
            <a href={href}>
              {variant.tour.name}
              <span
                className={css({
                  marginInlineStart: "0.35rem",
                  color: "#666",
                })}
              >
                ({variant.label})
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
