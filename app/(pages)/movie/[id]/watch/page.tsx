"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

/** Redirects /movie/[id]/watch → /movie/[id]. */
export default function WatchRedirect() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  useEffect(() => {
    if (id) router.replace(`/movie/${id}`);
  }, [id, router]);

  return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <div className="animate-spin rounded-full h-10 w-10 border-2 border-pink-500 border-t-transparent" />
    </div>
  );
}
