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
const countries = [
  "Amerika", "Australia", "Cina", "Perancis", "Jerman", "Hongkong",
  "Indonesia", "India", "Inggris", "Itali", "Jepang", "Kanada",
  "Korea", "Malaysia", "Meksiko", "Pilipina", "Romania", "Rusia", "Taiwan", "Thailand"
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
  
  // Debug log - remove after testing
  const handleFilterClick = () => {
    console.log("Filter values:", { selectedGenre1, selectedGenre2, selectedCountry, selectedYear, selectedType });
    handleFilter();
  };

  const handleFilter = () => {
    // Check if any filter is actually selected
    const hasGenre1 = selectedGenre1 && selectedGenre1.trim() !== "" && genres.includes(selectedGenre1);
    const hasGenre2 = selectedGenre2 && selectedGenre2.trim() !== "" && genres.includes(selectedGenre2);
    const hasCountry = selectedCountry && selectedCountry.trim() !== "" && countries.includes(selectedCountry);
    const hasYear = selectedYear && selectedYear.trim() !== "" && years.includes(selectedYear);
    
    // Priority: Genre > Country > Year > Type
    if (hasGenre1) {
      router.push(`/genre/${selectedGenre1.toLowerCase().replace(/ /g, "-")}`);
    } else if (hasGenre2) {
      router.push(`/genre/${selectedGenre2.toLowerCase().replace(/ /g, "-")}`);
    } else if (hasCountry) {
      router.push(`/country/${selectedCountry.toLowerCase()}`);
    } else if (hasYear) {
      router.push(`/year/${selectedYear}`);
    } else if (selectedType === "Series") {
      router.push("/series");
    } else if (selectedType === "Movie") {
      router.push("/popular");
    } else if (selectedType === "Semua Film") {
      router.push("/movies");
    } else {
      // No filter selected, go to all movies
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
                  <option value="">Negara</option>
                  {countries.map((country) => (
                    <option key={country} value={country}>{country}</option>
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

