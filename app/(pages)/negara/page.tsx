"use client";

import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import CategoryBar from "@/app/components/CategoryBar";
import Footer from "@/app/components/Footer";
import PageHeader from "@/app/components/PageHeader";

const countries = [
  { name: "Amerika", flag: "🇺🇸", count: 3500 },
  { name: "Australia", flag: "🇦🇺", count: 234 },
  { name: "Cina", flag: "🇨🇳", count: 890 },
  { name: "Perancis", flag: "🇫🇷", count: 345 },
  { name: "Jerman", flag: "🇩🇪", count: 289 },
  { name: "Hongkong", flag: "🇭🇰", count: 567 },
  { name: "Indonesia", flag: "🇮🇩", count: 456 },
  { name: "India", flag: "🇮🇳", count: 1200 },
  { name: "Inggris", flag: "🇬🇧", count: 890 },
  { name: "Itali", flag: "🇮🇹", count: 234 },
  { name: "Jepang", flag: "🇯🇵", count: 1500 },
  { name: "Kanada", flag: "🇨🇦", count: 345 },
  { name: "Korea", flag: "🇰🇷", count: 2100 },
  { name: "Malaysia", flag: "🇲🇾", count: 123 },
  { name: "Meksiko", flag: "🇲🇽", count: 178 },
  { name: "Pilipina", flag: "🇵🇭", count: 145 },
  { name: "Romania", flag: "🇷🇴", count: 89 },
  { name: "Rusia", flag: "🇷🇺", count: 234 },
  { name: "Taiwan", flag: "🇹🇼", count: 345 },
  { name: "Thailand", flag: "🇹🇭", count: 678 },
  { name: "Spanyol", flag: "🇪🇸", count: 289 },
  { name: "Turki", flag: "🇹🇷", count: 456 },
  { name: "Vietnam", flag: "🇻🇳", count: 123 },
  { name: "Belanda", flag: "🇳🇱", count: 89 },
];

export default function CountryListPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <CategoryBar />

      <PageHeader 
        breadcrumb="Semua Negara"
        totalItems={countries.length}
      />

      <div className="category-list-page">
        <h2 className="category-list-title">Pilih Negara Asal Film</h2>
        <div className="category-grid">
          {countries.map((country) => (
            <Link 
              key={country.name} 
              href={`/country/${country.name.toLowerCase()}`}
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

