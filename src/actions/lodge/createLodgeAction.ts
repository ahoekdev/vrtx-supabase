import { defineAction } from "astro:actions";
import { createLodge } from "../../lib/api/lodges";
import { handleError } from "../utils";

export const createLodgeAction = defineAction({
  accept: "json",
  async handler({ name }: { name: string }) {
    if (!name) {
      throw new Error("Missing lodge name.");
    }

    try {
      return createLodge(name);
    } catch (error) {
      handleError(error);
    }
  },
});
