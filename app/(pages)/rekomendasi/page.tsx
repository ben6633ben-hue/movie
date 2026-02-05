import type { Metadata } from "next";
import { guardDataRoute } from "@/lib/requestGuard";
import { buildMetadata } from "@/lib/metadata";
import RekomendasiPageClient from "./RekomendasiPageClient";

export const revalidate = 60;
export const metadata: Metadata = buildMetadata({
  title: "Rekomendasi Film",
  description: "Rekomendasi film sub indo untuk kamu di LK21.",
});

export default async function RekomendasiPage() {
  const res = await guardDataRoute("/rekomendasi");
  if (res) throw res;
  return <RekomendasiPageClient />;
}
