import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { MovieRow } from "./supabase-types";
import { MOVIE_SELECT, toMovie } from "./supabase-types";

export { toMovie };

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const client: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey && isValidUrl(supabaseUrl)
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      })
    : null;

export async function getMovieById(id: number): Promise<MovieRow | null> {
  if (!client) return null;
  const { data, error } = await client
    .from("movies")
    .select(MOVIE_SELECT)
    .eq("id", id)
    .single();
  if (error) return null;
  return data as MovieRow;
}

