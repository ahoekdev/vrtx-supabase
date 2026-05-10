import { defineAction } from "astro:actions";
import { deleteLodge } from "../../lib/api/lodges";
import { handleError } from "../utils";
import { createClient } from "../../lib/supabase";

export const deleteLodgeAction = defineAction({
  accept: "json",
  async handler({ id }: { id: string }, context) {
    const client = createClient(context);

    try {
      await deleteLodge(id, client);
      return { id };
    } catch (error) {
      handleError(error);
    }
  },
});
