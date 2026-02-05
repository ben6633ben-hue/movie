import type { Metadata } from "next";
import { guardDataRoute } from "@/lib/requestGuard";
import { buildMetadata } from "@/lib/metadata";
import ReleasePageClient from "./ReleasePageClient";

export const revalidate = 60;
export const metadata: Metadata = buildMetadata({
  title: "Release Terbaru",
  description: "Film dan series release terbaru sub indo di LK21.",
});

export default async function ReleasePage() {
  const res = await guardDataRoute("/popular/release");
  if (res) throw res;
  return <ReleasePageClient />;
}
