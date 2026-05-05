import { supabase } from "../../supabase-client";

export async function getLodges() {
  return supabase.from("lodges").select("*").order("name", { ascending: true });
}

export async function createLodge(name: string) {
  const { data, error } = await supabase
    .from("lodges")
    .insert({ name })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteLodge(id: string) {
  const { error } = await supabase.from("lodges").delete().eq("id", id);

  if (error) {
    throw error;
  }
}
