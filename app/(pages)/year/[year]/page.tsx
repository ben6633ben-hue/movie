import type { Metadata } from "next";
import { guardDataRoute } from "@/lib/requestGuard";
import { buildMetadata } from "@/lib/metadata";
import YearPageClient from "./YearPageClient";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ year: string }>;
}): Promise<Metadata> {
  const { year } = await params;
  return buildMetadata({
    title: `Film Tahun ${year} Sub Indo`,
    description: `Nonton film tahun ${year} sub indo gratis di LK21. Film terbaru ${year}.`,
  });
}

export default async function YearPage({
  params,
}: {
  params: Promise<{ year: string }>;
}) {
  const { year } = await params;
  const res = await guardDataRoute(`/year/${year}`);
  if (res) throw res;
  return <YearPageClient />;
}
