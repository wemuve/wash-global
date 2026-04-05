import React from 'react';
import { Gift, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import WhatsAppCatalog from '@/components/whatsapp/WhatsAppCatalog';

const ReferralPromoSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 md:py-32">
      <div className="container-wewash">
        {/* Header */}
        <div className="max-w-xl mb-16">
          <p className="text-secondary text-xs uppercase tracking-[0.25em] font-medium mb-4">Connect & Save</p>
          <h2 className="text-foreground font-light">
            More Ways to <span className="font-bold">Engage</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-px bg-border/30">
          {/* Referral */}
          <div className="bg-background p-8 md:p-12">
            <Gift className="h-5 w-5 text-secondary mb-6" />
            <h3 className="text-2xl font-semibold text-foreground mb-3">Refer & Earn K50</h3>
            <p className="text-sm text-muted-foreground font-light mb-8">
              Share your unique code with friends. Both earn K50 credit after their first completed service.
            </p>

            <div className="space-y-4 mb-8">
              {['Get your unique referral code', 'Share with friends via any channel', 'Both earn K50 credit'].map((step, i) => (
                <div key={i} className="flex items-center gap-4">
                  <span className="w-6 h-6 rounded-full border border-border/50 flex items-center justify-center text-xs text-muted-foreground">{i + 1}</span>
                  <span className="text-sm text-foreground/80 font-light">{step}</span>
                </div>
              ))}
            </div>

            <Button 
              onClick={() => navigate('/dashboard')}
              variant="outline"
              className="gap-2 border-border/40 text-foreground/70"
            >
              <Gift className="h-4 w-4" />
              Start Referring
            </Button>
          </div>

          {/* WhatsApp */}
          <div className="bg-background p-8 md:p-12">
            <MessageSquare className="h-5 w-5 text-success mb-6" />
            <h3 className="text-2xl font-semibold text-foreground mb-3">WhatsApp Catalog</h3>
            <p className="text-sm text-muted-foreground font-light mb-8">
              Browse our full service catalog on WhatsApp. Get instant quotes, ask questions, and book with ease.
            </p>

            <div className="space-y-3 mb-8">
              {['Chat directly with our team', 'Get instant price quotes', 'Pay via mobile money', 'Book with voice messages'].map((item, i) => (
                <p key={i} className="text-sm text-foreground/60 font-light flex items-center gap-3">
                  <span className="w-1 h-1 rounded-full bg-success flex-shrink-0" />
                  {item}
                </p>
              ))}
            </div>

            <WhatsAppCatalog variant="button" className="w-auto" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReferralPromoSection;
