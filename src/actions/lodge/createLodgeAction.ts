import { defineAction } from "astro:actions";
import { createLodge } from "../../lib/api/lodges";
import { handleError } from "../utils";
import { createClient } from "../../lib/supabase";

export const createLodgeAction = defineAction({
  accept: "json",
  async handler({ name }: { name: string }, context) {
    const client = createClient(context);

    try {
      return createLodge({ name }, client);
    } catch (error) {
      handleError(error);
    }
  },
});
