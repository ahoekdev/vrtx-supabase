import { type SupabaseClient } from "@supabase/supabase-js";
import { createClient, type SupabaseContext } from "../supabase";

interface GetLodgesOptions {
  limit?: number;
}

export function getLodges(
  context: SupabaseContext,
  options: GetLodgesOptions = {},
) {
  let query = createClient(context)
    .from("lodges")
    .select("*")
    .order("name", { ascending: true });

  if (options.limit) {
    query = query.limit(options.limit);
  }

  return query;
}

export function getLodgeBySlug(
  context: SupabaseContext,
  slug: string,
) {
  return createClient(context)
    .from("lodges")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
}

interface CreateLodgeDTO {
  name: string;
}

export async function createLodge(
  { name }: CreateLodgeDTO,
  client: SupabaseClient,
) {
  const { data, error } = await client
    .from("lodges")
    .insert({ name })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteLodge(id: string, client: SupabaseClient) {
  const { error } = await client.from("lodges").delete().eq("id", id);

  if (error) {
    throw error;
  }
}
