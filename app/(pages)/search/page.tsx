import type { Metadata } from "next";
import { guardDataRoute } from "@/lib/requestGuard";
import { buildMetadata } from "@/lib/metadata";
import SearchPageClient from "./SearchPageClient";

export const metadata: Metadata = buildMetadata({
  title: "Cari Film",
  description: "Cari film dan series sub indo di LK21. Cari berdasarkan judul.",
});

export default async function SearchPage() {
  const res = await guardDataRoute("/search");
  if (res) throw res;
  return <SearchPageClient />;
}
