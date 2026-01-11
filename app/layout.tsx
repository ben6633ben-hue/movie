import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LK21",
  description:
    "LK21 - Situs nonton film dan series online gratis dengan kualitas HD. Update terbaru setiap hari.",
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
      </head>
      <body>{children}</body>
    </html>
  );
}
