import { defineAction } from "astro:actions";
import { createLodge, deleteLodge } from "../lib/api/lodges";

export const server = {
  createLodge: defineAction({
    accept: "json",
    async handler(input) {
      const name = input?.name;

      if (typeof name !== "string" || !name.trim()) {
        throw new Error("Missing lodge name.");
      }

      return createLodge(name.trim());
    },
  }),

  deleteLodge: defineAction({
    accept: "json",
    async handler(input) {
      const id = input?.id;

      if ((typeof id !== "string" && typeof id !== "number") || !id) {
        throw new Error("Missing lodge id.");
      }

      await deleteLodge(String(id));

      return { id };
    },
  }),
};
