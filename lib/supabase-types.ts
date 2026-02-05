/** Columns to request from movies table (excludes updatedat). */
export const MOVIE_SELECT =
  "id,title,url,year,genre,rating,maturity,quality,duration,image_url,link_1,link_2,created_at";

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
  updatedat?: string;
}

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

export function toMovies(rows: MovieRow[]) {
  return rows.map(toMovie);
}
