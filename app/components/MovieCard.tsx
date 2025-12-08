import Link from "next/link";
import { Movie } from "@/types/movie";
import { StarIcon } from "@heroicons/react/24/solid";

interface Props {
  movie: Movie;
  size?: "normal" | "large";
}

export default function MovieCard({ movie, size = "normal" }: Props) {
  const isLarge = size === "large";
  const cardWidth = isLarge ? "w-[150px]" : "w-[120px]";
  const cardHeight = isLarge ? "h-[210px]" : "h-[170px]";

  return (
    <Link href={`/movie/${movie.id}`} className={`movie-card ${cardWidth}`}>
      {/* Image Container */}
      <div className={`relative ${cardHeight} rounded overflow-hidden group cursor-pointer`}>
        <img
          src={movie.image}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        
        {/* Rating Badge - Top Left */}
        <div className="absolute top-2 left-2 flex items-center gap-0.5 bg-black/60 px-1.5 py-0.5 rounded text-xs">
          <StarIcon className="w-3 h-3" style={{ color: "var(--yellow-color)" }} />
          <span className="text-white font-medium">{movie.rating}</span>
        </div>

        {/* HD or EPS Badge - Top Right */}
        <div className="absolute top-2 right-2">
          {movie.episodes ? (
            <div className="badge-eps">
              <span className="text-[10px]">EPS</span>
              <span className="font-bold">{movie.episodes}</span>
            </div>
          ) : movie.isHD ? (
            <div className="badge-hd">HD</div>
          ) : null}
        </div>

        {/* Year and Duration - Bottom */}
        <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center text-[11px] text-white">
          <span className="px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: "rgba(229, 22, 107, 0.8)" }}>{movie.year}</span>
          {movie.duration && (
            <span className="bg-black/60 px-1.5 py-0.5 rounded">{movie.duration}</span>
          )}
        </div>
      </div>

      {/* Text below image */}
      <div className="mt-2">
        <p className="text-[11px] text-gray-400 line-clamp-1">{movie.genre}</p>
        <p className="text-sm font-medium movie-title line-clamp-2 leading-tight mt-0.5 cursor-pointer transition-colors">
          {movie.title}
        </p>
      </div>
    </Link>
  );
}
