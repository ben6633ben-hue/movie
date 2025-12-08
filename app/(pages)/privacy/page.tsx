"use client";

import Navbar from "@/app/components/Navbar";
import CategoryBar from "@/app/components/CategoryBar";
import Footer from "@/app/components/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <CategoryBar />

      <div className="info-page">
        <div className="info-container">
          <h1>Privacy Policy</h1>
          
          <div className="info-content">
            <p><em>Terakhir diperbarui: Desember 2025</em></p>

            <h2>Informasi yang Kami Kumpulkan</h2>
            <p>
              Kami mengumpulkan informasi yang Anda berikan secara langsung, 
              seperti ketika Anda membuat akun, mengirim permintaan, atau 
              menghubungi kami.
            </p>

            <h2>Penggunaan Informasi</h2>
            <p>Informasi yang kami kumpulkan digunakan untuk:</p>
            <ul>
              <li>Menyediakan dan memelihara layanan kami</li>
              <li>Memberitahu Anda tentang perubahan layanan</li>
              <li>Memungkinkan partisipasi dalam fitur interaktif</li>
              <li>Memberikan dukungan pelanggan</li>
              <li>Menganalisis penggunaan untuk meningkatkan layanan</li>
            </ul>

            <h2>Cookies</h2>
            <p>
              Kami menggunakan cookies dan teknologi pelacakan serupa untuk 
              melacak aktivitas di layanan kami dan menyimpan informasi tertentu.
            </p>

            <h2>Keamanan Data</h2>
            <p>
              Keamanan data Anda penting bagi kami, tetapi ingat bahwa tidak 
              ada metode transmisi melalui Internet yang 100% aman.
            </p>

            <h2>Tautan ke Situs Lain</h2>
            <p>
              Layanan kami mungkin berisi tautan ke situs lain yang tidak 
              dioperasikan oleh kami. Kami tidak bertanggung jawab atas 
              konten atau praktik privasi situs pihak ketiga.
            </p>

            <h2>Hubungi Kami</h2>
            <p>
              Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini, 
              silakan hubungi kami melalui halaman kontak.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

