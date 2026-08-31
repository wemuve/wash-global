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

const Index = () => {
  return (
    <Layout>
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
