import { ActionError, defineAction } from "astro:actions";
import { createLodge, deleteLodge } from "../lib/api/lodges";

function getErrorCode(error: unknown): string | undefined {
  if (typeof error === "object" && error !== null && "code" in error) {
    return error.code as string;
  }
}

function handleError(error: unknown) {
  const errorCode = getErrorCode(error);

  if (errorCode) {
    if (errorCode === "23505") {
      throw new ActionError({
        code: "CONFLICT",
        message: "A lodge with that name already exists.",
      });
    }
  }

  throw error;
}

export const server = {
  createLodge: defineAction({
    accept: "json",
    async handler(input) {
      const name = input?.name;

      if (typeof name !== "string" || !name.trim()) {
        throw new Error("Missing lodge name.");
      }

      try {
        return await createLodge(name.trim());
      } catch (error) {
        handleError(error);
      }
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
