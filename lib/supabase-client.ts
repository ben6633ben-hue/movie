"use client";

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { MovieRow } from "./supabase-types";
import { MOVIE_SELECT, toMovie, toMovies } from "./supabase-types";

export type { MovieRow };
export { toMovie, toMovies };

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const client: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey && isValidUrl(supabaseUrl)
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      })
    : null;

const DATA_MAX_PAGE_SIZE = 100;
const MAX_LIST_RESULTS = 200;
const SEARCH_MIN_LENGTH = 2;
const SEARCH_MAX_PAGE_SIZE = 100;

function capPageSize(size: number) {
  return Math.min(Math.max(1, size), DATA_MAX_PAGE_SIZE);
}
function capListLimit(limit: number) {
  return Math.min(Math.max(1, limit), MAX_LIST_RESULTS);
}

export async function getMovieById(id: number): Promise<MovieRow | null> {
  if (!client) return null;
  const { data, error } = await client.from("movies").select(MOVIE_SELECT).eq("id", id).single();
  if (error) return null;
  return data as MovieRow;
}

export async function getMoviesByGenrePaginated(
  genre: string,
  page: number,
  pageSize = 24
) {
  if (!client) return { movies: [], total: 0 };
  const size = capPageSize(pageSize);
  const from = (page - 1) * size;
  const to = from + size - 1;
  const { data, error, count } = await client
    .from("movies")
    .select(MOVIE_SELECT, { count: "exact" })
    .not("image_url", "is", null)
    .neq("image_url", "")
    .ilike("genre", `%${genre}%`)
    .order("created_at", { ascending: false })
    .range(from, to);
  if (error) return { movies: [], total: 0 };
  return { movies: (data ?? []) as MovieRow[], total: count ?? 0 };
}

export async function getMoviesByGenreSample(genre: string, limit = 50): Promise<MovieRow[]> {
  if (!client) return [];
  const capped = capListLimit(limit);
  const { data, error } = await client
    .from("movies")
    .select(MOVIE_SELECT)
    .not("image_url", "is", null)
    .neq("image_url", "")
    .ilike("genre", `%${genre}%`)
    .order("created_at", { ascending: false })
    .limit(capped);
  if (error) return [];
  return (data ?? []) as MovieRow[];
}

export async function getMoviesByGenreAndYearsSample(
  genre: string,
  years: string[],
  limit = 15
): Promise<MovieRow[]> {
  if (!client || years.length === 0) return [];
  const capped = capListLimit(limit);
  const { data, error } = await client
    .from("movies")
    .select(MOVIE_SELECT)
    .not("image_url", "is", null)
    .neq("image_url", "")
    .ilike("genre", `%${genre}%`)
    .in("year", years)
    .order("created_at", { ascending: false })
    .limit(capped);
  if (error) return [];
  return (data ?? []) as MovieRow[];
}

export async function getMoviesByYearPaginated(
  year: string,
  page: number,
  pageSize = 24
) {
  if (!client) return { movies: [], total: 0 };
  const size = capPageSize(pageSize);
  const from = (page - 1) * size;
  const to = from + size - 1;
  const { data, error, count } = await client
    .from("movies")
    .select(MOVIE_SELECT, { count: "exact" })
    .not("image_url", "is", null)
    .neq("image_url", "")
    .eq("year", year)
    .order("created_at", { ascending: false })
    .range(from, to);
  if (error) return { movies: [], total: 0 };
  return { movies: (data ?? []) as MovieRow[], total: count ?? 0 };
}

export async function getMoviesByYearsSample(
  years: string[],
  limit = 30
): Promise<MovieRow[]> {
  if (!client || years.length === 0) return [];
  const capped = capListLimit(limit);
  const { data, error } = await client
    .from("movies")
    .select(MOVIE_SELECT)
    .not("image_url", "is", null)
    .neq("image_url", "")
    .in("year", years)
    .order("created_at", { ascending: false })
    .limit(capped);
  if (error) return [];
  return (data ?? []) as MovieRow[];
}

export async function getMoviesByYearsPaginated(
  years: string[],
  page: number,
  pageSize = 24
) {
  if (!client || years.length === 0) return { movies: [], total: 0 };
  const size = capPageSize(pageSize);
  const from = (page - 1) * size;
  const to = from + size - 1;
  const { data, error, count } = await client
    .from("movies")
    .select(MOVIE_SELECT, { count: "exact" })
    .not("image_url", "is", null)
    .neq("image_url", "")
    .in("year", years)
    .order("created_at", { ascending: false })
    .range(from, to);
  if (error) return { movies: [], total: 0 };
  return { movies: (data ?? []) as MovieRow[], total: count ?? 0 };
}

export async function getLatestMovies(limit = 20): Promise<MovieRow[]> {
  if (!client) return [];
  const capped = capListLimit(limit);
  const { data, error } = await client
    .from("movies")
    .select(MOVIE_SELECT)
    .not("image_url", "is", null)
    .neq("image_url", "")
    .order("created_at", { ascending: false })
    .limit(capped);
  if (error) return [];
  return (data ?? []) as MovieRow[];
}

function fallbackSearchPatterns(query: string): string[] {
  const q = query.trim();
  if (!q) return [];
  const patterns: string[] = [`%${q}%`];
  if (q.length >= 6) {
    const split = q.length - 3;
    patterns.push(`%${q.slice(0, split)}%${q.slice(split)}%`);
  }
  return patterns;
}

export async function searchMoviesPaginated(
  query: string,
  page: number,
  pageSize = 24
) {
  if (!client) return { movies: [], total: 0 };
  const q = query.trim();
  if (q.length < SEARCH_MIN_LENGTH) return { movies: [], total: 0 };
  const cappedSize = Math.min(Math.max(1, pageSize), SEARCH_MAX_PAGE_SIZE);
  const from = (page - 1) * cappedSize;
  const to = from + cappedSize - 1;

  const { data: rpcData, error: rpcError } = await client.rpc("search_movies_by_title", {
    search_query: q,
    page_num: page,
    page_size: cappedSize,
  });
  if (!rpcError && rpcData?.length) {
    const list = rpcData as (MovieRow & { total_count?: number })[];
    const total = list[0]?.total_count ?? 0;
    const rows = list.map(({ total_count: _, ...row }) => row as MovieRow);
    return { movies: rows, total: Number(total) };
  }

  const patterns = fallbackSearchPatterns(q);
  const orClause = patterns.map((p) => `title.ilike.${p}`).join(",");
  const { data, error, count } = await client
    .from("movies")
    .select(MOVIE_SELECT, { count: "exact" })
    .not("image_url", "is", null)
    .neq("image_url", "")
    .or(orClause)
    .order("created_at", { ascending: false })
    .range(from, to);
  if (error) return { movies: [], total: 0 };
  return { movies: (data ?? []) as MovieRow[], total: count ?? 0 };
}

export async function getFeaturedMovies(limit = 15): Promise<MovieRow[]> {
  if (!client) return [];
  const capped = capListLimit(limit);
  const { data, error } = await client
    .from("movies")
    .select(MOVIE_SELECT)
    .not("image_url", "is", null)
    .neq("image_url", "")
    .order("rating", { ascending: false })
    .limit(capped);
  if (error) return [];
  return (data ?? []) as MovieRow[];
}

export async function getMoviesMatchingTitles(
  titles: string[],
  limit = 80
): Promise<MovieRow[]> {
  if (!client || titles.length === 0) return [];
  const capped = capListLimit(limit);
  const BATCH = 12;
  const results: MovieRow[] = [];
  const seen = new Set<number>();
  for (let i = 0; i < titles.length; i += BATCH) {
    const batch = titles.slice(i, i + BATCH);
    const orClause = batch
      .map((t) => `title.ilike.%${t.replace(/%/g, "")}%`)
      .join(",");
    const { data, error } = await client
      .from("movies")
      .select(MOVIE_SELECT)
      .not("image_url", "is", null)
      .neq("image_url", "")
      .or(orClause)
      .order("created_at", { ascending: false })
      .limit(capped);
    if (error) continue;
    for (const row of (data ?? []) as MovieRow[]) {
      if (!seen.has(row.id)) {
        seen.add(row.id);
        results.push(row);
      }
    }
  }
  return results;
}

function normalizeTitle(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "").trim();
}

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
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )[0];
    if (latest && !used.has(latest.id)) {
      used.add(latest.id);
      featured.push(latest);
    }
  }
  if (featured.length >= count) return featured;
  const recent = (
    await getMoviesByYearsSample(["2026", "2025"], (count - featured.length) * 2)
  ).filter((row) => row.image_url != null && String(row.image_url).trim() !== "");
  for (const row of recent) {
    if (featured.length >= count) break;
    if (used.has(row.id)) continue;
    used.add(row.id);
    featured.push(row);
  }
  if (featured.length >= count) return featured;
  const latestRows = await getLatestMovies((count - featured.length) * 2);
  const latest = latestRows.filter(
    (row) => row.image_url != null && String(row.image_url).trim() !== ""
  );
  for (const row of latest) {
    if (featured.length >= count) break;
    if (used.has(row.id)) continue;
    used.add(row.id);
    featured.push(row);
  }
  return featured;
}

export async function getMoviesPaginated(page: number, pageSize = 24) {
  if (!client) return { movies: [], total: 0 };
  const size = capPageSize(pageSize);
  const from = (page - 1) * size;
  const to = from + size - 1;
  const { data, error, count } = await client
    .from("movies")
    .select(MOVIE_SELECT, { count: "exact" })
    .not("image_url", "is", null)
    .neq("image_url", "")
    .order("created_at", { ascending: false })
    .range(from, to);
  if (error) return { movies: [], total: 0 };
  return { movies: (data ?? []) as MovieRow[], total: count ?? 0 };
}

export async function getMoviesOrderedByYearPaginated(page: number, pageSize = 24) {
  if (!client) return { movies: [], total: 0 };
  const size = capPageSize(pageSize);
  const from = (page - 1) * size;
  const to = from + size - 1;
  const { data, error, count } = await client
    .from("movies")
    .select(MOVIE_SELECT, { count: "exact" })
    .not("image_url", "is", null)
    .neq("image_url", "")
    .order("year", { ascending: false })
    .range(from, to);
  if (error) return { movies: [], total: 0 };
  return { movies: (data ?? []) as MovieRow[], total: count ?? 0 };
}

export async function getSeriesMoviesPaginated(page: number, pageSize = 24) {
  if (!client) return { movies: [], total: 0 };
  const size = capPageSize(pageSize);
  const from = (page - 1) * size;
  const to = from + size - 1;
  const { data, error, count } = await client
    .from("movies")
    .select(MOVIE_SELECT, { count: "exact" })
    .not("image_url", "is", null)
    .neq("image_url", "")
    .or(
      "title.ilike.%series%,title.ilike.%season%,title.ilike.%episode%,title.ilike.%S01%,title.ilike.%S02%"
    )
    .order("created_at", { ascending: false })
    .range(from, to);
  if (error) return { movies: [], total: 0 };
  return { movies: (data ?? []) as MovieRow[], total: count ?? 0 };
}
