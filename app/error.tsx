"use client";

import { useEffect } from "react";
import Link from "next/link";
import Navbar from "./components/Navbar";
import CategoryBar from "./components/CategoryBar";
import Footer from "./components/Footer";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.error("App error:", error);
    }
  }, [error]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <CategoryBar />
      <div
        className="flex flex-col items-center justify-center py-20 px-4"
        style={{
          backgroundColor: "var(--light-color, #fff)",
          color: "var(--font-color, #333)",
        }}
      >
        <h1
          className="mb-2 text-center font-bold"
          style={{ fontSize: "1.75rem", color: "var(--dark-color, #333)" }}
        >
          Terjadi kesalahan
        </h1>
        <p
          className="mb-6 max-w-md text-center"
          style={{ fontSize: "1rem", color: "var(--dark-color, #333)", opacity: 0.9 }}
        >
          Terjadi kesalahan. Silakan coba lagi.
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={reset}
            className="rounded px-4 py-2 font-medium text-white transition-colors"
            style={{ backgroundColor: "var(--primary-color, #e3166b)" }}
            aria-label="Coba lagi memuat halaman"
          >
            Coba lagi
          </button>
          <Link
            href="/"
            className="rounded border px-4 py-2 font-medium transition-colors"
            style={{
              borderColor: "var(--dark-color, #333)",
              color: "var(--dark-color, #333)",
            }}
          >
            Beranda
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
