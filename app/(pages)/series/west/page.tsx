import type { Metadata } from "next";
import { guardDataRoute } from "@/lib/requestGuard";
import { buildMetadata } from "@/lib/metadata";
import SeriesWestPageClient from "./SeriesWestPageClient";

export const revalidate = 60;
export const metadata: Metadata = buildMetadata({
  title: "Series West",
  description: "Series Barat sub indo di LK21.",
});

export default async function SeriesWestPage() {
  const res = await guardDataRoute("/series/west");
  if (res) throw res;
  return <SeriesWestPageClient />;
}
