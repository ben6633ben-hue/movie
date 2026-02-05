import type { Metadata } from "next";
import { guardDataRoute } from "@/lib/requestGuard";
import { buildMetadata } from "@/lib/metadata";
import GenreListClient from "./GenreListClient";

export const metadata: Metadata = buildMetadata({
  title: "Semua Genre Film",
  description: "Pilih genre film: Action, Drama, Horror, Comedy, dan lainnya sub indo di LK21.",
});

export default async function GenreListPage() {
  const res = await guardDataRoute("/genre");
  if (res) throw res;
  return <GenreListClient />;
}
