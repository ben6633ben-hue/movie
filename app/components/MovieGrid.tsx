"use client";

import { useState } from "react";
import Link from "next/link";
import MovieCard from "./MovieCard";
import { Movie } from "@/types/movie";

interface Props {
  title: string;
  movies: Movie[];
  initialCount?: number;
  increment?: number;
  viewAllLink?: string;
}

export default function MovieGrid({
  title,
  movies,
  initialCount = 24,
  increment = 12,
  viewAllLink = "/movies",
}: Props) {
  const [visibleCount, setVisibleCount] = useState(initialCount);

  const visibleMovies = movies.slice(0, visibleCount);
  const hasMore = visibleCount < movies.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + increment, movies.length));
  };

  return (
    <section className="movie-grid-section">
      <div className="movie-grid-header">
        <h2 className="section-title">{title}</h2>
        <Link href={viewAllLink} className="view-all-button">
          SEMUA
        </Link>
      </div>

      <div className="movie-grid-container">
        {visibleMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {hasMore && (
        <div className="load-more-wrapper">
          <button className="load-more-btn" onClick={handleLoadMore}>
            Lainnya
          </button>
        </div>
      )}
    </section>
  );
}
