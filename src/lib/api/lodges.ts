import { type SupabaseClient } from "@supabase/supabase-js";
import { createClient, type SupabaseContext } from "../supabase";

export async function getLodges(context: SupabaseContext) {
  return createClient(context)
    .from("lodges")
    .select("*")
    .order("name", { ascending: true });
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
