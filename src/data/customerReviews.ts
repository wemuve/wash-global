export type CustomerReview = {
  name: string;
  rating: number;
  text: string;
  initials: string;
  truncated?: boolean;
};

export const customerReviews: CustomerReview[] = [
  {
    name: 'Wamulume Mubita',
    rating: 5,
    text: 'It was really a thorough equipment analysis and cleaning….',
    initials: 'WM',
    truncated: true,
  },
  {
    name: 'Sompwe L. Chanda',
    rating: 5,
    text: 'Great team to work with, consistently a good standard of work…',
    initials: 'SC',
    truncated: true,
  },
  {
    name: 'Clive Simachela',
    rating: 4,
    text: 'Good cleaning services impressed with the work',
    initials: 'CS',
  },
];

export const aggregateRating = {
  ratingValue: 4.7,
  reviewCount: 3,
};

export const reviewSchema = customerReviews.map((review) => ({
  '@type': 'Review',
  author: {
    '@type': 'Person',
    name: review.name,
  },
  reviewRating: {
    '@type': 'Rating',
    ratingValue: review.rating,
    bestRating: 5,
  },
  reviewBody: review.text,
}));