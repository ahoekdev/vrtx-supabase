import { createServerClient, parseCookieHeader } from "@supabase/ssr";
import type { APIContext } from "astro";

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export type SupabaseContext = Pick<APIContext, "request" | "cookies">;

export function createClient({ request, cookies }: SupabaseContext) {
  const cookieHeader = request.headers.get("Cookie") || "";

  return createServerClient(supabaseUrl, supabaseKey, {
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
