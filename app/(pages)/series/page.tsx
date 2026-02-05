import type { Metadata } from "next";
import { guardDataRoute } from "@/lib/requestGuard";
import { buildMetadata } from "@/lib/metadata";
import SeriesPageClient from "./SeriesPageClient";

export const metadata: Metadata = buildMetadata({
  title: "Series Sub Indo",
  description: "Nonton series sub indo gratis di LK21. Daftar series terbaru.",
});

export default async function SeriesPage() {
  const res = await guardDataRoute("/series");
  if (res) throw res;
  return <SeriesPageClient />;
}
