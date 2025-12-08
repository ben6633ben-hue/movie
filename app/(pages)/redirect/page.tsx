"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { Ad, getRandomAd, fallbackAd } from "@/app/data/ads";

function RedirectContent() {
  const searchParams = useSearchParams();
  const targetUrl = searchParams.get("url") || "/";
  const movieTitle = searchParams.get("title") || "Film";

  const [countdown, setCountdown] = useState(5);
  const [currentAd, setCurrentAd] = useState<Ad>(fallbackAd);
  const [adError, setAdError] = useState(false);

  useEffect(() => {
    // Randomly pick an ad
    setCurrentAd(getRandomAd());
  }, []);

  useEffect(() => {
    // Stop countdown at 0, don't auto-redirect
    if (countdown <= 0) {
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  const handleAdError = () => {
    setAdError(true);
    setCurrentAd(fallbackAd);
  };

  const renderAd = () => {
    if (adError) {
      return (
        <div className="ad-placeholder">
          <span>Advertisement</span>
          <p>Klik untuk mengunjungi sponsor kami</p>
        </div>
      );
    }

    if (currentAd.type === "video") {
      return (
        <video
          src={currentAd.media}
          className="ad-video"
          autoPlay
          controls
          loop
          playsInline
          onError={handleAdError}
        />
      );
    }

    return (
      <img
        src={currentAd.media}
        alt={currentAd.alt}
        className="ad-image"
        onError={handleAdError}
      />
    );
  };

  return (
    <div className="redirect-page">
      <div className="redirect-container">
        <div className="redirect-header">
          <h1>Anda akan dialihkan ke</h1>
          <p className="movie-title">{movieTitle}</p>
        </div>

        <div className="ad-container">
          <p className="ad-label">IKLAN - Klik untuk mengunjungi sponsor</p>
          <a
            href={currentAd.link}
            target="_blank"
            rel="noopener noreferrer"
            className="ad-link"
          >
            {renderAd()}
          </a>
        </div>

        <div className="countdown-section">
          {countdown > 0 ? (
            <>
              <div className="countdown-circle">
                <span>{countdown}</span>
              </div>
              <p>Tunggu {countdown} detik untuk lanjut ke film...</p>
            </>
          ) : (
            <p>Klik tombol di bawah untuk melanjutkan</p>
          )}
        </div>

        <div className="redirect-actions">
          {countdown <= 0 ? (
            <a href={targetUrl} className="btn-continue">
              Lanjutkan ke Film
            </a>
          ) : (
            <button className="btn-continue disabled" disabled>
              Tunggu {countdown} detik
            </button>
          )}
          <Link href="/" className="btn-back">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function RedirectPage() {
  return (
    <Suspense
      fallback={
        <div className="redirect-page">
          <div className="redirect-container">
            <p>Loading...</p>
          </div>
        </div>
      }
    >
      <RedirectContent />
    </Suspense>
  );
}
