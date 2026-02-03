"use client";

import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import CategoryBar from "@/app/components/CategoryBar";
import Footer from "@/app/components/Footer";
import PageHeader from "@/app/components/PageHeader";

const countries = [
  { name: "United States", slug: "united-states", flag: "🇺🇸", count: 3500 },
  { name: "United Kingdom", slug: "united-kingdom", flag: "🇬🇧", count: 890 },
  { name: "Australia", slug: "australia", flag: "🇦🇺", count: 234 },
  { name: "China", slug: "china", flag: "🇨🇳", count: 890 },
  { name: "France", slug: "france", flag: "🇫🇷", count: 345 },
  { name: "Germany", slug: "germany", flag: "🇩🇪", count: 289 },
  { name: "Hong Kong", slug: "hong-kong", flag: "🇭🇰", count: 567 },
  { name: "Indonesia", slug: "indonesia", flag: "🇮🇩", count: 456 },
  { name: "India", slug: "india", flag: "🇮🇳", count: 1200 },
  { name: "Italy", slug: "italy", flag: "🇮🇹", count: 234 },
  { name: "Japan", slug: "japan", flag: "🇯🇵", count: 1500 },
  { name: "Canada", slug: "canada", flag: "🇨🇦", count: 345 },
  { name: "Korea", slug: "korea", flag: "🇰🇷", count: 2100 },
  { name: "Malaysia", slug: "malaysia", flag: "🇲🇾", count: 123 },
  { name: "Mexico", slug: "mexico", flag: "🇲🇽", count: 178 },
  { name: "Philippines", slug: "philippines", flag: "🇵🇭", count: 145 },
  { name: "Romania", slug: "romania", flag: "🇷🇴", count: 89 },
  { name: "Russia", slug: "russia", flag: "🇷🇺", count: 234 },
  { name: "Taiwan", slug: "taiwan", flag: "🇹🇼", count: 345 },
  { name: "Thailand", slug: "thailand", flag: "🇹🇭", count: 678 },
  { name: "Spain", slug: "spain", flag: "🇪🇸", count: 289 },
  { name: "Turkey", slug: "turkey", flag: "🇹🇷", count: 456 },
  { name: "Vietnam", slug: "vietnam", flag: "🇻🇳", count: 123 },
  { name: "Netherlands", slug: "netherlands", flag: "🇳🇱", count: 89 },
];

export default function NegaraPageClient() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <CategoryBar />

      <PageHeader 
        breadcrumb="Semua Negara"
        totalItems={countries.length}
      />

      <div className="category-list-page">
        <h2 className="category-list-title">Select Country</h2>
        <div className="category-grid">
          {countries.map((country) => (
            <Link
              key={country.slug}
              href={`/country/${country.slug}`}
              className="category-card"
            >
              <span className="category-icon">{country.flag}</span>
              <span className="category-name">{country.name}</span>
              <span className="category-count">{country.count} Film</span>
            </Link>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
