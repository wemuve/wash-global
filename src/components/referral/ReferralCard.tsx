import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useReferral } from '@/hooks/useReferral';
import { useAuth } from '@/hooks/useAuth';
import { 
  Gift, 
  Copy, 
  Share2, 
  Users, 
  Wallet,
  CheckCircle2,
  Clock,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ReferralCard = () => {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const {
    referralCode,
    referrals,
    credits,
    isLoading,
    generateReferralCode,
    shareOnWhatsApp,
    getShareLink,
  } = useReferral();

  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateCode = async () => {
    setIsGenerating(true);
    await generateReferralCode();
    setIsGenerating(false);
  };

  const handleCopyCode = () => {
    if (referralCode) {
      navigator.clipboard.writeText(referralCode.code);
      toast({
        title: 'Copied!',
        description: 'Referral code copied to clipboard.',
      });
    }
  };

  const handleCopyLink = () => {
    const link = getShareLink();
    if (link) {
      navigator.clipboard.writeText(link);
      toast({
        title: 'Copied!',
        description: 'Referral link copied to clipboard.',
      });
    }
  };

  const completedReferrals = referrals.filter(r => r.status === 'completed').length;
  const pendingReferrals = referrals.filter(r => r.status === 'pending').length;
  const totalEarned = referrals.filter(r => r.status === 'completed').reduce((sum, r) => sum + Number(r.credit_amount), 0);

  if (!isAuthenticated) {
    return (
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-wewash-gold" />
            Refer & Earn K50
          </CardTitle>
          <CardDescription>
            Sign in to get your unique referral code and start earning credits!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full" onClick={() => window.location.href = '/auth'}>
            Sign In to Start Referring
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="border-border/50">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-wewash-gold via-primary to-wewash-gold" />
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-5 w-5 text-wewash-gold" />
          Refer & Earn K50
        </CardTitle>
        <CardDescription>
          Share your code with friends. When they book, you both get K50 credit!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-muted/50 rounded-xl">
            <Wallet className="h-5 w-5 mx-auto mb-1 text-wewash-gold" />
            <p className="text-lg font-bold text-foreground">K{credits?.amount || 0}</p>
            <p className="text-xs text-muted-foreground">Credits</p>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-xl">
            <Users className="h-5 w-5 mx-auto mb-1 text-primary" />
            <p className="text-lg font-bold text-foreground">{completedReferrals}</p>
            <p className="text-xs text-muted-foreground">Referred</p>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-xl">
            <Clock className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
            <p className="text-lg font-bold text-foreground">{pendingReferrals}</p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </div>
        </div>

        {/* Referral Code */}
        {referralCode ? (
          <div className="space-y-3">
            <label className="text-sm font-medium text-muted-foreground">Your Referral Code</label>
            <div className="flex gap-2">
              <Input
                value={referralCode.code}
                readOnly
                className="font-mono text-lg font-bold tracking-wider bg-card text-center"
              />
              <Button variant="outline" size="icon" onClick={handleCopyCode}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex gap-2">
              <Button 
                className="flex-1 gap-2 btn-whatsapp" 
                onClick={shareOnWhatsApp}
              >
                <Share2 className="h-4 w-4" />
                Share on WhatsApp
              </Button>
              <Button variant="outline" onClick={handleCopyLink}>
                <Copy className="h-4 w-4 mr-2" />
                Copy Link
              </Button>
            </div>
          </div>
        ) : (
          <Button 
            className="w-full gap-2" 
            onClick={handleGenerateCode}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Gift className="h-4 w-4" />
            )}
            Get My Referral Code
          </Button>
        )}

        {/* Recent Referrals */}
        {referrals.length > 0 && (
          <div className="pt-4 border-t border-border">
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Recent Referrals</h4>
            <div className="space-y-2">
              {referrals.slice(0, 3).map((referral) => (
                <div 
                  key={referral.id} 
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    {referral.status === 'completed' ? (
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    ) : (
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="text-sm text-foreground">
                      {new Date(referral.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <Badge variant={referral.status === 'completed' ? 'default' : 'secondary'}>
                    {referral.status === 'completed' ? '+K50' : 'Pending'}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* How it works */}
        <div className="pt-4 border-t border-border">
          <h4 className="text-sm font-medium text-muted-foreground mb-3">How it works</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center">1</span>
              <span>Share your unique referral code with friends</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center">2</span>
              <span>They book a service using your code</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center">3</span>
              <span>After service completion, you both get K50 credit!</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReferralCard;
