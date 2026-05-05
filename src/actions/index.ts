import { defineAction } from "astro:actions";
import { createLodge, deleteLodge } from "../lib/api/lodges";

export const server = {
  createLodge: defineAction({
    accept: "form",
    async handler(formData) {
      const name = formData.get("name");

      if (typeof name !== "string" || !name.trim()) {
        throw new Error("Missing lodge name.");
      }

      await createLodge(name.trim());
    },
  }),

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
