"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Ad, getRandomAd, fallbackAd } from "@/app/data/ads";

function RedirectContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const targetUrl = searchParams.get("url") || "/";
  const movieTitle = searchParams.get("title") || "Film";

  const [currentAd, setCurrentAd] = useState<Ad>(fallbackAd);
  const [adError, setAdError] = useState(false);
  const [canSkip, setCanSkip] = useState(false);
  const [adWatched, setAdWatched] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [remainingTime, setRemainingTime] = useState(5);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playbackIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Randomly pick an ad
    setCurrentAd(getRandomAd());
  }, []);

  // Track video playback time or image viewing time
  useEffect(() => {
    // For image ads, start countdown immediately when component mounts
    if (currentAd.type === "image" && !adError) {
      const imageTimer = setInterval(() => {
        setPlaybackTime((prev) => {
          const newTime = prev + 1;
          const remaining = Math.max(0, 5 - newTime);
          setRemainingTime(remaining);

          if (newTime >= 5) {
            setCanSkip(true);
            clearInterval(imageTimer);
          }
          return newTime;
        });
      }, 1000);

      return () => clearInterval(imageTimer);
    }

    // For video ads, track playback time only when playing with sound
    if (isPlaying && videoRef.current && currentAd.type === "video") {
      // Start tracking playback time
      playbackIntervalRef.current = setInterval(() => {
        if (videoRef.current) {
          // Only count time if video is playing, not paused, not ended, and not muted
          if (
            !videoRef.current.paused &&
            !videoRef.current.ended &&
            !videoRef.current.muted
          ) {
            const currentTime = videoRef.current.currentTime;
            const watchedTime = Math.floor(currentTime);

            setPlaybackTime(watchedTime);
            const remaining = Math.max(0, 5 - watchedTime);
            setRemainingTime(remaining);

            if (watchedTime >= 5) {
              setCanSkip(true);
              if (playbackIntervalRef.current) {
                clearInterval(playbackIntervalRef.current);
              }
            }
          }
        }
      }, 100); // Check every 100ms for smoother updates
    } else {
      // Clear interval when not playing
      if (playbackIntervalRef.current) {
        clearInterval(playbackIntervalRef.current);
        playbackIntervalRef.current = null;
      }
    }

    return () => {
      if (playbackIntervalRef.current) {
        clearInterval(playbackIntervalRef.current);
      }
    };
  }, [isPlaying, currentAd.type, adError]);

  // Handle video play event
  const handleVideoPlay = () => {
    if (videoRef.current) {
      // Ensure video is unmuted when user plays
      videoRef.current.muted = false;
      setIsPlaying(true);
    }
  };

  // Handle video pause event
  const handleVideoPause = () => {
    setIsPlaying(false);
  };

  // Handle video ended event
  const handleVideoEnded = () => {
    setIsPlaying(false);
    // If video ends before 5 seconds, still allow skip if they watched enough
    if (
      playbackTime >= 5 ||
      (videoRef.current && videoRef.current.duration >= 5)
    ) {
      setCanSkip(true);
    }
  };

  // Handle volume/mute changes
  const handleVolumeChange = () => {
    if (videoRef.current && videoRef.current.muted) {
      // If muted, pause the timer (don't count time while muted)
      // The interval will automatically stop counting because of the muted check
    }
  };

  const handleAdError = () => {
    setAdError(true);
    setCurrentAd(fallbackAd);
  };

  const handleSkip = () => {
    if (canSkip) {
      setAdWatched(true);
      router.push(targetUrl);
    }
  };

  const handleAdClick = (e: React.MouseEvent) => {
    // Allow clicking on ad to visit sponsor (but not on skip button area or video controls)
    const target = e.target as HTMLElement;

    // Don't handle click if it's on:
    // - Skip overlay
    // - Video element or its controls
    // - Play overlay prompt
    if (
      target.closest(".ad-skip-overlay") ||
      target.tagName === "VIDEO" ||
      target.closest("video") ||
      (target.closest(".ad-play-overlay") && !target.closest(".ad-play-prompt"))
    ) {
      return; // Let the video/controls handle the click
    }

    // For image ads or clicking outside video controls, open sponsor link
    if (currentAd.type === "image" || !target.closest("video")) {
      e.stopPropagation();
      window.open(currentAd.link, "_blank", "noopener,noreferrer");
    }
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
          ref={videoRef}
          src={currentAd.media}
          className="ad-video"
          playsInline
          controls
          onError={handleAdError}
          onPlay={handleVideoPlay}
          onPause={handleVideoPause}
          onEnded={handleVideoEnded}
          onVolumeChange={handleVolumeChange}
          onTimeUpdate={() => {
            // Update playback time in real-time - only count if playing and not muted
            if (
              videoRef.current &&
              isPlaying &&
              !videoRef.current.muted &&
              !videoRef.current.paused
            ) {
              const currentTime = Math.floor(videoRef.current.currentTime);
              if (currentTime !== playbackTime) {
                setPlaybackTime(currentTime);
                const remaining = Math.max(0, 5 - currentTime);
                setRemainingTime(remaining);

                if (currentTime >= 5) {
                  setCanSkip(true);
                }
              }
            }
          }}
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

        <div className="youtube-ad-container">
          <div className="ad-wrapper">
            <div className="ad-content" onClick={handleAdClick}>
              {renderAd()}
            </div>

            {/* Skip button overlay - YouTube style */}
            <div
              className="ad-skip-overlay"
              onClick={(e) => e.stopPropagation()}
            >
              {canSkip ? (
                <button
                  onClick={handleSkip}
                  className="ad-skip-button"
                  aria-label="Skip ad"
                >
                  Skip Ad
                  <span className="skip-arrow">›</span>
                </button>
              ) : (
                <div className="ad-skip-countdown">
                  {currentAd.type === "image" || isPlaying ? (
                    <span className="skip-timer">{remainingTime}</span>
                  ) : (
                    <span className="skip-timer">—</span>
                  )}
                </div>
              )}
            </div>

            {/* Play overlay for video ads - shown when not playing */}
            {currentAd.type === "video" && !isPlaying && !adError && (
              <div className="ad-play-overlay">
                <div
                  className="ad-play-prompt"
                  onClick={(e) => {
                    // Clicking the prompt area will play the video
                    e.stopPropagation();
                    if (videoRef.current) {
                      videoRef.current.play().catch((err) => {
                        console.error("Error playing video:", err);
                      });
                    }
                  }}
                >
                  <p>Putar iklan untuk melanjutkan</p>
                  <p className="ad-play-hint">
                    Tonton selama 5 detik dengan suara untuk melewati
                  </p>
                </div>
              </div>
            )}

            {/* Viewing prompt for image ads */}
            {currentAd.type === "image" && !canSkip && !adError && (
              <div className="ad-play-overlay">
                <div className="ad-play-prompt">
                  <p>Lihat iklan untuk melanjutkan</p>
                  <p className="ad-play-hint">
                    Tunggu {remainingTime} detik untuk melewati
                  </p>
                </div>
              </div>
            )}

            {/* Ad label */}
            <div className="ad-label-overlay">
              <span className="ad-badge">Ad</span>
            </div>
          </div>
        </div>

        <div className="redirect-actions">
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
