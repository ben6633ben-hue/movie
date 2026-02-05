import type { Metadata } from "next";
import { guardDataRoute } from "@/lib/requestGuard";
import { buildMetadata } from "@/lib/metadata";
import SeriesOngoingPageClient from "./SeriesOngoingPageClient";

export const metadata: Metadata = buildMetadata({
  title: "Series Ongoing",
  description: "Series sedang tayang sub indo di LK21.",
});

export default async function SeriesOngoingPage() {
  const res = await guardDataRoute("/series/ongoing");
  if (res) throw res;
  return <SeriesOngoingPageClient />;
}
