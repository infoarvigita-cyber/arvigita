import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#061d30",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://arvigita.lt"),
  title: {
    default: "MB „Arvigita“ | Elektroninio statybos darbų žurnalo pildymas",
    template: "%s | MB „Arvigita“",
  },
  description:
    "Elektroninio statybos darbų žurnalo (EDŽ) pildymas ir administravimas.",
  robots: {
    index: true,
    follow: true,
  },
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