import Link from "next/link";
import Navbar from "./components/Navbar";
import CategoryBar from "./components/CategoryBar";
import Footer from "./components/Footer";

export default function NotFound() {
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
          404 – Halaman tidak ditemukan
        </h1>
        <p
          className="mb-6 max-w-md text-center"
          style={{ fontSize: "1rem", color: "var(--dark-color, #333)", opacity: 0.9 }}
        >
          URL yang Anda minta tidak ada atau telah dipindahkan.
        </p>
        <Link
          href="/"
          className="rounded px-4 py-2 font-medium text-white transition-colors"
          style={{ backgroundColor: "var(--primary-color, #e3166b)" }}
        >
          Kembali ke Beranda
        </Link>
      </div>
      <Footer />
    </div>
  );
}
