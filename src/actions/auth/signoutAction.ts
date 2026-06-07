import { defineAction } from "astro:actions";
import { createClient } from "../../lib/supabase";
import { handleError } from "../utils";

export const signoutAction = defineAction({
  accept: "json",
  async handler(_, context) {
    try {
      const client = createClient(context);

      const res = await client.auth.signOut();

      if (res.error) {
        throw res.error;
      }
    } catch (error) {
      handleError(error);
    }
  },
});
