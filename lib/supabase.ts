import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * SECURITY NOTE:
 * This file uses the ANON KEY which should only have READ permissions.
 *
 * IMPORTANT:
 * - ✅ This key is safe to expose in frontend code
 * - ✅ Only SELECT (read) operations are performed here
 * - ❌ Never use SERVICE_ROLE_KEY in frontend code
 * - 🔒 Row Level Security (RLS) must be enabled in Supabase
 *
 * See SUPABASE_SECURITY.md for security configuration.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Validate URL format
const isValidUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
};

// Create client only if URL is available and valid
export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey && isValidUrl(supabaseUrl)
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      })
    : null;

// Log initialization status (only in development)
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  if (!supabase) {
    console.warn("⚠️ Supabase client not initialized:", {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseAnonKey,
      urlValid: supabaseUrl ? isValidUrl(supabaseUrl) : false,
      urlPreview: supabaseUrl
        ? `${supabaseUrl.substring(0, 30)}...`
        : "not set",
    });
  }
}

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
  if (!supabase) {
    console.error(
      "Error fetching movies: Supabase client not initialized. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables."
    );
    return [];
  }

  try {
    const { data, error } = await supabase
      .from("movies")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching movies:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      return [];
    }
    return data as MovieRow[];
  } catch (err) {
    // Handle network errors and other exceptions
    const errorMessage = err instanceof Error ? err.message : String(err);
    const errorName = err instanceof Error ? err.name : "UnknownError";

    console.error("Error fetching movies (network/exception):", {
      name: errorName,
      message: errorMessage,
      error: err,
    });

    // Check for common network errors
    if (
      errorMessage.includes("ERR_NAME_NOT_RESOLVED") ||
      errorMessage.includes("Failed to fetch") ||
      errorMessage.includes("NetworkError")
    ) {
      console.error(
        "Network error detected. Please check your NEXT_PUBLIC_SUPABASE_URL environment variable."
      );
    }

    return [];
  }
}

// Fetch movies by genre
export async function getMoviesByGenre(genre: string) {
  if (!supabase) {
    console.error(
      "Error fetching movies by genre: Supabase client not initialized."
    );
    return [];
  }

  const { data, error } = await supabase
    .from("movies")
    .select("*")
    .ilike("genre", `%${genre}%`)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching movies by genre:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
    return [];
  }
  return data as MovieRow[];
}

// Fetch movies by year
export async function getMoviesByYear(year: string) {
  if (!supabase) {
    console.error(
      "Error fetching movies by year: Supabase client not initialized."
    );
    return [];
  }

  const { data, error } = await supabase
    .from("movies")
    .select("*")
    .eq("year", year)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching movies by year:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
    return [];
  }
  return data as MovieRow[];
}

// Fetch single movie by ID
export async function getMovieById(id: number) {
  if (!supabase) {
    console.error("Error fetching movie: Supabase client not initialized.");
    return null;
  }

  const { data, error } = await supabase
    .from("movies")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching movie:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
    return null;
  }
  return data as MovieRow;
}

// Search movies by title
export async function searchMovies(query: string) {
  if (!supabase) {
    console.error("Error searching movies: Supabase client not initialized.");
    return [];
  }

  const { data, error } = await supabase
    .from("movies")
    .select("*")
    .ilike("title", `%${query}%`)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error searching movies:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
    return [];
  }
  return data as MovieRow[];
}

// Fetch featured movies (high rating)
export async function getFeaturedMovies(limit = 15) {
  if (!supabase) {
    console.error(
      "Error fetching featured movies: Supabase client not initialized."
    );
    return [];
  }

  const { data, error } = await supabase
    .from("movies")
    .select("*")
    .order("rating", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching featured movies:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
    return [];
  }
  return data as MovieRow[];
}

// Fetch latest movies
export async function getLatestMovies(limit = 20) {
  if (!supabase) {
    console.error(
      "Error fetching latest movies: Supabase client not initialized."
    );
    return [];
  }

  const { data, error } = await supabase
    .from("movies")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching latest movies:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
    return [];
  }
  return data as MovieRow[];
}

// Fetch movies by quality (HD, CAM, etc.)
export async function getMoviesByQuality(quality: string) {
  if (!supabase) {
    console.error(
      "Error fetching movies by quality: Supabase client not initialized."
    );
    return [];
  }

  const { data, error } = await supabase
    .from("movies")
    .select("*")
    .ilike("quality", `%${quality}%`)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching movies by quality:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
    return [];
  }
  return data as MovieRow[];
}

// Fetch movies with pagination
export async function getMoviesPaginated(page: number, pageSize = 24) {
  if (!supabase) {
    console.error(
      "Error fetching paginated movies: Supabase client not initialized."
    );
    return { movies: [], total: 0 };
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from("movies")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Error fetching paginated movies:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
    return { movies: [], total: 0 };
  }
  return { movies: data as MovieRow[], total: count || 0 };
}

// Get total movie count
export async function getMovieCount() {
  if (!supabase) {
    console.error(
      "Error getting movie count: Supabase client not initialized."
    );
    return 0;
  }

  const { count, error } = await supabase
    .from("movies")
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error("Error getting movie count:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
    return 0;
  }
  return count || 0;
}

// Search movies by title containing keyword
export async function searchMoviesByKeyword(keyword: string) {
  if (!supabase) {
    console.error("Error searching movies: Supabase client not initialized.");
    return [];
  }

  const { data, error } = await supabase
    .from("movies")
    .select("*")
    .ilike("title", `%${keyword}%`)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error searching movies:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
    return [];
  }
  return data as MovieRow[];
}

// Get movies that might be series
export async function getSeriesMovies() {
  if (!supabase) {
    console.error("Error fetching series: Supabase client not initialized.");
    return [];
  }

  const { data, error } = await supabase
    .from("movies")
    .select("*")
    .or(
      "title.ilike.%series%,title.ilike.%season%,title.ilike.%episode%,title.ilike.%S01%,title.ilike.%S02%"
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching series:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
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
