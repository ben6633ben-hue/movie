"use client";

import Link from "next/link";

export default function CategoryBar() {
  const categories = [
    { label: "ACTION", href: "/genre/action" },
    { label: "ANIME", href: "/genre/animation" },
    { label: "HORROR", href: "/genre/horror" },
    { label: "KOMEDI", href: "/genre/comedy" },
    { label: "SCI-FI", href: "/genre/sci-fi" },
    { label: "ROMANCE", href: "/genre/romance" },
    { label: "CINA", href: "/country/cina" },
    { label: "INDIA", href: "/country/india" },
    { label: "JEPANG", href: "/country/jepang" },
    { label: "KOREA", href: "/country/korea" },
    { label: "THAILAND", href: "/country/thailand" },
    { label: "BLURAY", href: "/popular" },
    { label: "2024", href: "/year/2024" },
    { label: "2025", href: "/year/2025" },
    { label: "TERPOPULER", href: "/popular" },
  ];

  return (
    <div className="category-bar">
      {categories.map((cat) => (
        <Link
          key={cat.label}
          href={cat.href}
          className="category-item"
        >
          {cat.label}
        </Link>
      ))}
    </div>
  );
}
