// app/sitemap.ts
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://arinvoice.studio",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://arinvoice.studio/invoice",
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://arinvoice.studio/login",
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];
}