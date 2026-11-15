import type { MetadataRoute } from "next";
import { brand, capabilities } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "/",
    "/about",
    "/what-we-do",
    "/focus",
    "/our-approach",
    "/contact",
    "/credits",
    ...capabilities.map((service) => `/what-we-do/${service.slug}`),
  ].map((path) => ({ url: `${brand.canonical}${path}` }));
}
