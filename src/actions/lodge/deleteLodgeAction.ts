import { defineAction } from "astro:actions";
import { deleteLodge } from "../../lib/api/lodges";
import { handleError } from "../utils";

export const deleteLodgeAction = defineAction({
  accept: "json",
  async handler({ id }: { id: string }) {
    if ((typeof id !== "string" && typeof id !== "number") || !id) {
      throw new Error("Missing lodge id.");
    }

    try {
      await deleteLodge(id);
      return { id };
    } catch (error) {
      handleError(error);
    }
  },
});
