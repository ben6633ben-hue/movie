"use client";

import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import CategoryBar from "@/app/components/CategoryBar";
import Footer from "@/app/components/Footer";
import PageHeader from "@/app/components/PageHeader";

const genres = [
  { name: "Action", icon: "💥", count: 1250 },
  { name: "Adventure", icon: "🏔️", count: 890 },
  { name: "Animation", icon: "🎨", count: 456 },
  { name: "Biography", icon: "📖", count: 234 },
  { name: "Comedy", icon: "😂", count: 1680 },
  { name: "Crime", icon: "🔪", count: 567 },
  { name: "Documentary", icon: "🎬", count: 345 },
  { name: "Drama", icon: "🎭", count: 2100 },
  { name: "Family", icon: "👨‍👩‍👧‍👦", count: 432 },
  { name: "Fantasy", icon: "🧙", count: 678 },
  { name: "History", icon: "📜", count: 289 },
  { name: "Horror", icon: "👻", count: 890 },
  { name: "Musical", icon: "🎵", count: 156 },
  { name: "Mystery", icon: "🔍", count: 445 },
  { name: "Romance", icon: "💕", count: 1234 },
  { name: "Sci-Fi", icon: "🚀", count: 567 },
  { name: "Sport", icon: "⚽", count: 234 },
  { name: "Thriller", icon: "😱", count: 890 },
  { name: "War", icon: "⚔️", count: 345 },
  { name: "Western", icon: "🤠", count: 123 },
];

export default function GenreListClient() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <CategoryBar />

      <PageHeader 
        breadcrumb="Semua Genre"
        totalItems={genres.length}
      />

      <div className="category-list-page">
        <h2 className="category-list-title">Pilih Genre Film</h2>
        <div className="category-grid">
          {genres.map((genre) => (
            <Link 
              key={genre.name} 
              href={`/genre/${genre.name.toLowerCase()}`}
              className="category-card"
            >
              <span className="category-icon">{genre.icon}</span>
              <span className="category-name">{genre.name}</span>
              <span className="category-count">{genre.count} Film</span>
            </Link>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
