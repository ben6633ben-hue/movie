import "./globals.css";
import type { Metadata } from "next";
import Script from "next/script";

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
        <meta name="clckd" content="481d5a92d15c19c6050088ea6046ffde" />
        <meta
          name="google-site-verification"
          content="DRcx5WzqYx06VhCMcIX9bwR3LNYUGvIhzWZdAwe4EFU"
        />
      </head>
      <body>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-NQVPW4ME40"
        strategy="afterInteractive"
      />
      <Script id="ga-setup" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-NQVPW4ME40');
        `}
      </Script>

        {children}
      </body>
    </html>
  );
}
