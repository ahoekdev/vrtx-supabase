import { defineAction } from "astro:actions";
import { createClient } from "../../lib/supabase";
import { handleError } from "../utils";

export const setTourVariantFavoriteAction = defineAction({
  accept: "json",
  async handler(
    input: { tourVariantId: string; isFavorite: boolean },
    context,
  ) {
    try {
      const client = createClient(context);
      const { data: userData, error: userError } = await client.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!userData.user) {
        throw new Error("Not authenticated.");
      }

      if (input.isFavorite) {
        const { error } = await client.from("user_tour_variant_favorites").insert({
          tour_variant_id: input.tourVariantId,
          user_id: userData.user.id,
        });

        if (error) {
          throw error;
        }
      } else {
        const { error } = await client
          .from("user_tour_variant_favorites")
          .delete()
          .eq("user_id", userData.user.id)
          .eq("tour_variant_id", input.tourVariantId);

        if (error) {
          throw error;
        }
      }
    } catch (error) {
      handleError(error);
    }
  },
});
