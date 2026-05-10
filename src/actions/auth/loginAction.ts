import { ActionError, defineAction } from "astro:actions";
import { createClient } from "../../lib/supabase";
import { handleError } from "../utils";

export const loginAction = defineAction({
  accept: "json",
  async handler(input: { email: string; password: string }, context) {
    try {
      const client = createClient(context);

      const res = await client.auth.signInWithPassword(input);

      if (res.error) {
        throw new ActionError({
          code: "BAD_REQUEST",
          message: "Invalid email or password.",
        });
      }

      return res.data;
    } catch (error) {
      handleError(error);
    }
  },
});
