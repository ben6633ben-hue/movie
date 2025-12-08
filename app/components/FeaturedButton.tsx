import Link from "next/link";

export default function FeaturedButton() {
  return (
    <div className="flex justify-center mt-2">
      <Link href="/popular" className="featured-button">
        LIHAT SEMUA FILM UNGGULAN
      </Link>
    </div>
  );
}

