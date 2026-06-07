import { actions } from "astro:actions";
import { useState } from "react";
import { css } from "../../../styled-system/css";

interface LodgeFavoriteButtonProps {
  lodgeId: string;
  initialIsFavorite: boolean;
}

export function LodgeFavoriteButton({
  lodgeId,
  initialIsFavorite,
}: LodgeFavoriteButtonProps) {
  const [state, setState] = useState({
    isFavorite: initialIsFavorite,
    isSubmitting: false,
  });

  async function handleToggle(isFavorite: boolean) {
    setState({ isFavorite, isSubmitting: true });

    const { error } = await actions.setFavorite({ lodgeId, isFavorite });

    if (error) {
      setState({ isFavorite: !isFavorite, isSubmitting: false });
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
        <i className="ri-heart-fill"></i>
      ) : (
        <i className="ri-heart-line"></i>
      )}
    </button>
  );
}
