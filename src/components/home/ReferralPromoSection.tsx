import React from 'react';
import { Gift, MessageSquare, Users, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import WhatsAppCatalog from '@/components/whatsapp/WhatsAppCatalog';

const ReferralPromoSection = () => {
  const navigate = useNavigate();

  return (
    <section className="section-spacing bg-gradient-to-b from-muted/30 to-background">
      <div className="container-wewash">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            More Ways to <span className="gradient-text">Connect & Save</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Shop on WhatsApp or refer friends to earn credits on every booking
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Referral Program Card */}
          <div className="card-elevated p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-wewash-gold/20 flex items-center justify-center">
                <Gift className="h-6 w-6 text-wewash-gold" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Refer & Earn K50</h3>
                <p className="text-sm text-muted-foreground">Share and save together</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">1</span>
                </div>
                <div>
                  <p className="font-medium text-foreground">Get your unique code</p>
                  <p className="text-sm text-muted-foreground">Sign in to generate your personal referral code</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">2</span>
                </div>
                <div>
                  <p className="font-medium text-foreground">Share with friends</p>
                  <p className="text-sm text-muted-foreground">Send via WhatsApp, SMS, or any way you like</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">3</span>
                </div>
                <div>
                  <p className="font-medium text-foreground">Both earn K50!</p>
                  <p className="text-sm text-muted-foreground">Credit applied after their service is completed</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-wewash-gold/10 rounded-xl mb-6">
              <Users className="h-8 w-8 text-wewash-gold" />
              <div>
                <p className="text-2xl font-bold text-foreground">K50</p>
                <p className="text-sm text-muted-foreground">Per successful referral</p>
              </div>
            </div>

            <Button 
              onClick={() => navigate('/dashboard')}
              className="w-full gap-2"
            >
              <Gift className="h-4 w-4" />
              Start Referring
            </Button>
          </div>

          {/* WhatsApp Catalog Card */}
          <div className="card-elevated p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-success" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">WhatsApp Catalog</h3>
                <p className="text-sm text-muted-foreground">Browse and book on WhatsApp</p>
              </div>
            </div>

            <p className="text-muted-foreground mb-6">
              Prefer to chat? Browse our full service catalog directly on WhatsApp. 
              Get instant quotes, ask questions, and book with ease.
            </p>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="text-sm text-foreground">Chat directly with our team</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="text-sm text-foreground">Get instant price quotes</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="text-sm text-foreground">Pay via mobile money in chat</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="text-sm text-foreground">Book with voice messages</span>
              </div>
            </div>

            <WhatsAppCatalog variant="button" className="w-full" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReferralPromoSection;
