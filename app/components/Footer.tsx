import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Tentang LK21 */}
        <div className="footer-section">
          <h3 className="footer-title">TENTANG LK21</h3>
          <p className="footer-text">
            LK21 Layarkaca21 adalah situs nonton streaming film online gratis
            dengan koleksi film terbaru dan populer dari berbagai genre seperti
            Action, Comedy, Drama, and Horror. Nikmati film sub indo dari Barat,
            Korea, Jepang kualitas HD.
          </p>
        </div>

        {/* Jelajahi */}
        <div className="footer-section">
          <h3 className="footer-title">JELAJAHI</h3>
          <ul className="footer-list">
            <li>
              <Link href="/">Beranda</Link>
            </li>
            <li>
              <Link href="/movies">Semua Film</Link>
            </li>
            <li>
              <Link href="/popular/new">Movie Terbaru</Link>
            </li>
            {/* <li>
              <Link href="/series">Series Terupdate</Link>
            </li> */}
            <li>
              <Link href="/popular">Movie Populer</Link>
            </li>
            <li>
              <Link href="/year/2025">Movie 2025</Link>
            </li>
          </ul>
        </div>

        {/* Genre Populer */}
        <div className="footer-section">
          <h3 className="footer-title">GENRE POPULER</h3>
          <ul className="footer-list">
            <li>
              <Link href="/genre/action">Action</Link>
            </li>
            <li>
              <Link href="/genre/comedy">Comedy</Link>
            </li>
            <li>
              <Link href="/genre/drama">Drama</Link>
            </li>
            <li>
              <Link href="/genre/horror">Horror</Link>
            </li>
            <li>
              <Link href="/genre/romance">Romance</Link>
            </li>
            <li>
              <Link href="/genre/crime">Crime</Link>
            </li>
          </ul>
        </div>

        {/* Disclaimer */}
        <div className="footer-section">
          <h3 className="footer-title">DISCLAIMER</h3>
          <p className="footer-text">
            LK21 only provides movie link information available on the internet.
            We do not store video files on our own server. All content belongs
            to the original providers.
          </p>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-bottom">
        <p>
          © 2025 <Link href="/">Layarkaca21</Link>. All Right Reserved
        </p>
      </div>
    </footer>
  );
}
