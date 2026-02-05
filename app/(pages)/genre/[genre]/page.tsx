import type { Metadata } from "next";
import { guardDataRoute } from "@/lib/requestGuard";
import { buildMetadata, slugToGenreTitle } from "@/lib/metadata";
import GenrePageClient from "./GenrePageClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ genre: string }>;
}): Promise<Metadata> {
  const { genre } = await params;
  const name = slugToGenreTitle(genre);
  return buildMetadata({
    title: `Film ${name} Sub Indo`,
    description: `Nonton film ${name} terbaru sub indo gratis di LK21. Koleksi film ${name} kualitas HD.`,
  });
}

export default async function GenrePage({
  params,
}: {
  params: Promise<{ genre: string }>;
}) {
  const { genre } = await params;
  const res = await guardDataRoute(`/genre/${genre}`);
  if (res) throw res;
  return <GenrePageClient />;
}
