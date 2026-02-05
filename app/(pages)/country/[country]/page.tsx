import type { Metadata } from "next";
import { guardDataRoute } from "@/lib/requestGuard";
import { buildMetadata, slugToCountryName } from "@/lib/metadata";
import CountryPageClient from "./CountryPageClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string }>;
}): Promise<Metadata> {
  const { country } = await params;
  const name = slugToCountryName(country);
  return buildMetadata({
    title: `Film ${name} Sub Indo`,
    description: `Nonton film dari ${name} sub indo gratis di LK21. Koleksi film ${name} terbaru.`,
  });
}

export default async function CountryPage({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country } = await params;
  const res = await guardDataRoute(`/country/${country}`);
  if (res) throw res;
  return <CountryPageClient />;
}
