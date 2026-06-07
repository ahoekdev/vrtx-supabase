import { defineAction } from "astro:actions";
import { createClient } from "../../lib/supabase";
import { handleError } from "../utils";

export const setFavoriteAction = defineAction({
  accept: "json",
  async handler(input: { lodgeId: string; isFavorite: boolean }, context) {
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
        const { error } = await client.from("user_lodge_favorites").insert({
          lodge_id: input.lodgeId,
          user_id: userData.user.id,
        });

        if (error) {
          throw error;
        }
      } else {
        const { error } = await client
          .from("user_lodge_favorites")
          .delete()
          .eq("user_id", userData.user.id)
          .eq("lodge_id", input.lodgeId);

        if (error) {
          throw error;
        }
      }
    } catch (error) {
      handleError(error);
    }
  },
});
