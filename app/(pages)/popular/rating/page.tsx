import type { Metadata } from "next";
import { guardDataRoute } from "@/lib/requestGuard";
import { buildMetadata } from "@/lib/metadata";
import RatingPageClient from "./RatingPageClient";

export const metadata: Metadata = buildMetadata({
  title: "Rating Tertinggi",
  description: "Film dengan rating tertinggi sub indo di LK21.",
});

export default async function RatingPage() {
  const res = await guardDataRoute("/popular/rating");
  if (res) return res;
  return <RatingPageClient />;
}
