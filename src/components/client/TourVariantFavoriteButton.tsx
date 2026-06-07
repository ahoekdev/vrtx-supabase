import { actions } from "astro:actions";
import { useState } from "react";
import { css } from "../../../styled-system/css";

interface TourVariantFavoriteButtonProps {
  tourVariantId: string;
  initialIsFavorite: boolean;
}

export function TourVariantFavoriteButton({
  tourVariantId,
  initialIsFavorite,
}: TourVariantFavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleToggle() {
    if (isSubmitting) {
      return;
    }

    const nextIsFavorite = !isFavorite;
    setIsFavorite(nextIsFavorite);
    setIsSubmitting(true);

    const res = await actions.setTourVariantFavorite({
      tourVariantId,
      isFavorite: nextIsFavorite,
    });

    if (res.error) {
      setIsFavorite(!nextIsFavorite);
    }

    setIsSubmitting(false);
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isSubmitting}
      className={css({
        fontSize: "1.5rem",
        cursor: "pointer",
      })}
    >
      {isFavorite ? (
        <i className="ri-heart-fill" />
      ) : (
        <i className="ri-heart-line" />
      )}
    </button>
  );
}
