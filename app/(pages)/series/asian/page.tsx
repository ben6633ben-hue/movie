"use client";

import Navbar from "@/app/components/Navbar";
import CategoryBar from "@/app/components/CategoryBar";
import Footer from "@/app/components/Footer";
import MovieCard from "@/app/components/MovieCard";
import PageHeader from "@/app/components/PageHeader";
import { koreaTerbaru, thailandTerbaru, maratonDrakor } from "@/app/data/movies";

export default function SeriesAsianPage() {
  const asianSeries = [...koreaTerbaru, ...thailandTerbaru, ...maratonDrakor]
    .filter((m) => m.episodes);

  const uniqueSeries = asianSeries.filter(
    (movie, index, self) => index === self.findIndex((m) => m.id === movie.id)
  );

  return (
    <div className="min-h-screen">
      <Navbar />
      <CategoryBar />

      <PageHeader 
        breadcrumb="Series Asian"
        totalItems={uniqueSeries.length}
      />

      <div className="listing-page">
        <div className="movie-grid">
          {uniqueSeries.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}

