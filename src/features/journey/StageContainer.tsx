import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronRight, Eye, AlertCircle, Lock } from 'lucide-react';
import { useJourneyMachine } from './journeyMachine';
import { StageBanner } from './StageBanner';
import { StageHeader } from './StageHeader';
import { MicroUnit } from '../units/MicroUnit';
import { useLearningStore } from '@/lib/store';

export const StageContainer = () => {
  const { t } = useTranslation();
  const { addXP } = useLearningStore();
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

  const isLastStage = currentStage === 8;
  const isCurrentStageView = viewMode === 'current';
  const isPreviewMode = viewMode === 'preview-back';
  const isPeekMode = viewMode === 'peek-forward';
  const canEdit = isStageEditable(viewingStage);

  const handleNext = () => {
    if (canAdvance() && !isLastStage) {
      completeCurrentStage();
      addXP(25); // Reward for progression
    }
  };

  const handlePreview = () => {
    if (canPeekNext()) {
      previewStage((currentStage + 1) as any);
    }
  };

  // Sample unit data for different stages
  const getUnitData = () => {
    const baseUnits = [
      {
        title: "Introduction to Team Collaboration",
        objective: "Learn the fundamentals of effective team communication and collaboration tools",
        background: "Effective teamwork is essential for project success. This unit covers the basic principles and tools you'll need.",
        estimatedTime: 15,
        content: { 
          type: 'text' as const, 
          data: "Team collaboration involves clear communication, shared goals, and mutual respect. Modern teams use various digital tools to coordinate work, share information, and track progress. Key principles include active listening, constructive feedback, and inclusive participation from all team members."
        },
        task: {
          type: 'multiple-choice' as const,
          question: "Which of the following are essential elements of team collaboration?",
          options: [
            "Clear communication channels",
            "Shared project goals", 
            "Individual work only",
            "Regular check-ins and updates"
          ],
          allowMultiple: true,
        },
        xpReward: 15, // Higher reward for multiple choice
      },
      {
        title: "Project Planning Fundamentals", 
        objective: "Master the basics of project planning and task breakdown",
        estimatedTime: 20,
        content: {
          type: 'link' as const,
          data: "https://www.example.com/project-planning-guide"
        },
        task: {
          type: 'open-question' as const,
          question: "Describe your approach to breaking down a large project into manageable tasks.",
        },
        xpReward: 12, // Moderate reward for open questions
      },
      {
        title: "Communication Tools Workshop",
        objective: "Get hands-on experience with modern communication platforms",
        estimatedTime: 25,
        content: {
          type: 'video' as const,
          data: "https://www.youtube.com/embed/dQw4w9WgXcQ"
        },
        task: {
          type: 'checkbox' as const,
          question: "I understand how to use the communication tools demonstrated",
          required: true,
        },
        xpReward: 8, // Lower reward for simple checkboxes
      },
      {
        title: "Portfolio Submission",
        objective: "Submit your project portfolio for review",
        estimatedTime: 30,
        content: {
          type: 'text' as const,
          data: "Please compile your work from previous stages and submit your portfolio. Include all project files, documentation, and reflection notes."
        },
        task: {
          type: 'file-upload' as const,
          question: "Upload your complete project portfolio (PDF, ZIP, or individual files)",
        },
        xpReward: 20, // Highest reward for file uploads
      }
    ];

    // Cycle through units based on stage
    const unitIndex = (viewingStage - 1) % baseUnits.length;
    return baseUnits[unitIndex];
  };

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

        {/* MicroLearning Unit */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <MicroUnit 
            unitId={`stage-${viewingStage}-unit`}
            unitData={getUnitData()}
          />
        </motion.div>

        {/* Stage Navigation */}
        <motion.div
          className="mt-12 flex justify-center space-x-4"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <Button
            onClick={handleNext}
            disabled={!canAdvance() || isLastStage || !isCurrentStageView}
            size="lg"
            className={`
              shadow-lg hover:shadow-xl transition-all duration-300 group
              ${!isCurrentStageView ? 'opacity-50 cursor-not-allowed' : ''}
              ${canEdit ? 'bg-primary hover:bg-primary-700 text-primary-foreground' : 'bg-muted text-muted-foreground'}
            `}
          >
            <span className="flex items-center space-x-2">
              <span>
                {isLastStage ? 'Journey Complete!' : 
                 !isCurrentStageView ? 'Return to Current Stage' :
                 t('nextButton')}
              </span>
              {!isLastStage && isCurrentStageView && (
                <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              )}
            </span>
          </Button>

          <Button
            onClick={handlePreview}
            disabled={!canPeekNext() || !isCurrentStageView}
            variant="outline"
            size="lg"
            className="group"
          >
            <span className="flex items-center space-x-2">
              <Eye className="h-5 w-5 group-hover:scale-110 transition-transform" />
              <span>{isPeekMode ? 'Previewing Next' : t('previewButton')}</span>
            </span>
          </Button>
        </motion.div>
      </div>
      
      {/* Stage Banner */}
      <StageBanner />
    </div>
  );
};