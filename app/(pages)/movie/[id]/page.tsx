import type { Metadata } from "next";
import { unstable_cache } from "next/cache";
import MoviePageClient from "./MoviePageClient";
import { getMovieById, toMovie } from "@/lib/supabase-server";
import { guardDataRoute } from "@/lib/requestGuard";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const movieId = Number(id);
  const movieRow =
    Number.isFinite(movieId) ? await getMovieById(movieId) : null;
  const movieTitle = movieRow?.title ?? null;

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
  const guard = await guardDataRoute(`/movie/${id}`);
  if (guard) throw guard;
  const movieId = Number(id);
  const movieRow = Number.isFinite(movieId)
    ? await unstable_cache(
        () => getMovieById(movieId),
        ["movie", String(movieId)],
        { revalidate: 60 }
      )()
    : null;
  const initialMovie = movieRow ? toMovie(movieRow) : null;
  return (
    <MoviePageClient
      key={movieId}
      movieId={movieId}
      initialMovie={initialMovie}
    />
  );
}
