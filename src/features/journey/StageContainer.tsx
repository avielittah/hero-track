import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronRight, Eye, AlertCircle, Lock, CheckCircle2 } from 'lucide-react';
import { useJourneyMachine } from './journeyMachine';
import { StageBanner } from './StageBanner';
import { StageHeader } from './StageHeader';
import { UnitsList } from '../units/UnitsList';
import { StageCompleteModal } from '@/components/StageCompleteModal';
import { FinalWrapUpScreen } from '@/components/FinalWrapUpScreen';
import { useLearningStore } from '@/lib/store';
import { persistAdapter } from '@/lib/persist';
import { useToast } from '@/hooks/use-toast';

export const StageContainer = () => {
  const { t } = useTranslation();
  const { addXP, awardTrophy } = useLearningStore();
  const { toast } = useToast();
  const { 
    currentStage, 
    viewingStage, 
    viewMode, 
    canAdvance, 
    canPeekNext, 
    completeCurrentStage, 
    previewStage,
    isStageEditable 
  } = useJourneyMachine();

  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showFinalWrapUp, setShowFinalWrapUp] = useState(false);
  const [stageCompleteData, setStageCompleteData] = useState<{
    totalXP: number;
    completedUnits: string[];
    newTrophies: string[];
  } | null>(null);

  const isLastStage = currentStage === 8;
  const isCurrentStageView = viewMode === 'current';
  const isPreviewMode = viewMode === 'preview-back';
  const isPeekMode = viewMode === 'peek-forward';
  const canEdit = isStageEditable(viewingStage);

  const handleNext = () => {
    if (canAdvance() && !isLastStage) {
      completeCurrentStage();
      addXP(25); // Bonus XP for stage completion
    }
  };

  const handlePreview = () => {
    if (canPeekNext()) {
      previewStage((currentStage + 1) as any);
    }
  };

  // Get units for the current stage
  const getStageUnits = () => {
    const allStageUnits = {
      1: [
        {
          title: "Team Collaboration Basics",
          objective: "Learn the fundamentals of working together effectively",
          background: "Great teams don't happen by accident - they're built on clear communication and mutual respect.",
          estimatedTime: 12,
          content: { 
            type: 'text' as const, 
            data: "Team collaboration involves clear communication, shared goals, and mutual respect. Modern teams use various digital tools to coordinate work and share information effectively."
          },
          task: {
            type: 'multiple-choice' as const,
            question: "Which of these are key elements of successful team collaboration?",
            options: [
              "Clear communication channels",
              "Shared project goals", 
              "Working in isolation",
              "Regular check-ins and updates"
            ],
            allowMultiple: true,
          },
          xpReward: 15,
        },
        {
          title: "Communication Best Practices",
          objective: "Master the art of clear and effective communication",
          estimatedTime: 10,
          content: {
            type: 'text' as const,
            data: "Effective communication is about being clear, concise, and considerate. It's not just what you say, but how and when you say it."
          },
          task: {
            type: 'open-question' as const,
            question: "Describe a time when clear communication helped solve a problem in your team.",
          },
          xpReward: 12,
        }
      ],
      2: [
        {
          title: "Project Planning Fundamentals", 
          objective: "Master the basics of breaking down complex projects",
          background: "Every big project starts with a good plan. Learn to think like a project manager!",
          estimatedTime: 18,
          content: {
            type: 'link' as const,
            data: "https://www.example.com/project-planning-guide"
          },
          task: {
            type: 'open-question' as const,
            question: "Describe your step-by-step approach to planning a team project.",
          },
          xpReward: 14,
        },
        {
          title: "Task Management Strategies",
          objective: "Learn to organize and prioritize work effectively",
          estimatedTime: 15,
          content: {
            type: 'text' as const,
            data: "Good task management is about knowing what to do, when to do it, and how to track progress along the way."
          },
          task: {
            type: 'checkbox' as const,
            question: "I understand how to break down large tasks into manageable pieces",
            required: true,
          },
          xpReward: 10,
        }
      ],
      3: [
        {
          title: "Communication Tools Mastery",
          objective: "Get hands-on with modern collaboration platforms",
          background: "These tools will become your best friends for remote teamwork!",
          estimatedTime: 22,
          content: {
            type: 'video' as const,
            data: "https://www.youtube.com/embed/dQw4w9WgXcQ"
          },
          task: {
            type: 'multiple-choice' as const,
            question: "Which tools are most effective for different types of team communication?",
            options: [
              "Video calls for complex discussions",
              "Chat for quick updates",
              "Email for everything",
              "Shared documents for collaboration"
            ],
            allowMultiple: true,
          },
          xpReward: 16,
        }
      ],
      4: [
        {
          title: "Portfolio Creation Workshop",
          objective: "Build a portfolio that showcases your skills beautifully",
          background: "Your portfolio is your professional story - let's make it shine!",
          estimatedTime: 35,
          content: {
            type: 'text' as const,
            data: "A great portfolio tells your story, showcases your best work, and demonstrates your growth as a learner and professional."
          },
          task: {
            type: 'file-upload' as const,
            question: "Upload your completed portfolio (PDF, ZIP, or document)",
          },
          xpReward: 25,
        }
      ]
    };

    // Cycle through units based on stage for stages 5-8
    const stageIndex = ((viewingStage - 1) % 4) + 1;
    return allStageUnits[stageIndex as keyof typeof allStageUnits] || allStageUnits[1];
  };

  // Check if all units in current stage are completed
  const getStageProgress = () => {
    const units = getStageUnits();
    const completedUnits: string[] = [];
    let totalXP = 0;

    units.forEach((unit, index) => {
      const unitId = `stage-${viewingStage}-unit-${index}`;
      const stored = persistAdapter.getUnit(unitId);
      if (stored?.status === 'submitted') {
        completedUnits.push(unit.title);
        totalXP += unit.xpReward || 10;
      }
    });

    const isComplete = completedUnits.length === units.length;
    
    return {
      isComplete,
      completedUnits,
      totalXP,
      progress: `${completedUnits.length}/${units.length}`
    };
  };

  const handleMarkStageComplete = async () => {
    const progress = getStageProgress();
    
    if (!progress.isComplete) {
      toast({
        variant: "destructive",
        title: "Stage not ready",
        description: "Please complete all units before marking this stage as complete.",
      });
      return;
    }

    try {
      // Award bonus XP for stage completion
      const bonusXP = 25;
      await addXP(bonusXP);
      
      // Award trophy if this is a major stage
      const majorStages = [1, 3, 4, 6, 8];
      const newTrophies: string[] = [];
      if (majorStages.includes(viewingStage)) {
        awardTrophy(viewingStage);
        const trophyNames = {
          1: "First Steps",
          3: "Building Momentum", 
          4: "Halfway Hero",
          6: "Advanced Achiever",
          8: "Journey Master"
        };
        newTrophies.push(trophyNames[viewingStage as keyof typeof trophyNames]);
      }
      
      // Show success modal
      setStageCompleteData({
        totalXP: progress.totalXP + bonusXP,
        completedUnits: progress.completedUnits,
        newTrophies,
      });
      setShowCompleteModal(true);
      
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to complete stage. Please try again.",
      });
    }
  };

  const handleContinueFromModal = () => {
    setShowCompleteModal(false);
    setStageCompleteData(null);
    
    // Auto-advance to next stage if not the last one
    if (!isLastStage) {
      handleNext();
    } else {
      // Show final wrap-up screen for stage 8
      setShowFinalWrapUp(true);
    }
  };

  const progress = getStageProgress();
  const units = getStageUnits();

  // Show final wrap-up screen if triggered
  if (showFinalWrapUp) {
    return (
      <FinalWrapUpScreen onClose={() => setShowFinalWrapUp(false)} />
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <StageHeader />

        {/* Mode Indicator */}
        {!isCurrentStageView && (
          <motion.div
            className="mb-6"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className={`
              inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium
              ${isPreviewMode ? 'bg-muted text-muted-foreground' : ''}
              ${isPeekMode ? 'bg-secondary/10 text-secondary' : ''}
            `}>
              {isPreviewMode && <AlertCircle className="h-4 w-4" />}
              {isPeekMode && <Lock className="h-4 w-4" />}
              <span>
                {isPreviewMode && 'Read-Only: Completed Stage'}
                {isPeekMode && 'Preview: Next Stage'}
              </span>
            </div>
          </motion.div>
        )}

        {/* Units List */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <UnitsList units={units} stageId={viewingStage} />
        </motion.div>

        {/* Primary CTA */}
        <motion.div
          className="mt-12 flex flex-col items-center space-y-4"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          {/* Progress Summary */}
          <div className="text-center mb-4">
            <p className="text-lg text-muted-foreground">
              {progress.isComplete ? (
                <span className="flex items-center justify-center space-x-2 text-green-600">
                  <CheckCircle2 className="h-5 w-5" />
                  <span>All units completed! Ready to finish this stage? 🎉</span>
                </span>
              ) : (
                `Progress: ${progress.progress} units completed`
              )}
            </p>
          </div>

          {/* Primary Action Button */}
          {isCurrentStageView && (
            <Button
              onClick={progress.isComplete ? handleMarkStageComplete : undefined}
              disabled={!canEdit}
              size="lg"
              className={`
                px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 group
                ${progress.isComplete ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-primary hover:bg-primary-700 text-primary-foreground'}
              `}
            >
              <span className="flex items-center space-x-2">
                <span>
                  {progress.isComplete ? 'Mark Stage Complete! 🎯' : 'Continue This Stage'}
                </span>
                <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
          )}

          {/* Secondary Actions */}
          {isCurrentStageView && (
            <div className="flex items-center space-x-4">
              <Button
                onClick={handlePreview}
                disabled={!canPeekNext()}
                variant="outline"
                size="sm"
                className="group"
              >
                <span className="flex items-center space-x-2">
                  <Eye className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span>{isPeekMode ? 'Previewing Next' : 'Peek Next Stage'}</span>
                </span>
              </Button>
            </div>
          )}
        </motion.div>
      </div>
      
      {/* Stage Banner */}
      <StageBanner />

      {/* Stage Complete Modal */}
      {showCompleteModal && stageCompleteData && (
        <StageCompleteModal
          isOpen={showCompleteModal}
          onClose={() => setShowCompleteModal(false)}
          onContinue={handleContinueFromModal}
          stageNumber={viewingStage}
          totalXP={stageCompleteData.totalXP}
          completedUnits={stageCompleteData.completedUnits}
          newTrophies={stageCompleteData.newTrophies}
        />
      )}
    </div>
  );
};