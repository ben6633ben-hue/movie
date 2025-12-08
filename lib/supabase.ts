import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Create client only if URL is available
export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// Types matching your actual database schema
export interface MovieRow {
  id: number;
  title: string;
  url: string;
  year: string;
  genre: string;
  rating: string;
  maturity: string;
  quality: string;
  duration: string;
  image_url: string;
  link_1: string;
  link_2: string;
  created_at: string;
  updatedat: string;
}

// Fetch all movies
export async function getAllMovies() {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("movies")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching movies:", error);
    return [];
  }
  return data as MovieRow[];
}

// Fetch movies by genre
export async function getMoviesByGenre(genre: string) {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("movies")
    .select("*")
    .ilike("genre", `%${genre}%`)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching movies by genre:", error);
    return [];
  }
  return data as MovieRow[];
}

// Fetch movies by year
export async function getMoviesByYear(year: string) {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("movies")
    .select("*")
    .eq("year", year)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching movies by year:", error);
    return [];
  }
  return data as MovieRow[];
}

// Fetch single movie by ID
export async function getMovieById(id: number) {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("movies")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching movie:", error);
    return null;
  }
  return data as MovieRow;
}

// Search movies by title
export async function searchMovies(query: string) {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("movies")
    .select("*")
    .ilike("title", `%${query}%`)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error searching movies:", error);
    return [];
  }
  return data as MovieRow[];
}

// Fetch featured movies (high rating)
export async function getFeaturedMovies(limit = 15) {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("movies")
    .select("*")
    .order("rating", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching featured movies:", error);
    return [];
  }
  return data as MovieRow[];
}

// Fetch latest movies
export async function getLatestMovies(limit = 20) {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("movies")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching latest movies:", error);
    return [];
  }
  return data as MovieRow[];
}

// Fetch movies by quality (HD, CAM, etc.)
export async function getMoviesByQuality(quality: string) {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("movies")
    .select("*")
    .ilike("quality", `%${quality}%`)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching movies by quality:", error);
    return [];
  }
  return data as MovieRow[];
}

// Fetch movies with pagination
export async function getMoviesPaginated(page: number, pageSize = 24) {
  if (!supabase) return { movies: [], total: 0 };

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from("movies")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Error fetching paginated movies:", error);
    return { movies: [], total: 0 };
  }
  return { movies: data as MovieRow[], total: count || 0 };
}

// Get total movie count
export async function getMovieCount() {
  if (!supabase) return 0;

  const { count, error } = await supabase
    .from("movies")
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error("Error getting movie count:", error);
    return 0;
  }
  return count || 0;
}

// Search movies by title containing keyword
export async function searchMoviesByKeyword(keyword: string) {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("movies")
    .select("*")
    .ilike("title", `%${keyword}%`)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error searching movies:", error);
    return [];
  }
  return data as MovieRow[];
}

// Get movies that might be series
export async function getSeriesMovies() {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("movies")
    .select("*")
    .or(
      "title.ilike.%series%,title.ilike.%season%,title.ilike.%episode%,title.ilike.%S01%,title.ilike.%S02%"
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching series:", error);
    return getAllMovies();
  }
  return data as MovieRow[];
}

// Helper to convert MovieRow to frontend Movie type
export function toMovie(row: MovieRow) {
  return {
    id: row.id,
    title: row.title,
    image: row.image_url,
    genre: row.genre,
    rating: parseFloat(row.rating) || 0,
    year: parseInt(row.year) || 2024,
    duration: row.duration || undefined,
    isHD:
      row.quality?.toLowerCase().includes("hd") ||
      row.quality?.toLowerCase().includes("bluray"),
    url: row.url,
    maturity: row.maturity,
    quality: row.quality,
    link1: row.link_1,
    link2: row.link_2,
  };
}

// Convert array of MovieRows to Movie array
export function toMovies(rows: MovieRow[]) {
  return rows.map(toMovie);
}
