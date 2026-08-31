import React from 'react';
import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/home/HeroSection';
import ServicesSection from '@/components/home/ServicesSection';
import BeforeAfterSection from '@/components/home/BeforeAfterSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import ClientTypesSection from '@/components/home/ClientTypesSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import CTASection from '@/components/home/CTASection';
import ReferralPromoSection from '@/components/home/ReferralPromoSection';

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <ServicesSection />
      <BeforeAfterSection />
      <HowItWorksSection />
      <WhyChooseUs />
      <ClientTypesSection />
      <TestimonialsSection />
      <ReferralPromoSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
