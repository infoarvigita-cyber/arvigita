import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://arvigita.lt"),
  title: "MB „Arvigita“ | Elektroninio statybos darbų žurnalo pildymas",
  description: "Elektroninio statybos darbų žurnalo (EDŽ) pildymas ir administravimas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="lt">
      <body>{children}</body>
    </html>
  );
}