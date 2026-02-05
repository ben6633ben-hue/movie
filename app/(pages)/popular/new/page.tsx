import type { Metadata } from "next";
import { guardDataRoute } from "@/lib/requestGuard";
import { buildMetadata } from "@/lib/metadata";
import NewUploadPageClient from "./NewUploadPageClient";

export const revalidate = 60;
export const metadata: Metadata = buildMetadata({
  title: "Film Terbaru",
  description: "Film terbaru sub indo 2025–2026. Baru diupload di LK21.",
});

export default async function NewUploadPage() {
  const res = await guardDataRoute("/popular/new");
  if (res) throw res;
  return <NewUploadPageClient />;
}
