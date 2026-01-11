"use client";

import { useRef } from "react";
import Link from "next/link";
import MovieCard from "./MovieCard";
import { Movie } from "@/types/movie";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

interface Props {
  title?: string;
  movies: Movie[];
  showViewAll?: boolean;
  viewAllText?: string;
  viewAllLink?: string;
  cardSize?: "normal" | "large";
  showTitle?: boolean;
  boxed?: boolean;
}

export default function MovieSection({ 
  title, 
  movies, 
  showViewAll = true, 
  viewAllText = "SEMUA",
  viewAllLink = "/popular",
  cardSize = "normal",
  showTitle = true,
  boxed = false
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const { clientWidth, scrollLeft } = scrollRef.current;
    const scrollAmount = clientWidth * 0.7;
    scrollRef.current.scrollTo({
      left:
        direction === "left"
          ? scrollLeft - scrollAmount
          : scrollLeft + scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section className={boxed ? "movie-section-boxed" : "movie-section"}>
      {/* Header */}
      {(showTitle || showViewAll) && (
        <div className="flex items-center justify-between mb-4">
          {showTitle && <h2 className="section-title">{title}</h2>}
          {showViewAll && (
            <Link href={viewAllLink} className="view-all-button">
              {viewAllText}
            </Link>
          )}
        </div>
      )}

      {/* Container for arrows and cards */}
      <div className="relative group">
        {/* Left Arrow */}
        <button
          onClick={() => scroll("left")}
          className="scroll-arrow left-0"
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </button>

        {/* Scrollable movie cards */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-none scroll-smooth"
        >
          {movies.map((movie) => (
            <MovieCard movie={movie} key={movie.id} size={cardSize} />
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll("right")}
          className="scroll-arrow right-0"
        >
          <ChevronRightIcon className="w-6 h-6" />
        </button>
      </div>
    </section>
  );
}
