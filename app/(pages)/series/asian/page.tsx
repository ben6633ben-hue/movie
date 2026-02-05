import type { Metadata } from "next";
import { guardDataRoute } from "@/lib/requestGuard";
import { buildMetadata } from "@/lib/metadata";
import SeriesAsianPageClient from "./SeriesAsianPageClient";

export const metadata: Metadata = buildMetadata({
  title: "Series Asian",
  description: "Series Asian (Korea, Thailand, dll) sub indo di LK21.",
});

export default async function SeriesAsianPage() {
  const res = await guardDataRoute("/series/asian");
  if (res) throw res;
  return <SeriesAsianPageClient />;
}
