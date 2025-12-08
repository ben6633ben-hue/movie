"use client";

import { useEffect, useState } from "react";
import { Ad, getRandomAd, fallbackAd } from "@/app/data/ads";

// Small inline ad for listing pages
export default function InlineAd() {
  const [currentAd, setCurrentAd] = useState<Ad>(fallbackAd);

  useEffect(() => {
    setCurrentAd(getRandomAd());
  }, []);

  return (
    <div className="inline-ad">
      <a
        href={currentAd.link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-ad-link"
      >
        <span className="inline-ad-label">Ad</span>
        <span className="inline-ad-text">Sponsored Content</span>
      </a>
    </div>
  );
}
