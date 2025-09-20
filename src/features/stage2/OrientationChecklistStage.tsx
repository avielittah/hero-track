import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { AlertTriangle, MessageCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StageIntro } from '@/components/unified-stage/StageIntro';
import { TaskItem } from './TaskItem';
import { CompletionSummary } from './CompletionSummary';
import { CompletionBanner } from '@/components/CompletionBanner';
import { orientation1Content } from './orientation1.content';
import { useJourneyMachine } from '@/features/journey/journeyMachine';
import { useLearningStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';

interface Stage2State {
  tasks: Record<string, boolean>;
  submitted: boolean;
}

const STORAGE_KEY = 'stage2-checklist';

export const OrientationChecklistStage = () => {
  const { i18n } = useTranslation();
  const { toast } = useToast();
  const { addXP } = useLearningStore();
  const { currentStage, viewingStage, viewMode, completeCurrentStage, isStageEditable } = useJourneyMachine();

  // Load state from localStorage
  const [stage2State, setStage2State] = useState<Stage2State>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : { tasks: {}, submitted: false };
    } catch {
      return { tasks: {}, submitted: false };
    }
  });

  // Set document direction for RTL support
  useEffect(() => {
    document.documentElement.dir = i18n.language === 'he' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stage2State));
  }, [stage2State]);

  const isPreviewMode = viewMode === 'preview-back' || stage2State.submitted;
  const canEdit = isStageEditable(2) && !stage2State.submitted;
  const shouldShowStage = currentStage >= 2 || viewingStage === 2;

  // Check if we can advance (all required tasks completed)
  const requiredTasks = orientation1Content.tasks.filter(task => task.required);
  const allRequiredComplete = requiredTasks.every(task => stage2State.tasks[task.id]);

  const handleTaskToggle = (taskId: string, checked: boolean) => {
    if (!canEdit) return;
    
    setStage2State(prev => ({
      ...prev,
      tasks: {
        ...prev.tasks,
        [taskId]: checked
      }
    }));
  };

  const handleComplete = async () => {
    if (!allRequiredComplete || !canEdit) return;

    // Calculate total XP from completed tasks
    const totalXP = orientation1Content.tasks
      .filter(task => stage2State.tasks[task.id])
      .reduce((sum, task) => sum + task.xp, 0);

    try {
      // Grant XP
      await addXP(totalXP);
      
      // Mark as submitted
      setStage2State(prev => ({ ...prev, submitted: true }));
      
      // Show success toast
      toast({
        title: "Orientation Complete!",
        description: orientation1Content.toastDone.replace('{{xp}}', totalXP.toString()),
      });

      // Complete the stage and advance
      completeCurrentStage();
      
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to complete orientation. Please try again.",
      });
    }
  };

  const handleBuddyClick = () => {
    const buddyUrl = process.env.VITE_BUDDY_URL || 'https://buddy.taleai.com';
    window.open(buddyUrl, '_blank', 'noopener,noreferrer');
  };

  if (!shouldShowStage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto" />
          <p className="text-muted-foreground">
            Orientation checklist is only available after completing the welcome stage.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Preview Banner */}
      {isPreviewMode && (
        <CompletionBanner stageName="Orientation Checklist" />
      )}

      {/* Main Container */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Stage Intro */}
          <StageIntro 
            title={orientation1Content.title}
            description={orientation1Content.intro}
            estimatedTime={orientation1Content.estTime}
            xpTarget={50}
            icon={<CheckCircle2 className="h-8 w-8" />}
          />

          {/* Main Content */}
          <div className="space-y-8">
            {/* Checklist */}
            <div>
              <motion.div
                className="space-y-4"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {orientation1Content.tasks.map((task, index) => (
                  <TaskItem
                    key={task.id}
                    id={task.id}
                    label={task.label}
                    help={task.help}
                    required={task.required}
                    xp={task.xp}
                    checked={stage2State.tasks[task.id] || false}
                    disabled={!canEdit}
                    onToggle={handleTaskToggle}
                  />
                ))}
              </motion.div>

              {/* Buddy Nudge */}
              <motion.div
                className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 p-3 rounded-xl bg-gradient-to-br from-primary to-secondary text-white">
                    <MessageCircle className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <p className="text-muted-foreground mb-3">
                      {orientation1Content.buddyNudge}
                    </p>
                    <Button
                      onClick={handleBuddyClick}
                      variant="outline"
                      size="sm"
                      className="border-primary/30 text-primary hover:bg-primary hover:text-white"
                    >
                      Ask Buddy
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Summary */}
            <div className="bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-sm rounded-2xl border-2 shadow-lg p-6">
              <CompletionSummary checkedTasks={stage2State.tasks} />
            </div>
          </div>

          {/* Primary CTA */}
          <motion.div
            className="mt-12 text-center"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Button
              onClick={handleComplete}
              disabled={!allRequiredComplete || !canEdit}
              size="lg"
              className={`
                px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300
                ${allRequiredComplete ? 'bg-green-600 hover:bg-green-700' : ''}
              `}
            >
              {orientation1Content.ctaComplete}
            </Button>
            
            {!allRequiredComplete && canEdit && (
              <p className="text-sm text-muted-foreground mt-2">
                Complete all required tasks to continue
              </p>
            )}
          </motion.div>
        </motion.div>

        {/* Bottom Spacing */}
        <div className="h-24" />
      </div>

      {/* Background Decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
      </div>
    </div>
  );
};