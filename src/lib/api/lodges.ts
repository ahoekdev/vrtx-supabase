import { supabase } from "../../supabase-client";

export async function getLodges() {
  return supabase.from("lodges").select("*").order("name", { ascending: true });
}

export async function createLodge(name: string) {
  await supabase
    .from("lodges")
    .insert({ name })
    .single()
    .then(({ data, error }) => {
      if (error) {
        console.error(error);
      } else {
        console.log(data);
      }
    });
}
