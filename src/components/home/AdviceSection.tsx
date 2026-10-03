import React from 'react';
import { Link } from 'react-router-dom';
import { adviceArticles } from '@/data/adviceArticles';

const AdviceSection = () => (
  <section className="container-wewash py-16 md:py-20">
    <div className="flex items-end justify-between gap-4 mb-10">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-secondary">Advice</p>
        <h2 className="mt-3 text-2xl md:text-3xl font-light text-foreground">Help for Lusaka families</h2>
      </div>
      <Link to="/advice" className="text-sm text-muted-foreground hover:text-foreground">All advice</Link>
    </div>
    <div className="grid gap-6 md:grid-cols-3">
      {adviceArticles.map((a) => (
        <Link key={a.slug} to={`/advice/${a.slug}`} className="block border border-border/40 p-6 hover:border-secondary transition-colors">
          <h3 className="text-base font-medium text-foreground">{a.title}</h3>
        </Link>
      ))}
    </div>
  </section>
);

export default AdviceSection;
