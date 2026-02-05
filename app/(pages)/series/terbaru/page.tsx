import type { Metadata } from "next";
import { guardDataRoute } from "@/lib/requestGuard";
import { buildMetadata } from "@/lib/metadata";
import SeriesTerbaruPageClient from "./SeriesTerbaruPageClient";

export const revalidate = 60;
export const metadata: Metadata = buildMetadata({
  title: "Series Terbaru",
  description: "Series terbaru sub indo di LK21.",
});

export default async function SeriesTerbaruPage() {
  const res = await guardDataRoute("/series/terbaru");
  if (res) throw res;
  return <SeriesTerbaruPageClient />;
}
