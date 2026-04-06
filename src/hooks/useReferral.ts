import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface ReferralCode {
  id: string;
  user_id: string;
  code: string;
  is_active: boolean;
  created_at: string;
}

interface Referral {
  id: string;
  referrer_id: string;
  referred_booking_id: string | null;
  referral_code: string;
  status: string;
  credit_amount: number;
  currency: string;
  credited_at: string | null;
  created_at: string;
}

interface UserCredits {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
}

export const useReferral = () => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [referralCode, setReferralCode] = useState<ReferralCode | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [credits, setCredits] = useState<UserCredits | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReferralData = useCallback(async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      // Fetch user's referral code
      const { data: codeData } = await supabase
        .from('referral_codes')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .maybeSingle();

      setReferralCode(codeData);

      // Fetch user's referrals
      const { data: referralsData } = await supabase
        .from('referrals')
        .select('*')
        .eq('referrer_id', user.id)
        .order('created_at', { ascending: false });

      setReferrals(referralsData || []);

      // Fetch user's credits
      const { data: creditsData } = await supabase
        .from('user_credits')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      setCredits(creditsData);
    } catch (error) {
      console.error('Error fetching referral data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchReferralData();
    }
  }, [isAuthenticated, fetchReferralData]);

  const generateReferralCode = async () => {
    if (!user?.id) {
      toast({
        title: 'Please sign in',
        description: 'You need to be signed in to get a referral code.',
        variant: 'destructive',
      });
      return null;
    }

    try {
      // Generate unique code using the database function
      const { data: codeResult, error: codeError } = await supabase
        .rpc('generate_referral_code', { user_uuid: user.id });

      if (codeError) throw codeError;

      // Insert the new referral code
      const { data, error } = await supabase
        .from('referral_codes')
        .insert({
          user_id: user.id,
          code: codeResult,
        })
        .select()
        .single();

      if (error) throw error;

      setReferralCode(data);
      toast({
        title: 'Referral code created!',
        description: `Your code is: ${data.code}`,
      });

      return data;
    } catch (error) {
      console.error('Error generating referral code:', error);
      toast({
        title: 'Error',
        description: 'Could not generate referral code. Please try again.',
        variant: 'destructive',
      });
      return null;
    }
  };

  const validateReferralCode = async (code: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .rpc('validate_referral_code', { code_to_check: code.toUpperCase() });

      if (error) throw error;

      return !!data;
    } catch (error) {
      console.error('Error validating referral code:', error);
      return false;
    }
  };

  const applyReferralCode = async (code: string, bookingId: string): Promise<boolean> => {
    try {
      // Validate and get code owner via secure RPC
      const { data: ownerId, error: ownerError } = await supabase
        .rpc('get_referral_code_owner', { code_to_check: code.toUpperCase() });

      if (ownerError || !ownerId) {
        toast({
          title: 'Invalid code',
          description: 'This referral code is not valid.',
          variant: 'destructive',
        });
        return false;
      }

      // Don't allow self-referral
      if (user?.id && ownerId === user.id) {
        toast({
          title: 'Cannot use own code',
          description: 'You cannot use your own referral code.',
          variant: 'destructive',
        });
        return false;
      }

      // Create the referral record
      const { error: referralError } = await supabase
        .from('referrals')
        .insert({
          referrer_id: codeData.user_id,
          referred_user_id: user?.id || null,
          referred_booking_id: bookingId,
          referral_code: code.toUpperCase(),
          status: 'pending',
          credit_amount: 50,
          currency: 'ZMW',
        });

      if (referralError) throw referralError;

      toast({
        title: 'Referral code applied!',
        description: 'K50 credit will be awarded after service completion.',
      });

      return true;
    } catch (error) {
      console.error('Error applying referral code:', error);
      toast({
        title: 'Error',
        description: 'Could not apply referral code.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const getShareLink = () => {
    if (!referralCode) return '';
    return `${window.location.origin}/booking?ref=${referralCode.code}`;
  };

  const getShareMessage = () => {
    if (!referralCode) return '';
    return `Book professional cleaning services with WeWash Global! Use my referral code ${referralCode.code} and we both get K50 credit! ${getShareLink()}`;
  };

  const shareOnWhatsApp = () => {
    const message = encodeURIComponent(getShareMessage());
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  return {
    referralCode,
    referrals,
    credits,
    isLoading,
    generateReferralCode,
    validateReferralCode,
    applyReferralCode,
    getShareLink,
    getShareMessage,
    shareOnWhatsApp,
    refetch: fetchReferralData,
  };
};
