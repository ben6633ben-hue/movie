import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LK21 (Layarkaca21) Nonton Film Sub Indo Terbaru dan Terpopuler Free Streaming",
  description:
    "LK21 adalah situs resmi Layarkaca21. Nonton film dan series online gratis dengan kualitas HD sub indo tanpa iklan desktop dan mobile.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="clckd" content="038424b98cf1117cee61838689ba3caf" />
        <meta name="google-site-verification" content="DRcx5WzqYx06VhCMcIX9bwR3LNYUGvIhzWZdAwe4EFU" />
      </head>
      <body>{children}</body>
    </html>
  );
}
