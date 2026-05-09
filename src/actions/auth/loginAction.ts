import { ActionError, defineAction } from "astro:actions";
import { handleError } from "../utils";
import { supabase } from "../../supabase-client";

export const loginAction = defineAction({
  accept: "json",
  async handler(input: { email: string; password: string }) {
    if (!input.email || !input.password) {
      throw new Error("Missing email or password.");
    }

    try {
      const res = await supabase.auth.signInWithPassword(input);

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
