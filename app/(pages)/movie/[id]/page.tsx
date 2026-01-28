import type { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";
import MoviePageClient from "./MoviePageClient";

async function getMovieTitleById(id: number): Promise<string | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  if (!supabaseUrl || !supabaseAnonKey) return null;

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data, error } = await supabase
      .from("movies")
      .select("title")
      .eq("id", id)
      .single();

    if (error || !data?.title) return null;
    return data.title as string;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const movieId = Number(id);
  const movieTitle = Number.isFinite(movieId)
    ? await getMovieTitleById(movieId)
    : null;

  const title = movieTitle
    ? `Nonton ${movieTitle} Gratis di LK21 (Layarkaca21) Sub Indo`
    : "Nonton Film Gratis di LK21 (Layarkaca21) Sub Indo";

  return { title };
}

export default async function MoviePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const movieId = Number(id);
  return <MoviePageClient movieId={movieId} />;
}
