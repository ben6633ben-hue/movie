"use client";

import { useEffect, useState } from "react";
import { Ad, getRandomAd, fallbackAd } from "@/app/data/ads";

interface Props {
  text?: string;
  useImage?: boolean;
}

export default function AdBanner({
  text = "Download Lk21 Android",
  useImage = false,
}: Props) {
  const [currentAd, setCurrentAd] = useState<Ad>(fallbackAd);
  const [adError, setAdError] = useState(false);

  useEffect(() => {
    setCurrentAd(getRandomAd());
  }, []);

  if (useImage) {
    return (
      <div className="ad-banner-container">
        <a
          href={currentAd.link}
          target="_blank"
          rel="noopener noreferrer"
          className="ad-banner-link"
        >
          {adError ? (
            <div className="ad-banner">
              <span className="ad-banner-text">{text}</span>
            </div>
          ) : (
            <img
              src={currentAd.media}
              alt={currentAd.alt}
              className="ad-banner-image"
              onError={() => setAdError(true)}
            />
          )}
        </a>
      </div>
    );
  }

  return (
    <div className="ad-banner-container">
      <a
        href={currentAd.link}
        target="_blank"
        rel="noopener noreferrer"
        className="ad-banner"
      >
        <span className="ad-banner-text">{text}</span>
      </a>
    </div>
  );
}
