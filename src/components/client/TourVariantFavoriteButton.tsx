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
    setState({ isFavorite, isSubmitting: true });

    const res = await actions.setTourVariantFavorite({
      tourVariantId,
      isFavorite,
    });

    if (res.error) {
      setState({ isFavorite, isSubmitting: false });
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
