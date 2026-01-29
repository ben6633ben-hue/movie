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

// Fetch movies by genre (unbounded; prefer getMoviesByGenrePaginated or getMoviesByGenreSample)
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
    .not("image_url", "is", null)
    .neq("image_url", "")
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

/** Paginated genre list — fast, no full table scan. */
export async function getMoviesByGenrePaginated(
  genre: string,
  page: number,
  pageSize = 24
) {
  if (!supabase) return { movies: [], total: 0 };
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const { data, error, count } = await supabase
    .from("movies")
    .select("*", { count: "exact" })
    .not("image_url", "is", null)
    .neq("image_url", "")
    .ilike("genre", `%${genre}%`)
    .order("created_at", { ascending: false })
    .range(from, to);
  if (error) {
    console.error("Error fetching movies by genre (paginated):", error.message);
    return { movies: [], total: 0 };
  }
  return { movies: (data ?? []) as MovieRow[], total: count ?? 0 };
}

/** Fetch a limited sample of movies by genre for “similar” section. Keeps query small and fast. */
export async function getMoviesByGenreSample(genre: string, limit = 50) {
  if (!supabase) {
    console.error(
      "Error fetching movies by genre: Supabase client not initialized."
    );
    return [];
  }

  const { data, error } = await supabase
    .from("movies")
    .select("*")
    .not("image_url", "is", null)
    .neq("image_url", "")
    .ilike("genre", `%${genre}%`)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching movies by genre sample:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
    return [];
  }
  return data as MovieRow[];
}

/** Genre + years (e.g. Drama/Thriller Terbaru limited to 2025/2026). */
export async function getMoviesByGenreAndYearsSample(
  genre: string,
  years: string[],
  limit = 15
): Promise<MovieRow[]> {
  if (!supabase || years.length === 0) return [];
  const { data, error } = await supabase
    .from("movies")
    .select("*")
    .not("image_url", "is", null)
    .neq("image_url", "")
    .ilike("genre", `%${genre}%`)
    .in("year", years)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) {
    console.error("Error getMoviesByGenreAndYearsSample:", error.message);
    return [];
  }
  return (data ?? []) as MovieRow[];
}

// Fetch movies by year (unbounded; prefer getMoviesByYearPaginated)
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

/** Paginated year list — fast. */
export async function getMoviesByYearPaginated(
  year: string,
  page: number,
  pageSize = 24
) {
  if (!supabase) return { movies: [], total: 0 };
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const { data, error, count } = await supabase
    .from("movies")
    .select("*", { count: "exact" })
    .not("image_url", "is", null)
    .neq("image_url", "")
    .eq("year", year)
    .order("created_at", { ascending: false })
    .range(from, to);
  if (error) {
    console.error("Error fetching movies by year (paginated):", error.message);
    return { movies: [], total: 0 };
  }
  return { movies: (data ?? []) as MovieRow[], total: count ?? 0 };
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

/** Row returned by search_movies_by_title RPC (includes total_count). */
interface SearchMovieRow extends MovieRow {
  total_count?: number;
}

/** Normalized title search via DB: matches "Spider-Man" for "spiderman". Uses RPC search_movies_by_title. */
async function searchMoviesByTitleRpc(
  query: string,
  pageNum: number,
  pageSize: number
): Promise<{ rows: MovieRow[]; total: number }> {
  if (!supabase) return { rows: [], total: 0 };
  const { data, error } = await supabase.rpc("search_movies_by_title", {
    search_query: query,
    page_num: pageNum,
    page_size: pageSize,
  });
  if (error) {
    console.error("Error searching movies (RPC):", error.message);
    return { rows: [], total: -1 };
  }
  const list = (data ?? []) as SearchMovieRow[];
  const total = list[0]?.total_count ?? 0;
  const rows: MovieRow[] = list.map(({ total_count: _, ...row }) => row as MovieRow);
  return { rows, total: Number(total) };
}

/** Build extra ilike patterns so "spiderman" can match "Spider-Man" (hyphen/word break). */
function fallbackSearchPatterns(query: string): string[] {
  const q = query.trim();
  if (!q) return [];
  const patterns: string[] = [`%${q}%`];
  // Allow "spiderman" to match "Spider-Man": try "prefix%suffix" for last 3 chars (e.g. spider%man)
  if (q.length >= 6) {
    const split = q.length - 3;
    patterns.push(`%${q.slice(0, split)}%${q.slice(split)}%`);
  }
  return patterns;
}

/** Fallback: ilike search when RPC is not available. Uses extra patterns so "spiderman" matches "Spider-Man". */
async function searchMoviesPaginatedFallback(
  query: string,
  page: number,
  pageSize: number
): Promise<{ movies: MovieRow[]; total: number }> {
  if (!supabase) return { movies: [], total: 0 };
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const patterns = fallbackSearchPatterns(query);
  // OR multiple ilike patterns: "spiderman" and "spider%man" so "Spider-Man 3" matches
  const orClause = patterns.map((p) => `title.ilike.${p}`).join(",");
  const { data, error, count } = await supabase
    .from("movies")
    .select("*", { count: "exact" })
    .not("image_url", "is", null)
    .neq("image_url", "")
    .or(orClause)
    .order("created_at", { ascending: false })
    .range(from, to);
  if (error) {
    console.error("Error searching movies (fallback):", error.message);
    return { movies: [], total: 0 };
  }
  return { movies: (data ?? []) as MovieRow[], total: count ?? 0 };
}

// Search movies by title — normalized when RPC exists; else ilike. Trimmed; skips very short; limited to 200.
export async function searchMovies(query: string, limit = 200) {
  const q = query.trim();
  if (q.length < SEARCH_MIN_LENGTH) return [];
  const pageSize = Math.min(limit, 200);
  const { rows, total } = await searchMoviesByTitleRpc(q, 1, pageSize);
  if (total >= 0) return rows;
  const { movies } = await searchMoviesPaginatedFallback(q, 1, pageSize);
  return movies;
}

/** Min search query length to avoid heavy DB work for single chars. */
const SEARCH_MIN_LENGTH = 2;

/** Paginated search — uses RPC (normalized title) when available, else ilike fallback. Trimmed; skips very short queries. */
export async function searchMoviesPaginated(
  query: string,
  page: number,
  pageSize = 24
) {
  const q = query.trim();
  if (q.length < SEARCH_MIN_LENGTH) {
    return { movies: [], total: 0 };
  }
  const { rows, total } = await searchMoviesByTitleRpc(q, page, pageSize);
  if (total >= 0) return { movies: rows, total };
  const result = await searchMoviesPaginatedFallback(q, page, pageSize);
  return { movies: result.movies, total: result.total };
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
    .not("image_url", "is", null)
    .neq("image_url", "")
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

/** Fetch movies whose title matches any of the given strings (ilike %title%). Batched to avoid long URLs. */
export async function getMoviesMatchingTitles(
  titles: string[],
  limit = 80
): Promise<MovieRow[]> {
  if (!supabase || titles.length === 0) return [];
  const BATCH = 12;
  const results: MovieRow[] = [];
  const seen = new Set<number>();
  for (let i = 0; i < titles.length; i += BATCH) {
    const batch = titles.slice(i, i + BATCH);
    const orClause = batch
      .map((t) => `title.ilike.%${t.replace(/%/g, "")}%`)
      .join(",");
    const { data, error } = await supabase
      .from("movies")
      .select("*")
      .not("image_url", "is", null)
      .neq("image_url", "")
      .or(orClause)
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) {
      console.error("Error getMoviesMatchingTitles:", error.message);
      continue;
    }
    const rows = (data ?? []) as MovieRow[];
    for (const row of rows) {
      if (!seen.has(row.id)) {
        seen.add(row.id);
        results.push(row);
      }
    }
  }
  return results;
}

/** Fetch movies from given years (e.g. 2026, 2025), limited. */
export async function getMoviesByYearsSample(
  years: string[],
  limit = 30
): Promise<MovieRow[]> {
  if (!supabase || years.length === 0) return [];
  const { data, error } = await supabase
    .from("movies")
    .select("*")
    .not("image_url", "is", null)
    .neq("image_url", "")
    .in("year", years)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) {
    console.error("Error getMoviesByYearsSample:", error.message);
    return [];
  }
  return (data ?? []) as MovieRow[];
}

/** Paginated movies from given years (e.g. 2026, 2025) — for Film Terbaru / Baru Diupload. */
export async function getMoviesByYearsPaginated(
  years: string[],
  page: number,
  pageSize = 24
): Promise<{ movies: MovieRow[]; total: number }> {
  if (!supabase || years.length === 0) return { movies: [], total: 0 };
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const { data, error, count } = await supabase
    .from("movies")
    .select("*", { count: "exact" })
    .not("image_url", "is", null)
    .neq("image_url", "")
    .in("year", years)
    .order("created_at", { ascending: false })
    .range(from, to);
  if (error) {
    console.error("Error getMoviesByYearsPaginated:", error.message);
    return { movies: [], total: 0 };
  }
  return { movies: (data ?? []) as MovieRow[], total: count ?? 0 };
}

/** Normalize for title matching: lowercase, keep alphanumeric. */
function normalizeTitle(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .trim();
}

/** Featured list: one movie per priority title (latest match), in order, then fill with recent 2026/2025. */
export async function getFeaturedMoviesForHomepage(
  priorityTitles: string[],
  count = 15
): Promise<MovieRow[]> {
  const matches = (await getMoviesMatchingTitles(priorityTitles, 120)).filter(
    (row) => row.image_url != null && String(row.image_url).trim() !== ""
  );
  const normalizedPriorities = priorityTitles.map(normalizeTitle);
  const byPriorityIndex = (row: MovieRow): number => {
    const norm = normalizeTitle(row.title);
    const indicesByLength = [...normalizedPriorities.keys()].sort(
      (a, b) => normalizedPriorities[b].length - normalizedPriorities[a].length
    );
    for (const i of indicesByLength) {
      const p = normalizedPriorities[i];
      if (norm.includes(p) || p.includes(norm)) return i;
    }
    return priorityTitles.length;
  };
  const byIndex = new Map<number, MovieRow[]>();
  for (const row of matches) {
    const i = byPriorityIndex(row);
    if (i >= priorityTitles.length) continue;
    if (!byIndex.has(i)) byIndex.set(i, []);
    byIndex.get(i)!.push(row);
  }
  const featured: MovieRow[] = [];
  const used = new Set<number>();
  for (let i = 0; i < priorityTitles.length && featured.length < count; i++) {
    const group = byIndex.get(i) ?? [];
    const latest = group.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )[0];
    if (latest && !used.has(latest.id)) {
      used.add(latest.id);
      featured.push(latest);
    }
  }
  if (featured.length >= count) return featured;
  const recent = (await getMoviesByYearsSample(
    ["2026", "2025"],
    (count - featured.length) * 2
  )).filter((row) => row.image_url != null && String(row.image_url).trim() !== "");
  for (const row of recent) {
    if (featured.length >= count) break;
    if (used.has(row.id)) continue;
    used.add(row.id);
    featured.push(row);
  }
  if (featured.length >= count) return featured;
  const latestRows = await getLatestMovies((count - featured.length) * 2);
  const latest = latestRows.filter((row) => row.image_url != null && String(row.image_url).trim() !== "");
  for (const row of latest) {
    if (featured.length >= count) break;
    if (used.has(row.id)) continue;
    used.add(row.id);
    featured.push(row);
  }
  return featured;
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
    .not("image_url", "is", null)
    .neq("image_url", "")
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

// Fetch movies by quality (HD, CAM, etc.) — optional limit to avoid full scan
export async function getMoviesByQuality(quality: string, limit = 200) {
  if (!supabase) {
    console.error(
      "Error fetching movies by quality: Supabase client not initialized."
    );
    return [];
  }

  const { data, error } = await supabase
    .from("movies")
    .select("*")
    .not("image_url", "is", null)
    .neq("image_url", "")
    .ilike("quality", `%${quality}%`)
    .order("created_at", { ascending: false })
    .limit(limit);

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
    .not("image_url", "is", null)
    .neq("image_url", "")
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

/** All movies ordered by year desc, one page — for “release” listing. */
export async function getMoviesOrderedByYearPaginated(
  page: number,
  pageSize = 24
) {
  if (!supabase) return { movies: [], total: 0 };
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const { data, error, count } = await supabase
    .from("movies")
    .select("*", { count: "exact" })
    .not("image_url", "is", null)
    .neq("image_url", "")
    .order("year", { ascending: false })
    .range(from, to);
  if (error) {
    console.error("Error fetching movies by year order (paginated):", error.message);
    return { movies: [], total: 0 };
  }
  return { movies: (data ?? []) as MovieRow[], total: count ?? 0 };
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
export async function searchMoviesByKeyword(keyword: string, limit = 200) {
  if (!supabase) {
    console.error("Error searching movies: Supabase client not initialized.");
    return [];
  }

  const { data, error } = await supabase
    .from("movies")
    .select("*")
    .not("image_url", "is", null)
    .neq("image_url", "")
    .ilike("title", `%${keyword}%`)
    .order("created_at", { ascending: false })
    .limit(limit);

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

// Get movies that might be series (unbounded; prefer getSeriesMoviesPaginated)
export async function getSeriesMovies() {
  if (!supabase) {
    console.error("Error fetching series: Supabase client not initialized.");
    return [];
  }

  const { data, error } = await supabase
    .from("movies")
    .select("*")
    .not("image_url", "is", null)
    .neq("image_url", "")
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
    return [];
  }
  return data as MovieRow[];
}

/** Paginated series list — fast. */
export async function getSeriesMoviesPaginated(page: number, pageSize = 24) {
  if (!supabase) return { movies: [], total: 0 };
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const { data, error, count } = await supabase
    .from("movies")
    .select("*", { count: "exact" })
    .not("image_url", "is", null)
    .neq("image_url", "")
    .or(
      "title.ilike.%series%,title.ilike.%season%,title.ilike.%episode%,title.ilike.%S01%,title.ilike.%S02%"
    )
    .order("created_at", { ascending: false })
    .range(from, to);
  if (error) {
    console.error("Error fetching series (paginated):", error.message);
    return { movies: [], total: 0 };
  }
  return { movies: (data ?? []) as MovieRow[], total: count ?? 0 };
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
