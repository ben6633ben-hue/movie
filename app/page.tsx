"use client";

import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import CategoryBar from "./components/CategoryBar";
import MovieSection from "./components/MovieSection";
import MovieGrid from "./components/MovieGrid";
import TabBar from "./components/TabBar";
import AnnouncementBar from "./components/AnnouncementBar";
import FeaturedButton from "./components/FeaturedButton";
import AdBanner from "./components/AdBanner";
import Footer from "./components/Footer";
import { Movie } from "@/types/movie";
import { getAllMovies, toMovies } from "@/lib/supabase";

export default function Home() {
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMovies() {
      try {
        const data = await getAllMovies();
        setAllMovies(toMovies(data));
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchMovies();
  }, []);

  // Filter movies by genre
  const getByGenre = (genre: string, limit = 15) => {
    return allMovies
      .filter((m) => m.genre?.toLowerCase().includes(genre.toLowerCase()))
      .slice(0, limit);
  };

  // Get featured (highest rated)
  const featuredMovies = [...allMovies]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 15);

  // Get latest movies
  const latestMovies = allMovies.slice(0, 15);

  // Filter by different genres
  const actionMovies = getByGenre("action");
  const horrorMovies = getByGenre("horror");
  const romanceMovies = getByGenre("romance");
  const comedyMovies = getByGenre("comedy");
  const dramaMovies = getByGenre("drama");
  const thrillerMovies = getByGenre("thriller");
  const familyMovies = getByGenre("family");

  // For grid section - all movies
  const allMoviesForGrid = allMovies.slice(0, 48);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <CategoryBar />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading movies...</p>
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

      {/* Featured Movies Section - Black Background */}
      <div className="featured-section">
        <MovieSection
          movies={featuredMovies}
          showViewAll={false}
          showTitle={false}
          cardSize="large"
        />
        <FeaturedButton />
      </div>

      {/* Announcement */}
      {/* <AnnouncementBar /> */}

      {/* Tab Navigation */}
      <TabBar />

      {/* Latest Movies Section */}
      <MovieSection
        title="Film Terbaru"
        movies={latestMovies}
        viewAllText="SEMUA"
        viewAllLink="/popular/new"
        boxed={true}
      />

      {/* Drama */}
      <MovieSection
        title="Drama Terbaru"
        movies={dramaMovies}
        viewAllText="SEMUA"
        viewAllLink="/genre/drama"
        boxed={true}
      />

      {/* Thriller */}
      <MovieSection
        title="Thriller Terbaru"
        movies={thrillerMovies}
        viewAllText="SEMUA"
        viewAllLink="/genre/thriller"
        boxed={true}
      />

      {/* Top Movies */}
      <MovieSection
        title="TOP BULAN INI"
        movies={featuredMovies}
        viewAllText="SEMUA"
        viewAllLink="/popular/rating"
        boxed={true}
      />

      {/* Rekomendasi */}
      <MovieSection
        title="Rekomendasi Untukmu"
        movies={[...allMovies].sort(() => Math.random() - 0.5).slice(0, 15)}
        viewAllText="SEMUA"
        viewAllLink="/rekomendasi"
        boxed={true}
      />

      {/* Family Movies */}
      {familyMovies.length > 0 && (
        <MovieSection
          title="Nonton Bareng Keluarga"
          movies={familyMovies}
          viewAllText="SEMUA"
          viewAllLink="/genre/family"
          boxed={true}
        />
      )}

      {/* Ad Banner 1 */}
      <AdBanner text="Download Lk21 Android" />

      {/* Action Terbaru */}
      <MovieSection
        title="Action Terbaru"
        movies={actionMovies}
        viewAllText="SEMUA"
        viewAllLink="/genre/action"
        boxed={true}
      />

      {/* Horror Terbaru */}
      <MovieSection
        title="Horror Terbaru"
        movies={horrorMovies}
        viewAllText="SEMUA"
        viewAllLink="/genre/horror"
        boxed={true}
      />

      {/* Romance Terbaru */}
      <MovieSection
        title="Romance Terbaru"
        movies={romanceMovies}
        viewAllText="SEMUA"
        viewAllLink="/genre/romance"
        boxed={true}
      />

      {/* Comedy Terbaru */}
      <MovieSection
        title="Comedy Terbaru"
        movies={comedyMovies}
        viewAllText="SEMUA"
        viewAllLink="/genre/comedy"
        boxed={true}
      />

      {/* Ad Banner 2 */}
      <AdBanner text="Nonton Film Gratis di Lk21" />

      {/* Daftar Lengkap Film Terbaru - Grid Layout */}
      <MovieGrid
        title="Daftar Lengkap Film Terbaru"
        movies={allMoviesForGrid}
        initialCount={24}
        increment={12}
        viewAllLink="/movies"
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
