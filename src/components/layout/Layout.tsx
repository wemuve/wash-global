import React from 'react';
import Header from './Header';
import Footer from './Footer';
import AIReceptionist from '@/components/ai/AIReceptionist';

interface LayoutProps {
  children: React.ReactNode;
  hideFooter?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, hideFooter = false }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      {!hideFooter && <Footer />}
      <AIReceptionist />
    </div>
  );
};

export default Layout;
