import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/administravimas/",
        "/savitarnos/",
        "/api/",
      ],
    },

    sitemap: "https://arvigita.lt/sitemap.xml",
    host: "https://arvigita.lt",
  };
}