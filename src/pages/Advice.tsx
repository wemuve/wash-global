import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { adviceArticles } from '@/data/adviceArticles';

const Advice = () => (
  <Layout>
    <Helmet>
      <title>Home Cleaning & Maid Advice for Lusaka Families | WeWash</title>
      <meta name="description" content="Practical advice for Lusaka families: cleaning habits, hiring a maid, preparing for a deep clean, rainy-season care and moving house." />
      <link rel="canonical" href="https://wewashglobal.com/advice" />
      <meta property="og:url" content="https://wewashglobal.com/advice" />
    </Helmet>
    <section className="container-wewash py-16 md:py-24 max-w-4xl">
      <p className="text-xs uppercase tracking-[0.2em] text-secondary">Advice</p>
      <h1 className="mt-4 text-3xl md:text-4xl font-light text-foreground">Advice for Lusaka families</h1>
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {adviceArticles.map((a) => (
          <Link key={a.slug} to={`/advice/${a.slug}`} className="block border border-border/40 p-6 hover:border-secondary transition-colors">
            <h2 className="text-lg font-medium text-foreground">{a.title}</h2>
            <p className="mt-3 text-sm text-muted-foreground font-light">{a.description}</p>
          </Link>
        ))}
      </div>
    </section>
  </Layout>
);

export default Advice;
