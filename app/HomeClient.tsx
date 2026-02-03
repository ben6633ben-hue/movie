"use client";

import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import CategoryBar from "./components/CategoryBar";
import MovieSection from "./components/MovieSection";
import MovieGrid from "./components/MovieGrid";
import TabBar from "./components/TabBar";
import FeaturedButton from "./components/FeaturedButton";
import AdBanner from "./components/AdBanner";
import Footer from "./components/Footer";
import { Movie } from "@/types/movie";
import { FEATURED_TITLE_PRIORITY } from "@/lib/featured";
import {
  getFeaturedMoviesForHomepage,
  getMoviesByYearsSample,
  getMoviesByGenreSample,
  getMoviesByGenreAndYearsSample,
  toMovies,
} from "@/lib/supabase";

const TERBARU_YEARS = ["2026", "2025"];

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export default function HomeClient() {
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);
  const [latestMovies, setLatestMovies] = useState<Movie[]>([]);
  const [actionMovies, setActionMovies] = useState<Movie[]>([]);
  const [horrorMovies, setHorrorMovies] = useState<Movie[]>([]);
  const [romanceMovies, setRomanceMovies] = useState<Movie[]>([]);
  const [comedyMovies, setComedyMovies] = useState<Movie[]>([]);
  const [dramaMovies, setDramaMovies] = useState<Movie[]>([]);
  const [thrillerMovies, setThrillerMovies] = useState<Movie[]>([]);
  const [familyMovies, setFamilyMovies] = useState<Movie[]>([]);
  const [gridMovies, setGridMovies] = useState<Movie[]>([]);
  const [recMovies, setRecMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMovies() {
      try {
        const [featured, latest, action, horror, romance, comedy, drama, thriller, family] =
          await Promise.all([
            getFeaturedMoviesForHomepage(FEATURED_TITLE_PRIORITY, 15),
            getMoviesByYearsSample(TERBARU_YEARS, 50),
            getMoviesByGenreAndYearsSample("Action", TERBARU_YEARS, 15),
            getMoviesByGenreAndYearsSample("Horror", TERBARU_YEARS, 15),
            getMoviesByGenreAndYearsSample("Romance", TERBARU_YEARS, 15),
            getMoviesByGenreAndYearsSample("Comedy", TERBARU_YEARS, 15),
            getMoviesByGenreAndYearsSample("Drama", TERBARU_YEARS, 15),
            getMoviesByGenreAndYearsSample("Thriller", TERBARU_YEARS, 15),
            getMoviesByGenreSample("Family", 15),
          ]);
        setFeaturedMovies(toMovies(featured));
        const latestList = toMovies(latest);
        setLatestMovies(latestList.slice(0, 15));
        setGridMovies(latestList.slice(0, 48));
        setRecMovies(shuffle(latestList).slice(0, 15));
        setActionMovies(toMovies(action));
        setHorrorMovies(toMovies(horror));
        setRomanceMovies(toMovies(romance));
        setComedyMovies(toMovies(comedy));
        setDramaMovies(toMovies(drama));
        setThrillerMovies(toMovies(thriller));
        setFamilyMovies(toMovies(family));
      } catch (error) {
        console.error("Unexpected error in fetchMovies:", {
          error,
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        });
      } finally {
        setLoading(false);
      }
    }
    fetchMovies();
  }, []);

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

      <MovieSection
        title="TOP BULAN INI"
        movies={featuredMovies}
        viewAllText="SEMUA"
        viewAllLink="/popular/rating"
        boxed={true}
      />

      <MovieSection
        title="Rekomendasi Untukmu"
        movies={recMovies}
        viewAllText="SEMUA"
        viewAllLink="/rekomendasi"
        boxed={true}
      />

      {familyMovies.length > 0 && (
        <MovieSection
          title="Nonton Bareng Keluarga"
          movies={familyMovies}
          viewAllText="SEMUA"
          viewAllLink="/genre/family"
          boxed={true}
        />
      )}

      <AdBanner text="Download Lk21 Android" />

      <MovieSection
        title="Action Terbaru"
        movies={actionMovies}
        viewAllText="SEMUA"
        viewAllLink="/genre/action"
        boxed={true}
      />

      <MovieSection
        title="Horror Terbaru"
        movies={horrorMovies}
        viewAllText="SEMUA"
        viewAllLink="/genre/horror"
        boxed={true}
      />

      <MovieSection
        title="Romance Terbaru"
        movies={romanceMovies}
        viewAllText="SEMUA"
        viewAllLink="/genre/romance"
        boxed={true}
      />

      <MovieSection
        title="Comedy Terbaru"
        movies={comedyMovies}
        viewAllText="SEMUA"
        viewAllLink="/genre/comedy"
        boxed={true}
      />

      {/* Ad Banner 2 */}
      <AdBanner text="Nonton Film Gratis di Lk21" />

      {/* Daftar Lengkap Film Terbaru - Grid Layout (2025/2026) */}
      <MovieGrid
        title="Daftar Lengkap Film Terbaru"
        movies={gridMovies}
        initialCount={24}
        increment={12}
        viewAllLink="/popular/new"
      />

      <Footer />
    </div>
  );
}
