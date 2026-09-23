import React from 'react';
import { Star } from 'lucide-react';
import { aggregateRating, customerReviews } from '@/data/customerReviews';

const TestimonialsSection = () => {
  return (
    <section className="py-24 md:py-32" aria-labelledby="customer-reviews-heading">
      <div className="container-wewash">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div className="max-w-xl">
            <p className="text-secondary text-xs uppercase tracking-[0.25em] font-medium mb-4">Google reviews</p>
            <h2 id="customer-reviews-heading" className="text-foreground font-light">
              What customers <span className="font-bold">say about WeWash</span>
            </h2>
          </div>
          <div className="flex items-center gap-3" aria-label={`${aggregateRating.ratingValue} out of 5 from ${aggregateRating.reviewCount} Google reviews`}>
            <span className="font-display text-3xl font-semibold text-foreground">{aggregateRating.ratingValue}</span>
            <div>
              <div className="flex gap-1" aria-hidden="true">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-secondary fill-secondary" />
                ))}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{aggregateRating.reviewCount} Google reviews</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border/30">
          {customerReviews.map((review) => (
            <article key={review.name} className="bg-background p-8 md:p-10">
              <div className="flex gap-1 mb-6" aria-label={`${review.rating} out of 5 stars`}>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${i < review.rating ? 'text-secondary fill-secondary' : 'text-muted-foreground/30'}`}
                    aria-hidden="true"
                  />
                ))}
              </div>

              <p className="text-foreground font-light leading-relaxed mb-8">
                “{review.text}”
              </p>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-card flex items-center justify-center text-xs font-medium text-foreground/60 border border-border/30">
                  {review.initials}
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">{review.name}</div>
                  <div className="text-xs text-muted-foreground">
                    Google review{review.truncated ? ' · visible excerpt' : ''}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
