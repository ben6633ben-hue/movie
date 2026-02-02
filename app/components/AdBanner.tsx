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
      </div>
    );
  }

  return (
    <div className="ad-banner-container">
      <div className="ad-banner">
        <span className="ad-banner-text">{text}</span>
      </div>
    </div>
  );
}
