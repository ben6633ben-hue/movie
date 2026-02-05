import { guardDataRoute } from "@/lib/requestGuard";
import HomeClient from "./HomeClient";

export const revalidate = 60;

export default async function Home() {
  const res = await guardDataRoute("/");
  if (res) throw res;
  return <HomeClient />;
}
