import { ActionError } from "astro:actions";

function getErrorCode(error: unknown): string | undefined {
  if (typeof error === "object" && error !== null && "code" in error) {
    return error.code as string;
  }
}

export function handleError(error: unknown) {
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
