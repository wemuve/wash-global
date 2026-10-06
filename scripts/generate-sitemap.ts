// Runs before `vite dev` and `vite build` (predev/prebuild hooks); writes public/sitemap.xml.

import { writeFileSync } from "fs"
import { resolve } from "path"
import { imageLibrary } from "../src/data/imageLibrary"

const BASE_URL = "https://wewashglobal.com"

interface SitemapEntry {
  path: string
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never"
  priority?: string
}

const entries: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/services", changefreq: "weekly", priority: "0.9" },
  { path: "/services/car-detailing", changefreq: "weekly", priority: "0.8" },
  { path: "/pools", changefreq: "monthly", priority: "0.8" },
  { path: "/pricing", changefreq: "weekly", priority: "0.8" },
  { path: "/quote", changefreq: "monthly", priority: "0.8" },
  { path: "/book-now", changefreq: "monthly", priority: "0.8" },
  { path: "/about", changefreq: "monthly", priority: "0.6" },
  { path: "/elderly-home-support-lusaka", changefreq: "monthly", priority: "0.5" },
  { path: "/contact", changefreq: "monthly", priority: "0.6" },
  { path: "/advice", changefreq: "monthly", priority: "0.6" },
  ...[
    "cleaning-habits-lusaka",
    "how-to-hire-a-maid-lusaka",
    "prepare-for-deep-clean",
    "rainy-season-home-care",
    "moving-house-cleaning-checklist",
    "choosing-a-cleaning-service-lusaka",
  ].map((s) => ({ path: `/advice/${s}`, changefreq: "monthly" as const, priority: "0.6" })),
]

function generateSitemap(entries: SitemapEntry[]) {
  const urls = entries.map((e) =>
    [
      `  <url>`,
      `    <loc>${BASE_URL}${e.path}</loc>`,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      ...imageLibrary
        .filter((img) => img.url && img.pageUrl === e.path)
        .map((img) => `    <image:image><image:loc>${BASE_URL}${img.url}</image:loc></image:image>`),
      `  </url>`,
    ]
      .filter(Boolean)
      .join("\n"),
  )

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`,
    ...urls,
    `</urlset>`,
  ].join("\n")
}

writeFileSync(resolve("public/sitemap.xml"), generateSitemap(entries))
console.log(`sitemap.xml written (${entries.length} entries)`)
