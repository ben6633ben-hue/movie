import { cache } from "react";
import { createClient, SupabaseClient } from "@supabase/supabase-js";


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

// ——— Data transfer limits (cap payloads to limit bandwidth) ———
const DATA_MAX_PAGE_SIZE = 100;
const MAX_LIST_RESULTS = 200;

function capPageSize(size: number): number {
  return Math.min(Math.max(1, size), DATA_MAX_PAGE_SIZE);
}
function capListLimit(limit: number): number {
  return Math.min(Math.max(1, limit), MAX_LIST_RESULTS);
}

/** Paginated genre list — fast, no full table scan. Cached per request. Page size capped. */
async function getMoviesByGenrePaginatedImpl(
  genre: string,
  page: number,
  pageSize = 24
) {
  if (!supabase) return { movies: [], total: 0 };
  const size = capPageSize(pageSize);
  const from = (page - 1) * size;
  const to = from + size - 1;
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
export const getMoviesByGenrePaginated = cache(getMoviesByGenrePaginatedImpl);

/** Fetch a limited sample of movies by genre for “similar” section. Keeps query small and fast. */
export async function getMoviesByGenreSample(genre: string, limit = 50) {
  if (!supabase) {
    console.error(
      "Error fetching movies by genre: Supabase client not initialized."
    );
    return [];
  }
  const capped = capListLimit(limit);
  const { data, error } = await supabase
    .from("movies")
    .select("*")
    .not("image_url", "is", null)
    .neq("image_url", "")
    .ilike("genre", `%${genre}%`)
    .order("created_at", { ascending: false })
    .limit(capped);

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

/** Genre + years (e.g. Drama/Thriller Terbaru limited to 2025/2026). Limit capped. */
export async function getMoviesByGenreAndYearsSample(
  genre: string,
  years: string[],
  limit = 15
): Promise<MovieRow[]> {
  if (!supabase || years.length === 0) return [];
  const capped = capListLimit(limit);
  const { data, error } = await supabase
    .from("movies")
    .select("*")
    .not("image_url", "is", null)
    .neq("image_url", "")
    .ilike("genre", `%${genre}%`)
    .in("year", years)
    .order("created_at", { ascending: false })
    .limit(capped);
  if (error) {
    console.error("Error getMoviesByGenreAndYearsSample:", error.message);
    return [];
  }
  return (data ?? []) as MovieRow[];
}

/** Paginated year list — fast. Cached per request. Page size capped. */
async function getMoviesByYearPaginatedImpl(
  year: string,
  page: number,
  pageSize = 24
) {
  if (!supabase) return { movies: [], total: 0 };
  const size = capPageSize(pageSize);
  const from = (page - 1) * size;
  const to = from + size - 1;
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
export const getMoviesByYearPaginated = cache(getMoviesByYearPaginatedImpl);

// Fetch single movie by ID (cached per request to dedupe metadata + page)
async function getMovieByIdImpl(id: number) {
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

export const getMovieById = cache(getMovieByIdImpl);

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
  const cappedSize = Math.min(Math.max(1, pageSize), SEARCH_MAX_PAGE_SIZE);
  const { data, error } = await supabase.rpc("search_movies_by_title", {
    search_query: query,
    page_num: pageNum,
    page_size: cappedSize,
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
  const cappedSize = Math.min(Math.max(1, pageSize), SEARCH_MAX_PAGE_SIZE);
  const from = (page - 1) * cappedSize;
  const to = from + cappedSize - 1;
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

/** Min search query length to avoid heavy DB work for single chars. */
const SEARCH_MIN_LENGTH = 2;

/** Max rows per search request to limit data transfer (paginated and non-paginated). */
const SEARCH_MAX_PAGE_SIZE = 100;
const SEARCH_MAX_RESULTS = 100;

/** Paginated search — uses RPC (normalized title) when available, else ilike fallback. Cached per request. */
async function searchMoviesPaginatedImpl(
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
export const searchMoviesPaginated = cache(searchMoviesPaginatedImpl);

// Fetch featured movies (high rating). Limit capped.
export async function getFeaturedMovies(limit = 15) {
  if (!supabase) {
    console.error(
      "Error fetching featured movies: Supabase client not initialized."
    );
    return [];
  }
  const capped = capListLimit(limit);
  const { data, error } = await supabase
    .from("movies")
    .select("*")
    .not("image_url", "is", null)
    .neq("image_url", "")
    .order("rating", { ascending: false })
    .limit(capped);

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

/** Fetch movies whose title matches any of the given strings (ilike %title%). Limit capped for data transfer. */
export async function getMoviesMatchingTitles(
  titles: string[],
  limit = 80
): Promise<MovieRow[]> {
  if (!supabase || titles.length === 0) return [];
  const capped = capListLimit(limit);
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
      .limit(capped);
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

/** Fetch movies from given years (e.g. 2026, 2025). Limit capped. */
export async function getMoviesByYearsSample(
  years: string[],
  limit = 30
): Promise<MovieRow[]> {
  if (!supabase || years.length === 0) return [];
  const capped = capListLimit(limit);
  const { data, error } = await supabase
    .from("movies")
    .select("*")
    .not("image_url", "is", null)
    .neq("image_url", "")
    .in("year", years)
    .order("created_at", { ascending: false })
    .limit(capped);
  if (error) {
    console.error("Error getMoviesByYearsSample:", error.message);
    return [];
  }
  return (data ?? []) as MovieRow[];
}

/** Paginated movies from given years — for Film Terbaru / Baru Diupload. Page size capped. */
async function getMoviesByYearsPaginatedImpl(
  years: string[],
  page: number,
  pageSize = 24
): Promise<{ movies: MovieRow[]; total: number }> {
  if (!supabase || years.length === 0) return { movies: [], total: 0 };
  const size = capPageSize(pageSize);
  const from = (page - 1) * size;
  const to = from + size - 1;
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
export const getMoviesByYearsPaginated = cache(getMoviesByYearsPaginatedImpl);

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

// Fetch latest movies. Limit capped for data transfer.
export async function getLatestMovies(limit = 20) {
  if (!supabase) {
    console.error(
      "Error fetching latest movies: Supabase client not initialized."
    );
    return [];
  }
  const capped = capListLimit(limit);
  const { data, error } = await supabase
    .from("movies")
    .select("*")
    .not("image_url", "is", null)
    .neq("image_url", "")
    .order("created_at", { ascending: false })
    .limit(capped);

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

// Fetch movies with pagination. Cached per request. Page size capped.
async function getMoviesPaginatedImpl(page: number, pageSize = 24) {
  if (!supabase) {
    console.error(
      "Error fetching paginated movies: Supabase client not initialized."
    );
    return { movies: [], total: 0 };
  }
  const size = capPageSize(pageSize);
  const from = (page - 1) * size;
  const to = from + size - 1;

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
export const getMoviesPaginated = cache(getMoviesPaginatedImpl);

/** All movies ordered by year desc, one page — for “release” listing. */
async function getMoviesOrderedByYearPaginatedImpl(
  page: number,
  pageSize = 24
) {
  if (!supabase) return { movies: [], total: 0 };
  const size = capPageSize(pageSize);
  const from = (page - 1) * size;
  const to = from + size - 1;
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
export const getMoviesOrderedByYearPaginated = cache(
  getMoviesOrderedByYearPaginatedImpl
);

/** Paginated series list — fast. Cached per request. Page size capped. */
async function getSeriesMoviesPaginatedImpl(page: number, pageSize = 24) {
  if (!supabase) return { movies: [], total: 0 };
  const size = capPageSize(pageSize);
  const from = (page - 1) * size;
  const to = from + size - 1;
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
export const getSeriesMoviesPaginated = cache(getSeriesMoviesPaginatedImpl);

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
