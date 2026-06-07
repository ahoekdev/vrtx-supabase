import { defineMiddleware } from "astro:middleware";

import { createClient } from "./lib/supabase";

export const onRequest = defineMiddleware(async (context, next) => {
  const supabase = createClient(context);
  const { data } = await supabase.auth.getClaims();

  context.locals.isLoggedIn = Boolean(data?.claims);

  return next();
});
