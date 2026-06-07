import { actions } from "astro:actions";
import { useState } from "react";

interface LodgeFavoriteButtonProps {
  lodgeId: string;
  initialIsFavorite: boolean;
}

export function LodgeFavoriteButton({
  lodgeId,
  initialIsFavorite,
}: LodgeFavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleToggle() {
    if (isSubmitting) {
      return;
    }

    const nextIsFavorite = !isFavorite;
    setIsFavorite(nextIsFavorite);
    setIsSubmitting(true);

    const res = await actions.setFavorite({
      lodgeId,
      isFavorite: nextIsFavorite,
    });

    if (res.error) {
      setIsFavorite(!nextIsFavorite);
    }

    setIsSubmitting(false);
  }

  return (
    <button type="button" onClick={handleToggle} disabled={isSubmitting}>
      {isFavorite ? "Unfavorite" : "Favorite"}
    </button>
  );
}
