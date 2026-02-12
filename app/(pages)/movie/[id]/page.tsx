import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { unstable_cache } from "next/cache";
import MoviePageClient from "./MoviePageClient";
import { getMovieById, toMovie } from "@/lib/supabase-server";
import { guardDataRoute } from "@/lib/requestGuard";
import { parseMovieSlug } from "@/lib/slug";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id: slug } = await params;
  const movieId = parseMovieSlug(slug);
  const movieRow =
    movieId != null ? await getMovieById(movieId) : null;
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
  const { id: slug } = await params;
  const guard = await guardDataRoute(`/movie/${slug}`);
  if (guard) throw guard;
  const movieId = parseMovieSlug(slug);
  const movieRow =
    movieId != null
      ? await unstable_cache(
          () => getMovieById(movieId),
          ["movie", String(movieId)],
          { revalidate: 60 }
        )()
      : null;
  if (movieId == null || !movieRow) notFound();
  const initialMovie = toMovie(movieRow);
  return (
    <MoviePageClient
      key={movieId}
      movieId={movieId}
      initialMovie={initialMovie}
    />
  );
}
