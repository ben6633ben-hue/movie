"use client";

import Navbar from "@/app/components/Navbar";
import CategoryBar from "@/app/components/CategoryBar";
import Footer from "@/app/components/Footer";

export default function DMCAPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <CategoryBar />

      <div className="info-page">
        <div className="info-container">
          <h1>DMCA Notice</h1>
          
          <div className="info-content">
            <p>
              Kami menghormati hak kekayaan intelektual orang lain dan berharap 
              Anda juga demikian. Sesuai dengan ketentuan Digital Millennium 
              Copyright Act (DMCA), kami akan merespons permintaan penghapusan 
              yang sah terkait dugaan pelanggaran hak cipta yang terjadi di situs ini.
            </p>

            <h2>1. Tautan Pihak Ketiga</h2>
            <p>
              Layarkaca21 tidak menyimpan file film, video, atau media apapun di 
              server kami. Semua konten yang ditampilkan bersumber dari situs pihak 
              ketiga seperti layanan streaming publik, yang tersedia secara terbuka 
              di internet.
            </p>

            <h2>2. Ajukan Permintaan Penghapusan</h2>
            <p>
              Jika Anda adalah pemilik hak cipta atau mewakili pihak pemilik hak, 
              dan merasa ada pelanggaran yang terjadi, Anda dapat mengirimkan 
              pemberitahuan DMCA kepada kami dengan menyertakan informasi berikut:
            </p>
            <ul>
              <li>Identitas dan informasi kontak lengkap Anda.</li>
              <li>Deskripsi karya berhak cipta yang dilanggar.</li>
              <li>URL spesifik yang mengandung materi pelanggaran.</li>
              <li>Pernyataan bahwa Anda memiliki keyakinan bahwa penggunaan materi tersebut tidak diizinkan oleh pemilik hak cipta.</li>
              <li>Pernyataan di bawah sumpah bahwa informasi dalam pemberitahuan ini adalah akurat dan Anda adalah pemilik hak atau diizinkan bertindak atas nama pemilik hak cipta.</li>
              <li>Tanda tangan fisik atau elektronik Anda.</li>
            </ul>
            <p>
              Silakan kirim permintaan ke email berikut: <strong>dmca[at]layarkaca21.com</strong>
            </p>

            <h2>3. Tindakan Kami</h2>
            <p>
              Setelah menerima pemberitahuan yang valid, kami akan memprosesnya 
              dalam waktu 48–72 jam hari kerja. Kami dapat menghapus atau menonaktifkan 
              akses terhadap konten terkait sementara kami menyelidiki klaim tersebut.
            </p>

            <h2>4. Catatan Tambahan</h2>
            <p>
              Kami bukan host video dan tidak mengendalikan konten dari situs pihak 
              ketiga. Jika Anda ingin konten dihapus secara menyeluruh, kami menyarankan 
              Anda juga menghubungi platform sumber asli konten tersebut.
            </p>

            <p><em>Terakhir diperbarui: 23 Juli 2025</em></p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

