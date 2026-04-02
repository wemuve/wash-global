import React, { useState, useEffect } from 'react';
import { CheckSquare, Camera, Wrench, ShieldCheck } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ChecklistProps {
  assignmentId: string;
  serviceName?: string;
}

interface ServiceChecklist {
  id: string;
  service_name: string;
  checklist_items: string[];
  expected_duration_minutes: number;
  required_tools: string[];
  quality_checkpoints: string[];
  requires_before_photos: boolean;
  requires_after_photos: boolean;
}

const ServiceChecklist: React.FC<ChecklistProps> = ({ assignmentId, serviceName }) => {
  const { toast } = useToast();
  const [checklist, setChecklist] = useState<ServiceChecklist | null>(null);
  const [completedItems, setCompletedItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChecklist = async () => {
      if (!serviceName) { setLoading(false); return; }
      
      const { data } = await supabase
        .from('service_checklists')
        .select('*')
        .ilike('service_name', `%${serviceName}%`)
        .eq('is_active', true)
        .limit(1)
        .single();

      if (data) setChecklist(data as unknown as ServiceChecklist);
      setLoading(false);
    };
    fetchChecklist();
  }, [serviceName]);

  const toggleItem = (item: string) => {
    setCompletedItems(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const submitChecklist = async () => {
    if (!checklist) return;
    
    const percentage = Math.round((completedItems.length / checklist.checklist_items.length) * 100);
    
    await supabase.from('job_checklist_completions').insert({
      assignment_id: assignmentId,
      checklist_id: checklist.id,
      completed_items: completedItems,
      completion_percentage: percentage,
      completed_at: percentage === 100 ? new Date().toISOString() : null,
    });

    toast({ title: percentage === 100 ? 'Checklist complete!' : `Checklist ${percentage}% complete` });
  };

  if (loading) return <div className="text-center py-4 text-sm text-muted-foreground">Loading checklist...</div>;
  if (!checklist) return null;

  const percentage = Math.round((completedItems.length / checklist.checklist_items.length) * 100);

  return (
    <div className="bg-background rounded-xl p-5 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CheckSquare className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">{checklist.service_name} Checklist</h3>
        </div>
        <span className={`text-sm font-medium ${percentage === 100 ? 'text-green-600' : 'text-muted-foreground'}`}>
          {percentage}%
        </span>
      </div>

      {/* Required Tools */}
      {checklist.required_tools.length > 0 && (
        <div className="mb-4 p-3 bg-muted/50 rounded-lg">
          <p className="text-xs font-medium flex items-center gap-1 mb-1">
            <Wrench className="h-3 w-3" /> Required Tools
          </p>
          <p className="text-xs text-muted-foreground">{checklist.required_tools.join(' • ')}</p>
        </div>
      )}

      {/* Photo Requirements */}
      {(checklist.requires_before_photos || checklist.requires_after_photos) && (
        <div className="mb-4 p-3 bg-primary/5 rounded-lg">
          <p className="text-xs font-medium flex items-center gap-1">
            <Camera className="h-3 w-3" /> Photo Documentation Required
          </p>
          <p className="text-xs text-muted-foreground">
            {checklist.requires_before_photos && 'Before photos • '}
            {checklist.requires_after_photos && 'After photos'}
          </p>
        </div>
      )}

      {/* Checklist Items */}
      <div className="space-y-2 mb-4">
        {checklist.checklist_items.map((item, i) => (
          <label key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer">
            <Checkbox
              checked={completedItems.includes(item)}
              onCheckedChange={() => toggleItem(item)}
            />
            <span className={`text-sm ${completedItems.includes(item) ? 'line-through text-muted-foreground' : ''}`}>
              {item}
            </span>
          </label>
        ))}
      </div>

      {/* Quality Checkpoints */}
      {checklist.quality_checkpoints.length > 0 && (
        <div className="mb-4 p-3 bg-green-50 rounded-lg">
          <p className="text-xs font-medium flex items-center gap-1 mb-1">
            <ShieldCheck className="h-3 w-3 text-green-600" /> Quality Checkpoints
          </p>
          <ul className="text-xs text-muted-foreground space-y-0.5">
            {checklist.quality_checkpoints.map((cp, i) => (
              <li key={i}>✓ {cp}</li>
            ))}
          </ul>
        </div>
      )}

      <Button onClick={submitChecklist} disabled={completedItems.length === 0} className="w-full">
        Submit Checklist ({percentage}% Complete)
      </Button>
    </div>
  );
};

export default ServiceChecklist;
