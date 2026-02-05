import type { Metadata } from "next";
import { guardDataRoute } from "@/lib/requestGuard";
import { buildMetadata } from "@/lib/metadata";
import MoviesPageClient from "./MoviesPageClient";

export const revalidate = 60;
export const metadata: Metadata = buildMetadata({
  title: "Semua Film Sub Indo",
  description: "Daftar lengkap semua film sub indo di LK21. Nonton film gratis streaming.",
});

export default async function MoviesPage() {
  const res = await guardDataRoute("/movies");
  if (res) throw res;
  return <MoviesPageClient />;
}
