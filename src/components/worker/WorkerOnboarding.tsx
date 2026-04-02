import React, { useState } from 'react';
import { CheckCircle2, Play, FileText, Award, Shield, ChevronRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useWorkerOnboarding } from '@/hooks/useWorkerOnboarding';

const TERMS = [
  'I agree to maintain professional conduct at all times.',
  'I will follow WeWash cleaning standards and quality protocols.',
  'I understand that my performance will be monitored and rated.',
  'I accept that poor performance may result in suspension or removal.',
  'I will arrive on time for all assigned jobs.',
  'I will complete all required checklists and photo documentation.',
  'I consent to background verification checks.',
  'I will treat customer property and information with respect and confidentiality.',
];

const WorkerOnboarding: React.FC = () => {
  const { vendor, modules, progress, onboardingStep, acceptTerms, completeModule, passQuiz } = useWorkerOnboarding();
  const [termsChecked, setTermsChecked] = useState<boolean[]>(new Array(TERMS.length).fill(false));
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [showQuizResult, setShowQuizResult] = useState(false);

  if (!vendor) return null;

  const allTermsChecked = termsChecked.every(Boolean);

  const quizModule = modules.find(m => m.content_type === 'quiz');
  const trainingModules = modules.filter(m => m.content_type !== 'quiz');
  const completedModuleIds = progress.filter(p => p.completed).map(p => p.module_id);

  const handleQuizSubmit = () => {
    if (!quizModule) return;
    const questions = quizModule.quiz_questions;
    let correct = 0;
    questions.forEach((q, i) => {
      if (quizAnswers[i] === q.correct) correct++;
    });
    const score = Math.round((correct / questions.length) * 100);
    setShowQuizResult(true);
    passQuiz(quizModule.id, score);
  };

  // Stepper
  const steps = [
    { key: 'terms', label: 'Accept Terms', icon: FileText },
    { key: 'training', label: 'Complete Training', icon: Play },
    { key: 'quiz', label: 'Pass Assessment', icon: Award },
    { key: 'complete', label: 'Start Working', icon: Shield },
  ];

  const currentStepIndex = steps.findIndex(s => s.key === onboardingStep);

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Stepper */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, i) => {
          const Icon = step.icon;
          const isComplete = i < currentStepIndex;
          const isCurrent = i === currentStepIndex;
          return (
            <React.Fragment key={step.key}>
              <div className="flex flex-col items-center gap-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  isComplete ? 'bg-green-500 text-white' :
                  isCurrent ? 'bg-primary text-primary-foreground' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {isComplete ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                </div>
                <span className={`text-xs font-medium ${isCurrent ? 'text-primary' : 'text-muted-foreground'}`}>
                  {step.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 ${i < currentStepIndex ? 'bg-green-500' : 'bg-muted'}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Step Content */}
      {onboardingStep === 'terms' && (
        <div className="bg-background rounded-2xl shadow-card p-6">
          <h2 className="text-xl font-bold mb-4">WeWash Service Standards & Terms</h2>
          <p className="text-muted-foreground mb-6">
            Please read and accept each of the following terms to proceed with your onboarding.
          </p>
          <div className="space-y-3 mb-6">
            {TERMS.map((term, i) => (
              <label key={i} className="flex items-start gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50">
                <Checkbox
                  checked={termsChecked[i]}
                  onCheckedChange={(checked) => {
                    const updated = [...termsChecked];
                    updated[i] = !!checked;
                    setTermsChecked(updated);
                  }}
                  className="mt-0.5"
                />
                <span className="text-sm">{term}</span>
              </label>
            ))}
          </div>
          <Button onClick={acceptTerms} disabled={!allTermsChecked} className="w-full gap-2">
            Accept Terms & Continue <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {onboardingStep === 'training' && (
        <div className="bg-background rounded-2xl shadow-card p-6">
          <h2 className="text-xl font-bold mb-2">Training Modules</h2>
          <p className="text-muted-foreground mb-6">
            Complete all training modules to proceed to the assessment.
          </p>
          <div className="space-y-3">
            {trainingModules.map((module) => {
              const isCompleted = completedModuleIds.includes(module.id);
              return (
                <div key={module.id} className={`p-4 rounded-xl border transition-colors ${
                  isCompleted ? 'bg-green-50 border-green-200' : 'hover:bg-muted/50'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {isCompleted ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : module.content_type === 'video' ? (
                        <Play className="h-5 w-5 text-primary" />
                      ) : (
                        <FileText className="h-5 w-5 text-primary" />
                      )}
                      <div>
                        <h3 className="font-medium">{module.title}</h3>
                        <p className="text-sm text-muted-foreground">{module.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {module.duration_minutes} min
                      </span>
                      {!isCompleted && (
                        <Button size="sm" onClick={() => completeModule(module.id)}>
                          {module.content_type === 'video' ? 'Watch' : 'Complete'}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {onboardingStep === 'quiz' && quizModule && (
        <div className="bg-background rounded-2xl shadow-card p-6">
          <h2 className="text-xl font-bold mb-2">Final Assessment</h2>
          <p className="text-muted-foreground mb-6">
            You need {quizModule.passing_score}% or higher to pass. Select the best answer for each question.
          </p>
          <div className="space-y-6">
            {quizModule.quiz_questions.map((q, qi) => (
              <div key={qi} className="p-4 rounded-xl border">
                <p className="font-medium mb-3">{qi + 1}. {q.question}</p>
                <div className="space-y-2">
                  {q.options.map((opt, oi) => (
                    <label key={oi} className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                      quizAnswers[qi] === oi ? 'bg-primary/10 border-primary' : 'hover:bg-muted/50'
                    } border`}>
                      <input
                        type="radio"
                        name={`q${qi}`}
                        checked={quizAnswers[qi] === oi}
                        onChange={() => setQuizAnswers({ ...quizAnswers, [qi]: oi })}
                        className="accent-primary"
                      />
                      <span className="text-sm">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <Button
            onClick={handleQuizSubmit}
            disabled={Object.keys(quizAnswers).length < quizModule.quiz_questions.length}
            className="w-full mt-6 gap-2"
          >
            Submit Assessment <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {onboardingStep === 'complete' && (
        <div className="bg-background rounded-2xl shadow-card p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-8 w-8 text-green-500" />
          </div>
          <h2 className="text-xl font-bold mb-2">Onboarding Complete!</h2>
          <p className="text-muted-foreground mb-4">
            You're now an active WeWash worker. Your current tier is <strong className="text-primary capitalize">{vendor?.tier || 'Bronze'}</strong>.
          </p>
          <p className="text-sm text-muted-foreground">
            Job offers will appear in your dashboard. Maintain high ratings to progress to higher tiers.
          </p>
        </div>
      )}
    </div>
  );
};

export default WorkerOnboarding;
