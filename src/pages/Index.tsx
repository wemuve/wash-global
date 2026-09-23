import React from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/home/HeroSection';
import ServicesSection from '@/components/home/ServicesSection';
import BeforeAfterSection from '@/components/home/BeforeAfterSection';
import WorkGallerySection from '@/components/home/WorkGallerySection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import ClientTypesSection from '@/components/home/ClientTypesSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import LocalInfoSection from '@/components/LocalInfoSection';
import CTASection from '@/components/home/CTASection';
import ReferralPromoSection from '@/components/home/ReferralPromoSection';
import { aggregateRating, reviewSchema } from '@/data/customerReviews';

const Index = () => {
  return (
    <Layout>
      <Helmet>
        <title>WeWash Zambia | Premium Cleaning, Car Detailing & Pool Services in Lusaka</title>
        <meta name="description" content="Zambia's premium cleaning company. Deep cleaning from K550, sofa & carpet cleaning, mobile car detailing from K450, pool servicing from K800, fumigation & trained maids. Serving Lusaka — book online or WhatsApp +260768671420." />
        <link rel="canonical" href="https://wewashglobal.com/" />
        <meta property="og:url" content="https://wewashglobal.com/" />
        <meta property="og:title" content="WeWash Zambia | Premium Cleaning & Property Services" />
        <meta property="og:description" content="Deep cleaning, car detailing, pool services, fumigation & trained maids across Lusaka. Real crew, real results. Book online — pay after the job." />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          '@id': 'https://wewashglobal.com/#organization',
          name: 'WeWash Zambia',
          url: 'https://wewashglobal.com/',
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: aggregateRating.ratingValue,
            reviewCount: aggregateRating.reviewCount,
            bestRating: 5,
          },
          review: reviewSchema,
        })}</script>
      </Helmet>
      <HeroSection />
      <ServicesSection />
      <BeforeAfterSection />
      <WorkGallerySection />
      <HowItWorksSection />
      <WhyChooseUs />
      <ClientTypesSection />
      <TestimonialsSection />
      <ReferralPromoSection />
      <LocalInfoSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
