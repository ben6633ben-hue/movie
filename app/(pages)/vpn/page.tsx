"use client";

import Navbar from "@/app/components/Navbar";
import CategoryBar from "@/app/components/CategoryBar";
import Footer from "@/app/components/Footer";

export default function VPNPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <CategoryBar />

      <div className="info-page">
        <div className="info-container">
          <h1>Cara Install VPN Gratis</h1>
          
          <div className="info-content">
            <h2>Mengapa Perlu VPN?</h2>
            <p>
              VPN (Virtual Private Network) diperlukan untuk mengakses LK21 jika 
              website diblokir oleh ISP di lokasi kamu. Dengan VPN, kamu bisa 
              mengakses konten tanpa batasan.
            </p>

            <h2>Cara Install VPN di PC/Laptop</h2>
            <ol>
              <li>Download aplikasi VPN gratis seperti Proton VPN atau Windscribe</li>
              <li>Install aplikasi dan buat akun gratis</li>
              <li>Pilih server dari negara yang tidak memblokir</li>
              <li>Klik Connect dan tunggu hingga tersambung</li>
              <li>Buka browser dan akses LK21</li>
            </ol>

            <h2>Cara Install VPN di Android</h2>
            <ol>
              <li>Buka Google Play Store</li>
              <li>Cari "VPN" dan pilih aplikasi dengan rating tinggi</li>
              <li>Install dan buka aplikasi</li>
              <li>Pilih server dan sambungkan</li>
              <li>Buka browser atau aplikasi dan akses LK21</li>
            </ol>

            <h2>Cara Install VPN di iOS</h2>
            <ol>
              <li>Buka App Store</li>
              <li>Cari aplikasi VPN gratis</li>
              <li>Download dan install</li>
              <li>Izinkan konfigurasi VPN saat diminta</li>
              <li>Sambungkan ke server dan akses LK21</li>
            </ol>

            <h2>Rekomendasi VPN Gratis</h2>
            <ul>
              <li><strong>Proton VPN</strong> - Unlimited bandwidth, gratis</li>
              <li><strong>Windscribe</strong> - 10GB/bulan gratis</li>
              <li><strong>TunnelBear</strong> - 500MB/bulan gratis</li>
              <li><strong>1.1.1.1 Warp</strong> - Gratis dari Cloudflare</li>
            </ul>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

