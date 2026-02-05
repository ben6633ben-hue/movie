import type { Metadata } from "next";
import { guardDataRoute } from "@/lib/requestGuard";
import { buildMetadata } from "@/lib/metadata";
import PopularPageClient from "./PopularPageClient";

export const metadata: Metadata = buildMetadata({
  title: "Film Terpopuler",
  description: "Film terpopuler sub indo di LK21. Nonton film paling banyak ditonton.",
});

export default async function PopularPage() {
  const res = await guardDataRoute("/popular");
  if (res) throw res;
  return <PopularPageClient />;
}
