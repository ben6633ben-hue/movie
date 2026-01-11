"use client";

import Navbar from "@/app/components/Navbar";
import CategoryBar from "@/app/components/CategoryBar";
import Footer from "@/app/components/Footer";
import MovieCard from "@/app/components/MovieCard";
import PageHeader from "@/app/components/PageHeader";
import { seriesMovies, maratonDrakor } from "@/app/data/movies";

export default function SeriesCompletePage() {
  // Series with episodes that are complete (simulated as having 16+ episodes)
  const completeSeries = [...seriesMovies, ...maratonDrakor]
    .filter((m) => m.episodes && m.episodes >= 16)
    .slice(0, 20);

  return (
    <div className="min-h-screen">
      <Navbar />
      <CategoryBar />

      <PageHeader 
        breadcrumb="Series Complete"
        totalItems={completeSeries.length}
      />

      <div className="listing-page">
        <div className="movie-grid">
          {completeSeries.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}

