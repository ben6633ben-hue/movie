import type { Metadata } from "next";
import { guardDataRoute } from "@/lib/requestGuard";
import { buildMetadata } from "@/lib/metadata";
import NegaraPageClient from "./NegaraPageClient";

export const revalidate = 60;
export const metadata: Metadata = buildMetadata({
  title: "Film by Negara",
  description: "Nonton film berdasarkan negara sub indo di LK21.",
});

export default async function NegaraPage() {
  const res = await guardDataRoute("/negara");
  if (res) throw res;
  return <NegaraPageClient />;
}
