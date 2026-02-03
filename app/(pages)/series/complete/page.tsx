import type { Metadata } from "next";
import { guardDataRoute } from "@/lib/requestGuard";
import { buildMetadata } from "@/lib/metadata";
import SeriesCompletePageClient from "./SeriesCompletePageClient";

export const metadata: Metadata = buildMetadata({
  title: "Series Complete",
  description: "Series sudah tamat sub indo di LK21.",
});

export default async function SeriesCompletePage() {
  const res = await guardDataRoute("/series/complete");
  if (res) return res;
  return <SeriesCompletePageClient />;
}
