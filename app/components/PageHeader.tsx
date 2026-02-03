"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { HomeIcon, ChevronDownIcon } from "@heroicons/react/24/solid";

interface Props {
  breadcrumb: string;
  totalItems: number;
  currentPage?: number;
  totalPages?: number;
}

const years = Array.from({ length: 20 }, (_, i) => String(2025 - i));
const types = ["Semua Film", "Movie", "Series"];
const genres = [
  "Action", "Adventure", "Animation", "Biography", "Comedy", "Crime",
  "Documentary", "Drama", "Family", "Fantasy", "History", "Horror",
  "Musical", "Mystery", "Romance", "Sci-Fi", "Sport", "Thriller", "War", "Western"
];
const countries: { name: string; slug: string }[] = [
  { name: "United States", slug: "united-states" },
  { name: "United Kingdom", slug: "united-kingdom" },
  { name: "Australia", slug: "australia" },
  { name: "China", slug: "china" },
  { name: "France", slug: "france" },
  { name: "Germany", slug: "germany" },
  { name: "Hong Kong", slug: "hong-kong" },
  { name: "Indonesia", slug: "indonesia" },
  { name: "India", slug: "india" },
  { name: "Italy", slug: "italy" },
  { name: "Japan", slug: "japan" },
  { name: "Canada", slug: "canada" },
  { name: "Korea", slug: "korea" },
  { name: "Malaysia", slug: "malaysia" },
  { name: "Mexico", slug: "mexico" },
  { name: "Philippines", slug: "philippines" },
  { name: "Romania", slug: "romania" },
  { name: "Russia", slug: "russia" },
  { name: "Taiwan", slug: "taiwan" },
  { name: "Thailand", slug: "thailand" },
  { name: "Spain", slug: "spain" },
  { name: "Turkey", slug: "turkey" },
  { name: "Vietnam", slug: "vietnam" },
  { name: "Netherlands", slug: "netherlands" },
];

export default function PageHeader({ 
  breadcrumb, 
  totalItems,
  currentPage = 1,
  totalPages = Math.ceil(totalItems / 12)
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedGenre1, setSelectedGenre1] = useState<string>("");
  const [selectedGenre2, setSelectedGenre2] = useState<string>("");
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const router = useRouter();
  
  const handleFilterClick = () => {
    handleFilter();
  };

  const handleFilter = () => {
    const hasGenre1 = selectedGenre1 && selectedGenre1.trim() !== "" && genres.includes(selectedGenre1);
    const hasGenre2 = selectedGenre2 && selectedGenre2.trim() !== "" && genres.includes(selectedGenre2);
    const hasCountry = selectedCountry && selectedCountry.trim() !== "";
    const hasYear = selectedYear && selectedYear.trim() !== "" && years.includes(selectedYear);
    
    // Priority: Genre > Country > Year > Type
    if (hasGenre1) {
      router.push(`/genre/${selectedGenre1.toLowerCase().replace(/ /g, "-")}`);
    } else if (hasGenre2) {
      router.push(`/genre/${selectedGenre2.toLowerCase().replace(/ /g, "-")}`);
    } else if (hasCountry) {
      router.push(`/country/${selectedCountry}`);
    } else if (hasYear) {
      router.push(`/year/${selectedYear}`);
    } else if (selectedType === "Series") {
      router.push("/series");
    } else if (selectedType === "Movie") {
      router.push("/popular");
    } else if (selectedType === "Semua Film") {
      router.push("/movies");
    } else {
      router.push("/movies");
    }
    setIsOpen(false);
  };

  const handleReset = () => {
    setSelectedYear("");
    setSelectedType("");
    setSelectedGenre1("");
    setSelectedGenre2("");
    setSelectedCountry("");
    setIsOpen(false);
  };

  return (
    <div className="page-header-bar">
      <div className="page-header-content">
        <div className="breadcrumb">
          <Link href="/" className="home-link">
            <HomeIcon className="w-4 h-4" />
          </Link>
          <span className="separator">/</span>
          <span className="current">{breadcrumb}</span>
        </div>

        <div className="filter-wrapper">
          <button 
            className="filter-dropdown"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span>FILTER</span>
            <ChevronDownIcon className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {isOpen && (
            <div className="filter-panel-new">
              <p className="filter-description">
                Tampilkan daftar film sesuai dengan kesukaan anda.
              </p>

              <div className="filter-select-wrapper">
                <select 
                  value={selectedYear} 
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="filter-select"
                >
                  <option value="">Tahun Pembuatan</option>
                  {years.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                <ChevronDownIcon className="select-icon" />
              </div>

              <div className="filter-select-wrapper">
                <select 
                  value={selectedType} 
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="filter-select"
                >
                  <option value="">Tipe</option>
                  {types.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <ChevronDownIcon className="select-icon" />
              </div>

              <div className="filter-select-wrapper">
                <select 
                  value={selectedGenre1} 
                  onChange={(e) => setSelectedGenre1(e.target.value)}
                  className="filter-select"
                >
                  <option value="">Genre 1</option>
                  {genres.map((genre) => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </select>
                <ChevronDownIcon className="select-icon" />
              </div>

              <div className="filter-select-wrapper">
                <select 
                  value={selectedGenre2} 
                  onChange={(e) => setSelectedGenre2(e.target.value)}
                  className="filter-select"
                >
                  <option value="">Genre 2</option>
                  {genres.map((genre) => (
                    <option key={`${genre}-2`} value={genre}>{genre}</option>
                  ))}
                </select>
                <ChevronDownIcon className="select-icon" />
              </div>

              <div className="filter-select-wrapper">
                <select 
                  value={selectedCountry} 
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="filter-select"
                >
                  <option value="">Country</option>
                  {countries.map((country) => (
                    <option key={country.slug} value={country.slug}>{country.name}</option>
                  ))}
                </select>
                <ChevronDownIcon className="select-icon" />
              </div>

              <div className="filter-buttons">
                <button 
                  type="button"
                  className="filter-btn-apply" 
                  onClick={handleFilterClick}
                >
                  Filter Movie
                </button>
                <button 
                  type="button"
                  className="filter-btn-cancel" 
                  onClick={handleReset}
                >
                  Batal
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="pagination-info">
        Halaman {currentPage} dari {totalPages} total halaman ({totalItems} film)
      </div>
    </div>
  );
}

