import { createServerClient, parseCookieHeader } from "@supabase/ssr";
import type { APIContext } from "astro";
import type { Database } from "./database.types";

const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseKey = import.meta.env.SUPABASE_KEY;

export type SupabaseContext = Pick<APIContext, "request" | "cookies">;

export function createClient({ request, cookies }: SupabaseContext) {
  const cookieHeader = request.headers.get("Cookie") || "";

  return createServerClient<Database>(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        const cookies = parseCookieHeader(cookieHeader);

        return cookies.map(({ name, value = "" }) => ({
          name,
          value,
        }));
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          cookies.set(name, value, options),
        );
      },
    },
  });
}
