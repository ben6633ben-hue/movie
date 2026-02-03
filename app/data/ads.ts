/** Ad config: media (path in /public/ads/), type (image|video), link, alt. */
export interface Ad {
  media: string;
  type: "image" | "video";
  link: string;
  alt: string;
}

export const ads: Ad[] = [];

export const fallbackAd: Ad = {
  media: "/ads/The FUNNIEST Cat Videos of 2024!.mp4",
  type: "video",
  link: "https://preview.redd.it/post-the-best-cat-memes-you-got-in-the-comments-please-v0-kg82lbnu0ste1.png?auto=webp&s=e6f9eee86484f5de3f4e31f3c33b2d07fb982bd5",
  alt: "Advertise with us",
};

export function getRandomAd(): Ad {
  if (ads.length === 0) return fallbackAd;
  return ads[Math.floor(Math.random() * ads.length)];
}
