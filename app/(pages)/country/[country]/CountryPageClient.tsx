"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import CategoryBar from "@/app/components/CategoryBar";
import Footer from "@/app/components/Footer";
import MovieCard from "@/app/components/MovieCard";
import PageHeader from "@/app/components/PageHeader";
import Pagination from "@/app/components/Pagination";
import { Movie } from "@/types/movie";
import { getMoviesByGenrePaginated, toMovies } from "@/lib/supabase-client";

const ITEMS_PER_PAGE = 24;

const countryToGenre: Record<string, string> = {
  "united-states": "United States",
  "united-kingdom": "United Kingdom",
  australia: "Australia",
  china: "China",
  "hong-kong": "Hong Kong",
  india: "India",
  indonesia: "Indonesia",
  italy: "Italy",
  japan: "Japan",
  germany: "Germany",
  canada: "Canada",
  korea: "Korea",
  malaysia: "Malaysia",
  mexico: "Mexico",
  france: "France",
  philippines: "Philippines",
  romania: "Romania",
  russia: "Russia",
  taiwan: "Taiwan",
  thailand: "Thailand",
  spain: "Spain",
  turkey: "Turkey",
  vietnam: "Vietnam",
  netherlands: "Netherlands",
};

const slugToDisplayName: Record<string, string> = {
  "united-states": "United States",
  "united-kingdom": "United Kingdom",
  australia: "Australia",
  china: "China",
  "hong-kong": "Hong Kong",
  india: "India",
  indonesia: "Indonesia",
  italy: "Italy",
  japan: "Japan",
  germany: "Germany",
  canada: "Canada",
  korea: "Korea",
  malaysia: "Malaysia",
  mexico: "Mexico",
  france: "France",
  philippines: "Philippines",
  romania: "Romania",
  russia: "Russia",
  taiwan: "Taiwan",
  thailand: "Thailand",
  spain: "Spain",
  turkey: "Turkey",
  vietnam: "Vietnam",
  netherlands: "Netherlands",
};

function slugToTitle(slug: string): string {
  const s = slug.toLowerCase().trim();
  return (
    slugToDisplayName[s] ??
    s
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ")
  );
}

function getGenreSearch(countrySlug: string): { single: string } {
  const slug = countrySlug.toLowerCase().trim();
  const single = countryToGenre[slug] ?? slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  return { single };
}

export default function CountryPageClient() {
  const params = useParams();
  const country = params.country as string;
  const countryName = country ? slugToTitle(country) : "";
  const [movies, setMovies] = useState<Movie[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [country]);

  useEffect(() => {
    if (!country) return;
    const search = getGenreSearch(country);
    async function fetchMovies() {
      setLoading(true);
      try {
        const result = await getMoviesByGenrePaginated(
          search.single,
          currentPage,
          ITEMS_PER_PAGE
        );
        setMovies(toMovies(result.movies));
        setTotal(result.total);
      } catch (error) {
        console.error("Error fetching movies for country:", error);
        setMovies([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    }
    fetchMovies();
  }, [country, currentPage]);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE) || 1;
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
            <p className="text-gray-600">Loading...</p>
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
        breadcrumb={`Negara ${countryName}`}
        totalItems={total}
        currentPage={currentPage}
        totalPages={totalPages}
      />

      <div className="listing-page">
        {movies.length > 0 ? (
          <>
            <div className="movie-grid">
              {movies.map((movie) => (
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
            <p>Tidak ada film untuk negara {countryName}.</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
