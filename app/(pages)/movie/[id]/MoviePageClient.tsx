"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import NextImage from "next/image";
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

function isDirectVideoUrl(url: string): boolean {
  const u = url.toLowerCase().trim();
  return (
    u.endsWith(".mp4") ||
    u.endsWith(".webm") ||
    u.endsWith(".m3u8") ||
    u.endsWith(".mkv") ||
    u.includes(".m3u8?") ||
    u.includes("/stream/") ||
    u.includes("/video/")
  );
}

function isHlsUrl(url: string): boolean {
  const u = url.toLowerCase().trim();
  return u.endsWith(".m3u8") || u.includes(".m3u8?");
}

/** Domains that block embedding (X-Frame-Options / CSP). Show "Open in new tab" instead of iframe. */
const EMBED_BLOCKED_HOSTS = ["playeriframe.sbs"];

function isEmbedBlocked(url: string): boolean {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return EMBED_BLOCKED_HOSTS.some(
      (d) => host === d || host.endsWith("." + d)
    );
  } catch {
    return false;
  }
}

export default function MoviePageClient({
  movieId,
  initialMovie = null,
}: {
  movieId: number;
  initialMovie?: Movie | null;
}) {
  const [movie, setMovie] = useState<Movie | null>(initialMovie ?? null);
  const [relatedMovies, setRelatedMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(!initialMovie);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<import("hls.js").default | null>(null);

  const streamUrl = movie?.link1?.trim() || null;
  const wouldUseIframe = streamUrl ? !isDirectVideoUrl(streamUrl) : false;
  const useIframe = wouldUseIframe && streamUrl && !isEmbedBlocked(streamUrl);
  const embedBlocked = wouldUseIframe && streamUrl && isEmbedBlocked(streamUrl);

  useEffect(() => {
    if (!streamUrl || !isHlsUrl(streamUrl) || !videoRef.current) return;
    const video = videoRef.current;
    const canPlayHls =
      video.canPlayType("application/vnd.apple.mpegurl") ||
      video.canPlayType("application/x-mpegURL");
    if (canPlayHls) {
      video.src = streamUrl;
      return;
    }
    import("hls.js").then((Hls) => {
      if (!Hls.default.isSupported()) return;
      const hls = new Hls.default();
      hlsRef.current = hls;
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
    }).catch(() => {});
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [streamUrl]);

  useEffect(() => {
    async function fetchData() {
      try {
        let movieData: Movie | null = initialMovie ?? null;
        if (!movieData) {
          const data = await getMovieById(movieId);
          movieData = data ? toMovie(data) : null;
          setMovie(movieData);
        }

        if (movieData) {
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
    fetchData();
  }, [movieId, initialMovie]);

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
        <div className="movie-detail-layout">
          {/* Left: video (YouTube-style) */}
          <div className="movie-detail-left">
            <div className="movie-player-section">
              {streamUrl ? (
                <>
                  {embedBlocked ? (
                    <div className="movie-player-blocked">
                      <p className="movie-player-blocked-text">
                        Video tidak dapat ditampilkan di sini (pembatasan situs).
                      </p>
                      <a
                        href={streamUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="movie-player-open-btn"
                        aria-label="Buka di tab baru untuk nonton"
                      >
                        <PlayIcon className="w-6 h-6" aria-hidden />
                        Buka di tab baru untuk nonton
                      </a>
                    </div>
                  ) : useIframe ? (
                    <iframe
                      src={streamUrl}
                      title={movie.title}
                      className="movie-player-iframe"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                      allowFullScreen
                      sandbox="allow-scripts allow-same-origin allow-presentation"
                    />
                  ) : (
                    <video
                      ref={videoRef}
                      src={isHlsUrl(streamUrl) ? undefined : streamUrl}
                      controls
                      className="movie-player-video"
                      playsInline
                      crossOrigin="anonymous"
                      aria-label={`Memutar video: ${movie.title}`}
                    />
                  )}
                  {!embedBlocked && (
                    <div className="movie-player-fallback">
                      <a
                        href={streamUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="movie-player-open-new"
                        aria-label="Buka di tab baru jika video tidak tampil"
                      >
                        Buka di tab baru jika video tidak tampil
                      </a>
                    </div>
                  )}
                </>
              ) : (
                <div className="movie-player-placeholder relative block w-full aspect-video overflow-hidden">
                  <NextImage src={movie.image} alt={movie.title} fill className="object-cover" sizes="(max-width:768px) 100vw, 70vw" />
                  <span className="movie-player-no-stream">Tonton tidak tersedia</span>
                </div>
              )}
            </div>
          </div>

          <div className="movie-detail-right">
            <div className="movie-poster movie-poster-thumb relative block w-full aspect-[2/3] overflow-hidden rounded">
              <NextImage src={movie.image} alt={movie.title} fill className="object-cover" sizes="200px" />
            </div>
            <h1 className="movie-sidebar-title">{movie.title}</h1>
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
            {movie.link2 && (
              <a
                href={movie.link2}
                className="btn-download"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Download ${movie.title}`}
              >
                Download
              </a>
            )}
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


