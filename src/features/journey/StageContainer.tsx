import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight, Eye, Sparkles, AlertCircle, Lock } from 'lucide-react';
import { useJourneyMachine } from './journeyMachine';
import { StageBanner } from './StageBanner';
import { StageHeader } from './StageHeader';
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

  const getStageTitle = () => {
    if (isPreviewMode) return `${t('stage', { number: viewingStage })} - ${t('completed')} ✓`;
    if (isPeekMode) return `${t('stage', { number: viewingStage })} - Preview`;
    return t('stageTitle');
  };

  const getStageDescription = () => {
    if (isPreviewMode) return `You've already completed this stage. This is a read-only view of your previous work.`;
    if (isPeekMode) return `Here's a preview of what's coming next. Complete your current stage to unlock this content.`;
    return t('stageDescription');
  };

  return (
    <div className="min-h-screen bg-background pb-24"> {/* Add padding bottom for banner */}
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <StageHeader />

        {/* Stage Content Card */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
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

          <Card className={`
            relative overflow-hidden border-2 
            ${isPreviewMode ? 'bg-muted/20 border-muted' : ''}
            ${isPeekMode ? 'bg-secondary/5 border-secondary/20' : ''}
            ${isCurrentStageView ? 'bg-gradient-to-br from-card via-card to-primary/5 border-primary/10' : ''}
          `}>
            {/* Decorative background pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/5 to-secondary/5" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl transform translate-x-16 -translate-y-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary/10 rounded-full blur-2xl transform -translate-x-8 translate-y-8" />
            
            <CardContent className="relative p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* Content */}
                <div>
                  <motion.div
                    className="flex items-center space-x-2 mb-4"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Sparkles className="h-5 w-5 text-primary" />
                    <span className="text-primary font-semibold">Interactive Learning</span>
                  </motion.div>

                  <motion.h2
                    className="text-2xl md:text-3xl font-bold text-foreground mb-4"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    {getStageTitle()}
                  </motion.h2>

                  <motion.p
                    className="text-muted-foreground mb-6 leading-relaxed"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    {getStageDescription()}
                  </motion.p>

                  {/* Progress Stats */}
                  <motion.div
                    className="flex items-center space-x-6 mb-8"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.9 }}
                  >
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{viewingStage}</div>
                      <div className="text-sm text-muted-foreground">{isCurrentStageView ? 'Current' : 'Viewing'} Stage</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-secondary">{isCurrentStageView ? '25' : '—'}</div>
                      <div className="text-sm text-muted-foreground">{isCurrentStageView ? 'XP to Earn' : 'XP Earned'}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-journey-complete">~15</div>
                      <div className="text-sm text-muted-foreground">Minutes</div>
                    </div>
                  </motion.div>
                </div>

                {/* Action Buttons */}
                <motion.div
                  className="space-y-4"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  <Button
                    onClick={handleNext}
                    disabled={!canAdvance() || isLastStage || !isCurrentStageView}
                    size="lg"
                    className={`
                      w-full shadow-lg hover:shadow-xl transition-all duration-300 group
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
                    className="w-full group"
                  >
                    <span className="flex items-center space-x-2">
                      <Eye className="h-5 w-5 group-hover:scale-110 transition-transform" />
                      <span>{isPeekMode ? 'Previewing Next' : t('previewButton')}</span>
                    </span>
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Additional Info Cards */}
        <motion.div
          className="grid md:grid-cols-3 gap-6 mt-8"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          {['Interactive Content', 'Real Projects', 'Expert Guidance'].map((title, index) => (
            <motion.div
              key={title}
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className={`
                text-center p-6 border-primary/10 hover:border-primary/20 transition-colors
                ${isCurrentStageView ? 'bg-card/50 backdrop-blur-sm' : 'bg-muted/30'}
                ${!canEdit ? 'opacity-60' : ''}
              `}>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground">
                  Engaging learning experience designed for your success.
                </p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
      
      {/* Stage Banner */}
      <StageBanner />
    </div>
  );
};