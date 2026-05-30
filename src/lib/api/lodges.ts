import { type SupabaseClient } from "@supabase/supabase-js";
import { createClient, type SupabaseContext } from "../supabase";
import { type Tables } from "../database.types";

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

export function getLodgeBySlug(context: SupabaseContext, slug: string) {
  return createClient(context)
    .from("lodges")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
}

type NeighbouringLodge = Pick<Tables<"lodges">, "id" | "name" | "slug">;

export async function getNeighbouringLodges(
  context: SupabaseContext,
  lodgeId: string,
) {
  const { data, error } = await createClient(context)
    .from("stages")
    .select(
      `
      from:lodges!from_lodge_id(id, name, slug),
      to:lodges!to_lodge_id(id, name, slug)
    `,
    )
    .or(`from_lodge_id.eq.${lodgeId},to_lodge_id.eq.${lodgeId}`);

  if (error) {
    throw error;
  }

  const neighbouringLodges = new Map<string, NeighbouringLodge>();

  for (const stage of data ?? []) {
    const neighbour = stage.from.id === lodgeId ? stage.to : stage.from;

    if (!neighbouringLodges.has(neighbour.id)) {
      neighbouringLodges.set(neighbour.id, neighbour);
    }
  }

  return Array.from(neighbouringLodges.values());
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
