import React from 'react';
import { Star, TrendingUp, Clock, AlertTriangle, Users, Award } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface PerformanceProps {
  vendor: {
    tier: string;
    avg_rating: number;
    completion_rate: number;
    punctuality_score: number;
    complaint_count: number;
    serious_complaint_count: number;
    repeat_booking_rate: number;
    total_completed_jobs: number;
  };
}

const TIER_CONFIG = {
  bronze: { color: 'text-amber-700', bg: 'bg-amber-100', label: 'Bronze', next: 'Silver', req: 'Rating ≥ 4.2, 90% completion, 10+ jobs' },
  silver: { color: 'text-gray-500', bg: 'bg-gray-100', label: 'Silver', next: 'Gold', req: 'Rating ≥ 4.6, 95% completion, 25+ jobs' },
  gold: { color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Gold', next: 'Elite', req: 'Rating ≥ 4.8, 98% completion, 50+ jobs' },
  elite: { color: 'text-purple-600', bg: 'bg-purple-100', label: 'Elite', next: null, req: 'Top performer — maximum priority' },
};

const WorkerPerformance: React.FC<PerformanceProps> = ({ vendor }) => {
  const tier = TIER_CONFIG[vendor.tier as keyof typeof TIER_CONFIG] || TIER_CONFIG.bronze;

  const metrics = [
    { label: 'Average Rating', value: vendor.avg_rating.toFixed(1), max: 5, percent: (vendor.avg_rating / 5) * 100, icon: Star, color: 'text-yellow-500' },
    { label: 'Completion Rate', value: `${vendor.completion_rate}%`, max: 100, percent: vendor.completion_rate, icon: TrendingUp, color: 'text-green-500' },
    { label: 'Punctuality', value: `${vendor.punctuality_score}%`, max: 100, percent: vendor.punctuality_score, icon: Clock, color: 'text-blue-500' },
    { label: 'Repeat Customers', value: `${vendor.repeat_booking_rate}%`, max: 100, percent: vendor.repeat_booking_rate, icon: Users, color: 'text-purple-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Tier Card */}
      <div className={`${tier.bg} rounded-2xl p-6`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Award className={`h-8 w-8 ${tier.color}`} />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Current Tier</p>
              <h3 className={`text-2xl font-bold ${tier.color}`}>{tier.label}</h3>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">{vendor.total_completed_jobs} jobs completed</p>
            {tier.next && (
              <p className="text-xs text-muted-foreground mt-1">
                Next: {tier.next} — {tier.req}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid sm:grid-cols-2 gap-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.label} className="bg-background rounded-xl p-4 shadow-card">
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`h-4 w-4 ${metric.color}`} />
                <span className="text-sm text-muted-foreground">{metric.label}</span>
              </div>
              <p className="text-2xl font-bold mb-2">{metric.value}</p>
              <Progress value={metric.percent} className="h-2" />
            </div>
          );
        })}
      </div>

      {/* Warnings */}
      {(vendor.complaint_count > 0 || vendor.serious_complaint_count > 0) && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <h4 className="font-semibold text-destructive">Performance Alerts</h4>
          </div>
          <ul className="text-sm space-y-1 text-muted-foreground">
            {vendor.complaint_count > 0 && (
              <li>• {vendor.complaint_count} total complaint(s) on record</li>
            )}
            {vendor.serious_complaint_count > 0 && (
              <li className="text-destructive">• {vendor.serious_complaint_count} serious complaint(s) — 2 within first 5 jobs triggers review</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default WorkerPerformance;
