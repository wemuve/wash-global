import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface TrainingModule {
  id: string;
  title: string;
  description: string;
  content_type: string;
  content_url: string | null;
  duration_minutes: number;
  sort_order: number;
  quiz_questions: QuizQuestion[];
  passing_score: number;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
}

interface TrainingProgress {
  id: string;
  module_id: string;
  completed: boolean;
  completed_at: string | null;
  quiz_score: number | null;
  quiz_attempts: number;
}

interface VendorProfile {
  id: string;
  name: string;
  onboarding_status: string;
  training_completed: boolean;
  quiz_passed: boolean;
  terms_accepted: boolean;
  id_verified: boolean;
  tier: string;
  avg_rating: number;
  completion_rate: number;
  total_completed_jobs: number;
  punctuality_score: number;
  complaint_count: number;
  serious_complaint_count: number;
  repeat_booking_rate: number;
}

export function useWorkerOnboarding() {
  const { toast } = useToast();
  const [vendor, setVendor] = useState<VendorProfile | null>(null);
  const [modules, setModules] = useState<TrainingModule[]>([]);
  const [progress, setProgress] = useState<TrainingProgress[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [vendorRes, modulesRes] = await Promise.all([
        supabase.from('vendors').select('*').eq('user_id', user.id).single(),
        supabase.from('training_modules').select('*').order('sort_order'),
      ]);

      if (vendorRes.data) {
        setVendor(vendorRes.data as unknown as VendorProfile);
        
        const progressRes = await supabase
          .from('training_progress')
          .select('*')
          .eq('vendor_id', vendorRes.data.id);
        
        setProgress((progressRes.data || []) as unknown as TrainingProgress[]);
      }

      setModules((modulesRes.data || []) as unknown as TrainingModule[]);
    } catch (error) {
      console.error('Error fetching onboarding data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const acceptTerms = async () => {
    if (!vendor) return;
    const { error } = await supabase
      .from('vendors')
      .update({ 
        terms_accepted: true, 
        terms_accepted_at: new Date().toISOString(),
        onboarding_status: 'training'
      })
      .eq('id', vendor.id);
    
    if (error) {
      toast({ title: 'Error accepting terms', variant: 'destructive' });
      return;
    }
    toast({ title: 'Terms accepted!' });
    fetchData();
  };

  const completeModule = async (moduleId: string, quizScore?: number) => {
    if (!vendor) return;
    
    const existing = progress.find(p => p.module_id === moduleId);
    
    if (existing) {
      await supabase
        .from('training_progress')
        .update({ 
          completed: true, 
          completed_at: new Date().toISOString(),
          quiz_score: quizScore ?? existing.quiz_score,
          quiz_attempts: (existing.quiz_attempts || 0) + (quizScore !== undefined ? 1 : 0)
        })
        .eq('id', existing.id);
    } else {
      await supabase
        .from('training_progress')
        .insert({
          vendor_id: vendor.id,
          module_id: moduleId,
          completed: true,
          completed_at: new Date().toISOString(),
          quiz_score: quizScore,
          quiz_attempts: quizScore !== undefined ? 1 : 0
        });
    }
    
    // Check if all modules completed
    const allModules = modules.filter(m => m.content_type !== 'quiz');
    const completedCount = progress.filter(p => p.completed).length + 1;
    
    if (completedCount >= allModules.length) {
      await supabase
        .from('vendors')
        .update({ 
          training_completed: true,
          training_completed_at: new Date().toISOString(),
          onboarding_status: 'quiz'
        })
        .eq('id', vendor.id);
    }
    
    fetchData();
  };

  const passQuiz = async (moduleId: string, score: number) => {
    if (!vendor) return;
    
    await completeModule(moduleId, score);
    
    const module = modules.find(m => m.id === moduleId);
    if (module && score >= module.passing_score) {
      await supabase
        .from('vendors')
        .update({ 
          quiz_passed: true,
          quiz_passed_at: new Date().toISOString(),
          onboarding_status: 'active',
          is_active: true
        })
        .eq('id', vendor.id);
      
      toast({ title: 'Congratulations! You passed the assessment!' });
    } else {
      toast({ title: 'Quiz not passed. Please try again.', variant: 'destructive' });
    }
    
    fetchData();
  };

  const onboardingStep = vendor
    ? !vendor.terms_accepted ? 'terms'
    : !vendor.training_completed ? 'training'
    : !vendor.quiz_passed ? 'quiz'
    : 'complete'
    : 'register';

  return {
    vendor,
    modules,
    progress,
    loading,
    onboardingStep,
    acceptTerms,
    completeModule,
    passQuiz,
    refresh: fetchData,
  };
}
