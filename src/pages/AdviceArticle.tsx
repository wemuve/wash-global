import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { adviceArticles, getArticle } from '@/data/adviceArticles';
import NotFound from './NotFound';

const BASE = 'https://wewashglobal.com';

const inline = (text: string): React.ReactNode[] =>
  text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean).map((part, i) => {
    if (part.startsWith('**')) return <strong key={i} className="font-medium text-foreground">{part.slice(2, -2)}</strong>;
    if (part.startsWith('*')) return <em key={i}>{part.slice(1, -1)}</em>;
    return part;
  });

const renderBody = (body: string) =>
  body.split(/\n\s*\n/).map((block, i) => {
    const lines = block.split('\n').filter(Boolean);
    if (lines.every((l) => /^\d+\.\s/.test(l)))
      return <ol key={i} className="list-decimal pl-6 space-y-3">{lines.map((l, j) => <li key={j}>{inline(l.replace(/^\d+\.\s/, ''))}</li>)}</ol>;
    if (lines.every((l) => /^[-*]\s/.test(l)))
      return <ul key={i} className="list-disc pl-6 space-y-3">{lines.map((l, j) => <li key={j}>{inline(l.replace(/^[-*]\s/, ''))}</li>)}</ul>;
    if (/^#{3,}\s/.test(block)) return <h2 key={i} className="text-xl font-medium text-foreground pt-4">{block.replace(/^#+\s/, '')}</h2>;
    return <p key={i}>{inline(lines.join(' '))}</p>;
  });

const AdviceArticle = () => {
  const { slug } = useParams();
  const article = getArticle(slug);
  if (!article) return <NotFound />;
  const url = `${BASE}/advice/${article.slug}`;
  const others = adviceArticles.filter((a) => a.slug !== article.slug).slice(0, 3);

  return (
    <Layout>
      <Helmet>
        <title>{`${article.title} | WeWash Lusaka`}</title>
        <meta name="description" content={article.description} />
        <link rel="canonical" href={url} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.description} />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: article.title,
          description: article.description,
          mainEntityOfPage: url,
          inLanguage: 'en-ZM',
          author: { '@type': 'Organization', name: 'WeWash Zambia', url: `${BASE}/` },
          publisher: { '@id': `${BASE}/#organization`, '@type': 'Organization', name: 'WeWash Zambia' },
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE}/` },
            { '@type': 'ListItem', position: 2, name: 'Advice', item: `${BASE}/advice` },
            { '@type': 'ListItem', position: 3, name: article.title, item: url },
          ],
        })}</script>
      </Helmet>
      <article className="container-wewash py-16 md:py-24 max-w-3xl">
        <Link to="/advice" className="text-xs uppercase tracking-[0.2em] text-secondary">Advice for Lusaka families</Link>
        <h1 className="mt-4 text-3xl md:text-4xl font-light text-foreground leading-tight">{article.title}</h1>
        <div className="mt-10 space-y-5 text-muted-foreground font-light leading-relaxed">{renderBody(article.body)}</div>
        <div className="mt-12 flex flex-wrap gap-4">
          <Link to="/book-now" className="px-6 py-3 bg-secondary text-secondary-foreground text-sm font-medium">Book a visit</Link>
          <Link to={article.servicePath} className="px-6 py-3 border border-border text-sm text-foreground">See our services</Link>
        </div>
        <aside className="mt-16 border-t border-border/30 pt-10">
          <h2 className="text-xs uppercase tracking-[0.2em] text-foreground/50 mb-6">More advice</h2>
          <ul className="space-y-3">
            {others.map((a) => <li key={a.slug}><Link to={`/advice/${a.slug}`} className="text-foreground hover:text-secondary">{a.title}</Link></li>)}
          </ul>
        </aside>
      </article>
    </Layout>
  );
};

export default AdviceArticle;
