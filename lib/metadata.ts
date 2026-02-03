import type { Metadata } from "next";

const SITE_NAME = "LK21 (Layarkaca21)";
const DEFAULT_DESCRIPTION =
  "Nonton film dan series online gratis sub indo kualitas HD. LK21 Layarkaca21.";

export function buildMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
}: {
  title: string;
  description?: string;
}): Metadata {
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  return { title: fullTitle, description };
}

export function slugToGenreTitle(slug: string): string {
  const decoded = decodeURIComponent(slug || "").replace(/\+/g, " ").trim();
  return decoded
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

export function slugToCountryName(slug: string): string {
  const map: Record<string, string> = {
    "united-states": "United States",
    "united-kingdom": "United Kingdom",
    australia: "Australia",
    china: "China",
    "hong-kong": "Hong Kong",
    india: "India",
    indonesia: "Indonesia",
    italy: "Italy",
    japan: "Japan",
    germany: "Germany",
    canada: "Canada",
    korea: "Korea",
    malaysia: "Malaysia",
    mexico: "Mexico",
    france: "France",
    philippines: "Philippines",
    romania: "Romania",
    russia: "Russia",
    taiwan: "Taiwan",
    thailand: "Thailand",
    spain: "Spain",
    turkey: "Turkey",
    vietnam: "Vietnam",
    netherlands: "Netherlands",
  };
  const s = slug.toLowerCase().trim();
  return map[s] ?? s.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}
