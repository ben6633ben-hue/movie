"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AdjustmentsHorizontalIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";

export default function TabBar() {
  const pathname = usePathname();

  const tabs = [
    { label: "TERBARU", href: "/popular/new" },
    { label: "SERIES UNGGULAN", href: "/series" },
    { label: "TERPOPULER", href: "/popular" },
    { label: "REKOMENDASI", href: "/rekomendasi" },
  ];

  const isActive = (href: string) => {
    if (pathname === "/") return href === "/popular/new";
    return pathname === href;
  };

  return (
    <div className="tab-bar-wrapper">
      <div className="tab-bar">
        <div className="tab-items">
          {tabs.map((tab) => (
            <Link
              key={tab.label}
              href={tab.href}
              className={`tab-item ${isActive(tab.href) ? "active" : ""}`}
            >
              {tab.label}
            </Link>
          ))}
          <Link href="/year/2025" className="tab-item flex items-center gap-1" aria-label="Film tahun 2025">
            <CalendarIcon className="w-4 h-4" aria-hidden />
            <span>2025</span>
          </Link>
        </div>

        <Link href="/movies" className="filter-button" aria-label="Filter semua film">
          <AdjustmentsHorizontalIcon className="w-4 h-4" aria-hidden />
          <span>FILTER</span>
        </Link>
      </div>
    </div>
  );
}
