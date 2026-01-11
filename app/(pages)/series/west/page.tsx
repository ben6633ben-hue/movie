"use client";

import Navbar from "@/app/components/Navbar";
import CategoryBar from "@/app/components/CategoryBar";
import Footer from "@/app/components/Footer";
import MovieCard from "@/app/components/MovieCard";
import PageHeader from "@/app/components/PageHeader";
import { seriesMovies, seriesUpdate } from "@/app/data/movies";

export default function SeriesWestPage() {
  // Western series (non-Asian)
  const westSeries = [...seriesMovies, ...seriesUpdate]
    .filter((m) => m.episodes)
    .slice(0, 20);

  return (
    <div className="min-h-screen">
      <Navbar />
      <CategoryBar />

      <PageHeader 
        breadcrumb="Series West"
        totalItems={westSeries.length}
      />

      <div className="listing-page">
        <div className="movie-grid">
          {westSeries.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}

