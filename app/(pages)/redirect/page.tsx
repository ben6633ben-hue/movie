"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import Link from "next/link";
// Uncomment for ad flow (show video/image ad before redirect):
// import { useRouter } from "next/navigation";
// import { useState, useRef } from "react";
// import { Ad, getRandomAd, fallbackAd } from "@/app/data/ads";

function RedirectContent() {
  const searchParams = useSearchParams();
  const targetUrl = searchParams.get("url") || "/";
  const movieTitle = searchParams.get("title") || "Film";

  // Skip ad for now: redirect directly to the target page
  useEffect(() => {
    if (!targetUrl || targetUrl === "/") return;
    try {
      const decoded = decodeURIComponent(targetUrl);
      window.location.href = decoded;
    } catch {
      window.location.href = targetUrl;
    }
  }, [targetUrl]);

  return (
    <div className="redirect-page">
      <div className="redirect-container">
        <div className="redirect-header">
          <h1>Mengalihkan ke</h1>
          <p className="movie-title">{movieTitle}</p>
          <p className="redirect-hint">Jika tidak otomatis berpindah, klik tautan di bawah.</p>
        </div>
        <div className="redirect-actions">
          <a href={targetUrl ? decodeURIComponent(targetUrl) : "/"} className="btn-back" target="_blank" rel="noopener noreferrer">
            Buka halaman
          </a>
          <Link href="/" className="btn-back" style={{ marginTop: "0.5rem" }}>
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}

/*
  AD FLOW: Replace RedirectContent with the block below and uncomment imports at top.

  function RedirectContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const targetUrl = searchParams.get("url") || "/";
    const movieTitle = searchParams.get("title") || "Film";

    const [currentAd, setCurrentAd] = useState<Ad>(fallbackAd);
    const [adError, setAdError] = useState(false);
    const [canSkip, setCanSkip] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playbackTime, setPlaybackTime] = useState(0);
    const [remainingTime, setRemainingTime] = useState(5);
    const videoRef = useRef<HTMLVideoElement>(null);
    const playbackIntervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => { setCurrentAd(getRandomAd()); }, []);

    useEffect(() => {
      if (currentAd.type === "image" && !adError) {
        const imageTimer = setInterval(() => {
          setPlaybackTime((prev) => {
            const newTime = prev + 1;
            setRemainingTime(Math.max(0, 5 - newTime));
            if (newTime >= 5) setCanSkip(true);
            return newTime;
          });
        }, 1000);
        return () => clearInterval(imageTimer);
      }
      if (isPlaying && videoRef.current && currentAd.type === "video") {
        playbackIntervalRef.current = setInterval(() => {
          if (videoRef.current && !videoRef.current.paused && !videoRef.current.ended && !videoRef.current.muted) {
            const watchedTime = Math.floor(videoRef.current.currentTime);
            setPlaybackTime(watchedTime);
            setRemainingTime(Math.max(0, 5 - watchedTime));
            if (watchedTime >= 5) setCanSkip(true);
          }
        }, 100);
      }
      return () => { if (playbackIntervalRef.current) clearInterval(playbackIntervalRef.current); };
    }, [isPlaying, currentAd.type, adError]);

    const handleVideoPlay = () => { if (videoRef.current) { videoRef.current.muted = false; setIsPlaying(true); } };
    const handleVideoPause = () => setIsPlaying(false);
    const handleVideoEnded = () => { setIsPlaying(false); if (playbackTime >= 5) setCanSkip(true); };
    const handleAdError = () => { setAdError(true); setCurrentAd(fallbackAd); };
    const handleSkip = () => { if (canSkip) window.location.href = targetUrl; };
    const handleAdClick = (e: React.MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest(".ad-skip-overlay") || target.tagName === "VIDEO" || target.closest("video")) return;
      if (currentAd.type === "image" || !target.closest("video")) {
        e.stopPropagation();
        window.open(currentAd.link, "_blank", "noopener,noreferrer");
      }
    };

    const renderAd = () => {
      if (adError) return <div className="ad-placeholder"><span>Advertisement</span></div>;
      if (currentAd.type === "video") return (
        <video ref={videoRef} src={currentAd.media} className="ad-video" playsInline controls
          onError={handleAdError} onPlay={handleVideoPlay} onPause={handleVideoPause} onEnded={handleVideoEnded} />
      );
      return <img src={currentAd.media} alt={currentAd.alt} className="ad-image" onError={handleAdError} />;
    };

    return (
      <div className="redirect-page">
        <div className="redirect-container">
          <div className="redirect-header">
            <h1>Anda akan dialihkan ke</h1>
            <p className="movie-title">{movieTitle}</p>
          </div>
          <div className="youtube-ad-container">
            <div className="ad-wrapper">
              <div className="ad-content" onClick={handleAdClick}>{renderAd()}</div>
              <div className="ad-skip-overlay">
                {canSkip ? (
                  <button onClick={handleSkip} className="ad-skip-button">Skip Ad <span className="skip-arrow">›</span></button>
                ) : (
                  <div className="ad-skip-countdown"><span className="skip-timer">{currentAd.type === "image" || isPlaying ? remainingTime : "—"}</span></div>
                )}
              </div>
              {currentAd.type === "video" && !isPlaying && !adError && (
                <div className="ad-play-overlay">
                  <div className="ad-play-prompt" onClick={() => videoRef.current?.play()}>
                    <p>Putar iklan untuk melanjutkan</p>
                    <p className="ad-play-hint">Tonton selama 5 detik dengan suara untuk melewati</p>
                  </div>
                </div>
              )}
              {currentAd.type === "image" && !canSkip && !adError && (
                <div className="ad-play-overlay">
                  <div className="ad-play-prompt">
                    <p>Lihat iklan untuk melanjutkan</p>
                    <p className="ad-play-hint">Tunggu {remainingTime} detik untuk melewati</p>
                  </div>
                </div>
              )}
              <div className="ad-label-overlay"><span className="ad-badge">Ad</span></div>
            </div>
          </div>
          <div className="redirect-actions">
            <Link href="/" className="btn-back">Kembali ke Beranda</Link>
          </div>
        </div>
      </div>
    );
  }
*/

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
