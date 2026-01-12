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
        <meta name="clckd" content="038424b98cf1117cee61838689ba3caf" />
      </head>
      <body>{children}</body>
    </html>
  );
}
