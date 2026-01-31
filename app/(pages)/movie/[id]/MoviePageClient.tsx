"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import CategoryBar from "@/app/components/CategoryBar";
import Footer from "@/app/components/Footer";
import MovieSection from "@/app/components/MovieSection";
import { Movie } from "@/types/movie";
import { getMovieById, getMoviesByGenreSample, getLatestMovies, toMovie, toMovies } from "@/lib/supabase";
import { StarIcon, PlayIcon, ClockIcon, CalendarIcon } from "@heroicons/react/24/solid";

function shuffleArray<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export default function MoviePageClient({ movieId }: { movieId: number }) {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [relatedMovies, setRelatedMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMovie() {
      setLoading(true);
      try {
        const data = await getMovieById(movieId);
        if (data) {
          const movieData = toMovie(data);
          setMovie(movieData);

          // Fetch a small pool (by genre or latest), then randomise for Film Serupa — no full DB scan
          const pool = movieData.genre
            ? await getMoviesByGenreSample(movieData.genre.split(",")[0].trim(), 50)
            : await getLatestMovies(50);
          const list = toMovies(pool).filter((m) => m.id !== movieId);
          setRelatedMovies(shuffleArray(list).slice(0, 10));
        }
      } catch (error) {
        console.error("Error fetching movie:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchMovie();
  }, [movieId]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <CategoryBar />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading movie...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <CategoryBar />
        <div className="movie-not-found">
          <h1>Film tidak ditemukan</h1>
          <Link href="/">Kembali ke Beranda</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <CategoryBar />

      <div className="movie-detail">
        <div className="movie-detail-header">
          <div className="movie-poster">
            <img src={movie.image} alt={movie.title} />
            {movie.link1 ? (
              <Link
                href={`/redirect?url=${encodeURIComponent(
                  movie.link1
                )}&title=${encodeURIComponent(movie.title)}`}
                className="play-button"
                target="_blank"
                rel="noopener noreferrer"
              >
                <PlayIcon className="w-12 h-12" />
              </Link>
            ) : (
              <button className="play-button">
                <PlayIcon className="w-12 h-12" />
              </button>
            )}
          </div>

          <div className="movie-info">
            <h1>{movie.title}</h1>

            <div className="movie-meta">
              <span className="rating">
                <StarIcon className="w-5 h-5" />
                {movie.rating}
              </span>
              <span className="year">
                <CalendarIcon className="w-5 h-5" />
                {movie.year}
              </span>
              {movie.duration && (
                <span className="duration">
                  <ClockIcon className="w-5 h-5" />
                  {movie.duration}
                </span>
              )}
              {movie.episodes && (
                <span className="episodes">{movie.episodes} Episodes</span>
              )}
              {movie.isHD && <span className="hd-badge">HD</span>}
              {movie.quality && (
                <span className="quality-badge">{movie.quality}</span>
              )}
              {movie.maturity && (
                <span className="maturity-badge">{movie.maturity}</span>
              )}
            </div>

            <div className="movie-genres">
              {movie.genre.split(",").map((g) => (
                <Link
                  key={g.trim()}
                  href={`/genre/${g.trim().toLowerCase()}`}
                  className="genre-tag"
                >
                  {g.trim()}
                </Link>
              ))}
            </div>

            <div className="movie-description">
              <h3>Sinopsis</h3>
              <p>
                {movie.title} adalah film {movie.genre} yang dirilis pada tahun{" "}
                {movie.year}. Film ini mendapatkan rating {movie.rating} dari
                penonton. Nikmati pengalaman menonton yang seru dengan kualitas{" "}
                {movie.quality || (movie.isHD ? "HD" : "Standard")}.
              </p>
            </div>

            <div className="movie-actions">
              {movie.link1 && (
                <Link
                  href={`/redirect?url=${encodeURIComponent(
                    movie.link1
                  )}&title=${encodeURIComponent(movie.title)}`}
                  className="btn-watch"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <PlayIcon className="w-5 h-5" />
                  Tonton Sekarang
                </Link>
              )}
              {movie.link2 && (
                <Link
                  href={`/redirect?url=${encodeURIComponent(
                    movie.link2
                  )}&title=${encodeURIComponent(movie.title)}`}
                  className="btn-download"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download
                </Link>
              )}
              {!movie.link1 && (
                <button className="btn-watch">
                  <PlayIcon className="w-5 h-5" />
                  Tonton Sekarang
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {relatedMovies.length > 0 && (
        <MovieSection
          title="Film Serupa"
          movies={relatedMovies}
          viewAllText="SEMUA"
          viewAllLink={
            movie.genre
              ? `/genre/${movie.genre.split(",")[0].trim().toLowerCase()}`
              : "/"
          }
          boxed={true}
        />
      )}

      <Footer />
    </div>
  );
}


