"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  MagnifyingGlassIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/solid";
import {
  HeartIcon,
  FilmIcon,
  StarIcon,
  GlobeAltIcon,
  CalendarIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";

const dropdownData: Record<string, { items: string[]; footer?: string }> = {
  Genre: {
    items: [
      "Action",
      "History",
      "Adventure",
      "Horror",
      "Animation",
      "Musical",
      "Biography",
      "Mystery",
      "Comedy",
      "Romance",
      "Crime",
      "Sci-Fi",
      "Documentary",
      "Sport",
      "Drama",
      "Thriller",
      "Family",
      "War",
      "Fantasy",
      "Western",
    ],
    footer: "GENRE LAINNYA",
  },
  Series: {
    items: [
      "Daftar Series",
      "Series Complete",
      "Series Terbaru",
      "Series Asian",
      "Series Ongoing",
      "Series West",
    ],
    footer: "SERIES LAINNYA",
  },
  Populer: {
    items: [
      "Terpopuler",
      "Release",
      "Komen Terbanyak",
      "Baru Diupload",
      "Rating",
      "",
    ],
  },
  Negara: {
    items: [
      "Amerika",
      "Jepang",
      "Australia",
      "Kanada",
      "Cina",
      "Korea",
      "Perancis",
      "Malaysia",
      "Jerman",
      "Meksiko",
      "Hongkong",
      "Pilipina",
      "Indonesia",
      "Romania",
      "India",
      "Rusia",
      "Inggris",
      "Taiwan",
      "Itali",
      "Tailand",
    ],
    footer: "NEGARA LAINNYA",
  },
  Tahun: {
    items: Array.from({ length: 20 }, (_, i) => String(2025 - i)),
  },
  More: {
    items: [
      "Rekomendasi",
      "Privacy Policy",
      "Request Movie",
      "DMCA",
      "Cara Install VPN",
      "FAQ",
    ],
  },
};

export default function Navbar() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  // Check if mobile on mount
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const navItems = [
    { label: "Genre", icon: Bars3Icon },
    // { label: "Series", icon: HeartIcon },
    { label: "Populer", icon: StarIcon },
    { label: "Negara", icon: GlobeAltIcon },
    { label: "Tahun", icon: CalendarIcon },
    { label: "More", icon: Bars3Icon },
  ];

  const handleMouseEnter = (label: string) => {
    if (!isMobile) {
      setOpenDropdown(label);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setOpenDropdown(null);
    }
  };

  const handleClick = (label: string) => {
    if (openDropdown === label) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(label);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const getDropdownLink = (category: string, item: string): string => {
    const itemLower = item.toLowerCase();

    switch (category) {
      case "Genre":
        return `/genre/${itemLower}`;
      case "Series":
        const seriesMap: Record<string, string> = {
          "daftar series": "/series",
          "series terbaru": "/series/terbaru",
          "series ongoing": "/series/ongoing",
          "series complete": "/series/complete",
          "series asian": "/series/asian",
          "series west": "/series/west",
        };
        return seriesMap[itemLower] || "/series";
      case "Populer":
        const populerMap: Record<string, string> = {
          terpopuler: "/popular",
          release: "/popular/release",
          "komen terbanyak": "/popular",
          "baru diupload": "/popular/new",
          rating: "/popular/rating",
        };
        return populerMap[itemLower] || "/popular";
      case "Negara":
        return `/country/${itemLower}`;
      case "Tahun":
        return `/year/${item}`;
      case "More":
        const moreMap: Record<string, string> = {
          rekomendasi: "/rekomendasi",
          "request movie": "/request",
          "cara install vpn": "/vpn",
          "privacy policy": "/privacy",
          dmca: "/dmca",
          faq: "/faq",
        };
        return moreMap[itemLower] || "#";
      default:
        return "#";
    }
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <Link href="/" className="navbar-logo">
        <FilmIcon className="w-7 h-7 text-white" />
        <h1 className="text-white text-xl font-black tracking-tight">
          LAYARKACA<span style={{ color: "var(--yellow-color)" }}>21</span>
        </h1>
      </Link>

      {/* Search bar */}
      <form className="navbar-search" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Cari judul film di Lk21"
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className="search-icon">
          <MagnifyingGlassIcon className="w-5 h-5" />
        </button>
      </form>

      {/* Nav items */}
      <div className="navbar-nav">
        {navItems.map((item) => (
          <div
            key={item.label}
            className="nav-item-wrapper"
            onMouseEnter={() => handleMouseEnter(item.label)}
            onMouseLeave={handleMouseLeave}
          >
            <button
              className={`nav-item ${
                openDropdown === item.label ? "active" : ""
              }`}
              onClick={() => handleClick(item.label)}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
              <ChevronDownIcon className="w-3 h-3" />
            </button>

            {openDropdown === item.label && dropdownData[item.label] && (
              <div
                className={`dropdown-menu ${
                  ["Negara", "Tahun", "More"].includes(item.label)
                    ? "right-aligned"
                    : ""
                }`}
              >
                <div className="dropdown-grid">
                  {dropdownData[item.label].items.map((subItem, index) =>
                    subItem ? (
                      <Link
                        key={index}
                        href={getDropdownLink(item.label, subItem)}
                        className="dropdown-item"
                      >
                        {subItem}
                      </Link>
                    ) : (
                      <span key={index} className="dropdown-item-empty"></span>
                    )
                  )}
                </div>
                {dropdownData[item.label].footer && (
                  <Link
                    href={
                      item.label === "Genre"
                        ? "/genre"
                        : item.label === "Negara"
                        ? "/negara"
                        : `/${item.label.toLowerCase()}`
                    }
                    className="dropdown-footer"
                  >
                    {dropdownData[item.label].footer}
                  </Link>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
}
