"use client";

import Navbar from "@/app/components/Navbar";
import CategoryBar from "@/app/components/CategoryBar";
import Footer from "@/app/components/Footer";
import MovieCard from "@/app/components/MovieCard";
import PageHeader from "@/app/components/PageHeader";
import { seriesMovies, seriesUpdate } from "@/app/data/movies";

export default function SeriesOngoingPage() {
  // Series with episodes that are still ongoing (simulated)
  const ongoingSeries = [...seriesMovies, ...seriesUpdate]
    .filter((m) => m.episodes && m.episodes < 16)
    .slice(0, 20);

  return (
    <div className="min-h-screen">
      <Navbar />
      <CategoryBar />

      <PageHeader 
        breadcrumb="Series Ongoing"
        totalItems={ongoingSeries.length}
      />

      <div className="listing-page">
        <div className="movie-grid">
          {ongoingSeries.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}

