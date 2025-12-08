"use client";

import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import CategoryBar from "@/app/components/CategoryBar";
import Footer from "@/app/components/Footer";

export default function FAQPage() {
  const faqs = [
    {
      question: "Apa itu Layarkaca21?",
      answer: "Layarkaca21 atau disingkat Lk21 adalah platform yang menyediakan informasi film dan serial dari berbagai sumber di internet. Kami tidak menyimpan atau meng-host konten apapun di server kami, melainkan menampilkan tautan dari pihak ketiga."
    },
    {
      question: "Apakah menonton di situs ini legal?",
      answer: "Legalitas tergantung pada yurisdiksi negara Anda. Kami hanya menampilkan tautan yang tersedia secara publik. Gunakan layanan ini dengan bijak dan sesuai hukum yang berlaku di wilayah Anda."
    },
    {
      question: "Apakah situs ini gratis?",
      answer: "Ya, situs ini sepenuhnya gratis dan tidak memerlukan pendaftaran. Kami tidak memungut biaya untuk mengakses informasi film atau tautan pihak ketiga."
    },
    {
      question: "Mengapa ada banyak iklan?",
      answer: "Iklan membantu mendukung operasional situs agar tetap online dan gratis untuk semua pengguna. Namun, kami berusaha menempatkan iklan yang tidak mengganggu kenyamanan Anda."
    },
    {
      question: "Film yang saya cari tidak tersedia, apa yang harus saya lakukan?",
      answer: "Silakan gunakan fitur pencarian atau periksa kembali dalam beberapa hari. Kami terus memperbarui database film dan serial secara berkala."
    },
    {
      question: "Bagaimana jika ada pelanggaran hak cipta?",
      answer: "Kami menghormati hak kekayaan intelektual. Jika Anda adalah pemilik hak cipta dan menemukan pelanggaran, silakan lihat halaman DMCA Notice kami dan kirimkan pemberitahuan resmi.",
      hasLink: true
    },
    {
      question: "Apakah saya bisa request film atau series?",
      answer: "Saat ini kami belum menerima permintaan film secara manual, namun fitur ini akan kami pertimbangkan di masa depan."
    },
    {
      question: "Saya mengalami error saat memutar film. Apa solusinya?",
      answer: "Cobalah ganti player atau refresh halaman. Jika masalah tetap terjadi, kemungkinan besar sumber video dari pihak ketiga sedang down."
    },
    {
      question: "Apakah situs ini aman untuk dikunjungi?",
      answer: "Kami berusaha menjaga keamanan situs. Namun, kami sarankan menggunakan ad-blocker dan VPN untuk perlindungan tambahan saat berselancar di internet."
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <CategoryBar />

      <div className="info-page">
        <div className="info-container">
          <h1>FAQ – Pertanyaan yang Sering Diajukan</h1>
          
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <h3>{faq.question}</h3>
                <p>
                  {faq.answer}
                  {faq.hasLink && (
                    <> <Link href="/dmca" className="faq-link">Lihat DMCA Notice</Link></>
                  )}
                </p>
              </div>
            ))}
          </div>

          <p className="faq-updated"><em>Terakhir diperbarui: 23 Juli 2025</em></p>
        </div>
      </div>

      <Footer />
    </div>
  );
}

