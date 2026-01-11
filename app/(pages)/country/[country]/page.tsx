"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import CategoryBar from "@/app/components/CategoryBar";
import Footer from "@/app/components/Footer";
import MovieCard from "@/app/components/MovieCard";
import PageHeader from "@/app/components/PageHeader";
import Pagination from "@/app/components/Pagination";
import {
  koreaTerbaru,
  thailandTerbaru,
  indiaTerbaru,
  featuredMovies,
  latestMovies,
} from "@/app/data/movies";

const ITEMS_PER_PAGE = 24;

const countryMovieMap: Record<string, typeof koreaTerbaru> = {
  korea: koreaTerbaru,
  thailand: thailandTerbaru,
  india: indiaTerbaru,
};

export default function CountryPage() {
  const params = useParams();
  const country = params.country as string;
  const countryName = country.charAt(0).toUpperCase() + country.slice(1);
  const [currentPage, setCurrentPage] = useState(1);

  // Get movies for this country
  const countryMovies = countryMovieMap[country.toLowerCase()] || [];

  // If no specific country movies, show all movies as fallback
  const moviesToShow = countryMovies.length > 0 
    ? countryMovies 
    : [...featuredMovies, ...latestMovies].slice(0, 50);

  // Pagination
  const totalPages = Math.ceil(moviesToShow.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedMovies = moviesToShow.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <CategoryBar />

      <PageHeader 
        breadcrumb={`Negara ${countryName}`}
        totalItems={moviesToShow.length}
        currentPage={currentPage}
        totalPages={totalPages}
      />

      <div className="listing-page">
        <div className="movie-grid">
          {paginatedMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>

      <Footer />
    </div>
  );
}
