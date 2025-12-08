"use client";

import Navbar from "@/app/components/Navbar";
import CategoryBar from "@/app/components/CategoryBar";
import Footer from "@/app/components/Footer";

export default function RequestPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <CategoryBar />

      <div className="info-page">
        <div className="info-container">
          <h1>Request Movie</h1>
          
          <div className="info-content">
            <p>
              Kamu bisa request film atau series favoritmu yang belum ada di LK21.
              Kami akan berusaha menambahkan film yang kamu minta.
            </p>

            <form className="request-form">
              <div className="form-group">
                <label htmlFor="movieTitle">Judul Film/Series</label>
                <input 
                  type="text" 
                  id="movieTitle" 
                  placeholder="Masukkan judul film yang ingin direquest"
                />
              </div>

              <div className="form-group">
                <label htmlFor="movieYear">Tahun Rilis</label>
                <input 
                  type="text" 
                  id="movieYear" 
                  placeholder="Contoh: 2024"
                />
              </div>

              <div className="form-group">
                <label htmlFor="imdbLink">Link IMDB (opsional)</label>
                <input 
                  type="text" 
                  id="imdbLink" 
                  placeholder="https://www.imdb.com/title/..."
                />
              </div>

              <div className="form-group">
                <label htmlFor="notes">Catatan Tambahan</label>
                <textarea 
                  id="notes" 
                  rows={4}
                  placeholder="Informasi tambahan tentang film yang direquest"
                />
              </div>

              <button type="submit" className="submit-btn">
                Kirim Request
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

