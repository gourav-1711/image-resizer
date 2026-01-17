import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `https://${process.env.VERCEL_URL || "yoursite.com"}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `https://${process.env.VERCEL_URL || "yoursite.com"}/api/optimize`,
      lastModified: new Date(),
      changeFrequency: "never",
      priority: 0.5,
    },
  ]
}
