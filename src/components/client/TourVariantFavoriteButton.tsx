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
  const [state, setState] = useState({
    isFavorite: initialIsFavorite,
    isSubmitting: false,
  });

  async function handleToggle(isFavorite: boolean) {
    const nextIsFavorite = !isFavorite;
    setState((prev) => ({
      ...prev,
      isFavorite: nextIsFavorite,
      isSubmitting: true,
    }));

    const res = await actions.setTourVariantFavorite({
      tourVariantId,
      isFavorite: nextIsFavorite,
    });

    if (res.error) {
      setState((prev) => ({
        ...prev,
        isFavorite: !nextIsFavorite,
        isSubmitting: false,
      }));
    } else {
      setState((prev) => ({ ...prev, isSubmitting: false }));
    }
  }

  return (
    <button
      type="button"
      onClick={() => handleToggle(!state.isFavorite)}
      disabled={state.isSubmitting}
      className={css({ fontSize: "1.5rem", cursor: "pointer" })}
    >
      {state.isFavorite ? (
        <i className="ri-heart-fill" />
      ) : (
        <i className="ri-heart-line" />
      )}
    </button>
  );
}
