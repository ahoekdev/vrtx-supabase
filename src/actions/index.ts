import { defineAction } from "astro:actions";
import { deleteLodge } from "../lib/api/lodges";

export const server = {
  deleteLodge: defineAction({
    accept: "form",
    async handler(formData) {
      const id = formData.get("id");

      if (typeof id !== "string" || !id) {
        throw new Error("Missing lodge id.");
      }

      await deleteLodge(id);
    },
  }),
};
