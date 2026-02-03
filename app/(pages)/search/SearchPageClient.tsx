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
import { searchMoviesPaginated, toMovies } from "@/lib/supabase";

const ITEMS_PER_PAGE = 24;

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [movies, setMovies] = useState<Movie[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [query]);

  useEffect(() => {
    const q = query.trim();
    if (!q || q.length < 2) {
      setMovies([]);
      setTotal(0);
      setLoading(false);
      return;
    }
    async function fetchResults() {
      setLoading(true);
      try {
        const { movies: rows, total: totalCount } = await searchMoviesPaginated(
          q,
          currentPage,
          ITEMS_PER_PAGE
        );
        setMovies(toMovies(rows));
        setTotal(totalCount);
      } catch (error) {
        console.error("Error searching movies:", error);
        setMovies([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    }
    fetchResults();
  }, [query, currentPage]);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE) || 1;
  const paginatedMovies = movies;

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
        totalItems={total}
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

export default function SearchPageClient() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchResults />
    </Suspense>
  );
}
