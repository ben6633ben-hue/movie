export interface Movie {
  id: number;
  title: string;
  image: string;
  genre: string;
  rating: number;
  year: number;
  duration?: string;
  episodes?: number;
  isHD?: boolean;
  category?: string;
  country?: string;
  // From Supabase
  url?: string;
  maturity?: string;
  quality?: string;
  link1?: string;
  link2?: string;
}
