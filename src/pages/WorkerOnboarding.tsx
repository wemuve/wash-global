import React from 'react';
import Layout from '@/components/layout/Layout';
import WorkerOnboarding from '@/components/worker/WorkerOnboarding';
import { Helmet } from 'react-helmet-async';

const WorkerOnboardingPage = () => {
  return (
    <Layout>
      <Helmet>
        <title>Worker Onboarding | WeWash Zambia</title>
        <meta name="description" content="Complete your WeWash onboarding to start accepting jobs" />
      </Helmet>
      <section className="bg-wewash-navy py-8">
        <div className="container-wewash">
          <h1 className="text-2xl font-bold text-white">Worker Onboarding</h1>
          <p className="text-white/70">Complete the steps below to start receiving job assignments</p>
        </div>
      </section>
      <section className="section-spacing">
        <div className="container-wewash">
          <WorkerOnboarding />
        </div>
      </section>
    </Layout>
  );
};

export default WorkerOnboardingPage;
