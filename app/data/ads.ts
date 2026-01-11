// ============================================
// AD CONFIGURATION
// ============================================
// Add your ads here. Each ad needs:
// - media: path to image/video in /public/ads/ folder
// - type: "image" or "video"
// - link: URL to open when ad is clicked
// - alt: description of the ad
// ============================================

export interface Ad {
  media: string;
  type: "image" | "video";
  link: string;
  alt: string;
}

// Add your ads here
// Example for image:
// {
//   media: "/ads/my-ad.jpg",
//   type: "image",
//   link: "https://sponsor.com",
//   alt: "Sponsor Name",
// },
// Example for video:
// {
//   media: "/ads/my-video.mp4",
//   type: "video",
//   link: "https://sponsor.com",
//   alt: "Sponsor Name",
// },
export const ads: Ad[] = [
  // Add your ads here...
];

// Fallback ad if no ads configured
// export const fallbackAd: Ad = {
//   media:
//     "https://www.shutterstock.com/image-photo/beautiful-wonderful-cute-kitten-wallpaper-600nw-2435308283.jpg",
//   type: "image",
//   link: "https://preview.redd.it/post-the-best-cat-memes-you-got-in-the-comments-please-v0-kg82lbnu0ste1.png?auto=webp&s=e6f9eee86484f5de3f4e31f3c33b2d07fb982bd5",
//   alt: "Advertise with us",
// };

export const fallbackAd: Ad = {
  media: "/ads/The FUNNIEST Cat Videos of 2024!.mp4",
  type: "video",
  link: "https://preview.redd.it/post-the-best-cat-memes-you-got-in-the-comments-please-v0-kg82lbnu0ste1.png?auto=webp&s=e6f9eee86484f5de3f4e31f3c33b2d07fb982bd5",
  alt: "Advertise with us",
};

// Get a random ad
export function getRandomAd(): Ad {
  if (ads.length === 0) return fallbackAd;
  return ads[Math.floor(Math.random() * ads.length)];
}
