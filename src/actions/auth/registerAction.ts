import { ActionError, defineAction } from "astro:actions";
import { handleError } from "../utils";
import { supabase } from "../../supabase-client";

export const registerAction = defineAction({
  accept: "json",
  async handler(input: { email: string; password: string }) {
    if (!input.email || !input.password) {
      throw new Error("Missing email or password.");
    }

    try {
      const res = await supabase.auth.signUp(input);

      if (res.error) {
        if (res.error.status === 429) {
          throw new ActionError({
            code: "TOO_MANY_REQUESTS",
            message:
              "Too many confirmation emails have been sent. Please wait before trying again.",
          });
        }

        throw new ActionError({
          code: "BAD_REQUEST",
          message: res.error.message || "Invalid email or password.",
        });
      }

      return res.data;
    } catch (error) {
      handleError(error);
    }
  },
});
