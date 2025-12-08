"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Navbar from "@/app/components/Navbar";
import CategoryBar from "@/app/components/CategoryBar";
import Footer from "@/app/components/Footer";
import MovieCard from "@/app/components/MovieCard";
import PageHeader from "@/app/components/PageHeader";
import Pagination from "@/app/components/Pagination";
import { Movie } from "@/types/movie";
import { searchMovies, toMovies } from "@/lib/supabase";

const ITEMS_PER_PAGE = 24;

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function fetchResults() {
      if (!query) {
        setMovies([]);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        const data = await searchMovies(query);
        setMovies(toMovies(data));
      } catch (error) {
        console.error("Error searching movies:", error);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    }
    fetchResults();
    setCurrentPage(1);
  }, [query]);

  // Pagination
  const totalPages = Math.ceil(movies.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedMovies = movies.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <CategoryBar />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Mencari film...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <CategoryBar />

      <PageHeader 
        breadcrumb={`Pencarian "${query}"`}
        totalItems={movies.length}
        currentPage={currentPage}
        totalPages={totalPages}
      />

      <div className="listing-page">
        {paginatedMovies.length > 0 ? (
          <>
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
          </>
        ) : (
          <div className="no-results">
            <p>Tidak ada film yang ditemukan untuk &quot;{query}&quot;</p>
            <p>Coba kata kunci lain atau jelajahi kategori kami.</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchResults />
    </Suspense>
  );
}
