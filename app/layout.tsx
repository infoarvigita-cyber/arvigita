import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://arvigita.lt"),

  title: {
    default: "MB „Arvigita“ | Elektroninio statybos darbų žurnalo pildymas",
    template: "%s | MB „Arvigita“",
  },

  description:
    "Elektroninio statybos darbų žurnalo (EDŽ) pildymas ir administravimas. Verslo administravimo, konsultavimo, statybos ir remonto paslaugos.",

  keywords: [
    "elektroninis statybos darbų žurnalas",
    "EDŽ",
    "EDŽ pildymas",
    "statybos darbų žurnalo pildymas",
    "elektroninio statybos darbų žurnalo pildymas",
    "statybos dokumentacija",
    "statybos dokumentų administravimas",
    "statybos administravimas",
    "MB Arvigita",
    "Arvigita",
  ],

  authors: [
    {
      name: "MB „Arvigita“",
    },
  ],

  creator: "MB „Arvigita“",
  publisher: "MB „Arvigita“",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: "lt_LT",
    url: "https://arvigita.lt",
    siteName: "MB „Arvigita“",

    title:
      "MB „Arvigita“ | Elektroninio statybos darbų žurnalo pildymas",

    description:
      "Profesionalus elektroninio statybos darbų žurnalo (EDŽ) pildymas ir administravimas.",

    images: [
      {
        url: "/arvigita-logo.png",
        width: 1200,
        height: 630,
        alt: "MB „Arvigita“",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title:
      "MB „Arvigita“ | Elektroninio statybos darbų žurnalo pildymas",

    description:
      "Profesionalus elektroninio statybos darbų žurnalo (EDŽ) pildymas ir administravimas.",

    images: ["/arvigita-logo.png"],
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  icons: {
    icon: "/arvigita-logo.png",
    shortcut: "/arvigita-logo.png",
    apple: "/arvigita-logo.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#061d30",
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