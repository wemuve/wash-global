import raw from "../content/advice-articles.md?raw"

export interface AdviceArticle {
  slug: string
  title: string
  description: string
  body: string
  servicePath: string
}

const meta: { slug: string; servicePath: string }[] = [
  { slug: "cleaning-habits-lusaka", servicePath: "/services" },
  { slug: "how-to-hire-a-maid-lusaka", servicePath: "/services" },
  { slug: "prepare-for-deep-clean", servicePath: "/book-now" },
  { slug: "rainy-season-home-care", servicePath: "/services" },
  { slug: "moving-house-cleaning-checklist", servicePath: "/book-now" },
  { slug: "choosing-a-cleaning-service-lusaka", servicePath: "/services" },
]

const sections = raw
  .split(/^## /m)
  .slice(1)
  .filter((s) => /^\d+\./.test(s))

export const adviceArticles: AdviceArticle[] = sections.map((section, i) => {
  const [heading, ...rest] = section.split("\n")
  const body = rest.join("\n").replace(/\n---\s*$/m, "").trim()
  const firstPara = body.split(/\n\s*\n/)[0].replace(/[*_]/g, "")
  return {
    slug: meta[i].slug,
    servicePath: meta[i].servicePath,
    title: heading.replace(/^\d+\.\s*/, "").trim(),
    description: firstPara.length > 155 ? firstPara.slice(0, 152).trimEnd() + "…" : firstPara,
    body,
  }
})

export const getArticle = (slug?: string) => adviceArticles.find((a) => a.slug === slug)
