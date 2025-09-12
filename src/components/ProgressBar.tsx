import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, Lock, Eye } from 'lucide-react';
import { useJourneyMachine } from '@/features/journey/journeyMachine';
import { StageId } from '@/types/journey';

export const ProgressBar = () => {
  const { t } = useTranslation();
  const { currentStage, viewingStage, viewMode, completedStages, canPreviewBack, canPeekNext, previewStage, goToStage } = useJourneyMachine();

  const stages: StageId[] = [1, 2, 3, 4, 5, 6, 7, 8];

  const getStageStatus = (stageId: StageId) => {
    if (completedStages.has(stageId)) return 'completed';
    if (stageId === currentStage) return 'current';
    if (stageId === viewingStage && viewMode === 'peek-forward') return 'peeking';
    return 'upcoming';
  };

  const getStageIcon = (stageId: StageId) => {
    const status = getStageStatus(stageId);
    
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-journey-complete" />;
      case 'current':
        return <Circle className="h-5 w-5 text-journey-current fill-current" />;
      case 'peeking':
        return <Eye className="h-5 w-5 text-secondary" />;
      default:
        return <Lock className="h-5 w-5 text-journey-upcoming" />;
    }
  };

  const getStageColor = (stageId: StageId) => {
    const status = getStageStatus(stageId);
    
    switch (status) {
      case 'completed':
        return 'text-journey-complete';
      case 'current':
        return 'text-journey-current font-semibold';
      case 'peeking':
        return 'text-secondary font-medium';
      default:
        return 'text-journey-upcoming';
    }
  };

  const handleStageClick = (stageId: StageId) => {
    if (canPreviewBack(stageId)) {
      previewStage(stageId);
    } else if (stageId === currentStage + 1 && canPeekNext()) {
      previewStage(stageId);
    } else if (stageId === currentStage) {
      goToStage(stageId);
    }
  };

  const isClickable = (stageId: StageId) => {
    return canPreviewBack(stageId) || 
           (stageId === currentStage + 1 && canPeekNext()) ||
           stageId === currentStage;
  };

  return (
    <motion.div 
      className="bg-card border-b px-4 py-2"
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-base font-medium text-foreground mb-3">{t('journeyProgress')}</h2>
        
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute top-6 left-6 right-6 h-0.5 bg-journey-bg">
            <motion.div
              className="h-full bg-gradient-to-r from-journey-complete to-journey-current"
              style={{ width: `${((currentStage - 1) / (stages.length - 1)) * 100}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${((currentStage - 1) / (stages.length - 1)) * 100}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </div>

          {/* Stage Indicators */}
          <div className="flex justify-between items-center">
            {stages.map((stageId, index) => {
              const status = getStageStatus(stageId);
              
              return (
                <motion.div
                  key={stageId}
                  className={`flex flex-col items-center space-y-2 z-10 relative ${isClickable(stageId) ? 'cursor-pointer' : 'cursor-default'}`}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: index * 0.1 + 0.2,
                    type: "spring",
                    stiffness: 100
                  }}
                  onClick={() => handleStageClick(stageId)}
                  whileHover={isClickable(stageId) ? { scale: 1.1 } : {}}
                >
                  {/* Stage Circle */}
                  <div className={`
                    w-12 h-12 rounded-full border-2 flex items-center justify-center
                    ${status === 'completed' ? 'bg-journey-complete border-journey-complete' : ''}
                    ${status === 'current' ? 'bg-journey-current border-journey-current shadow-lg' : ''}
                    ${status === 'peeking' ? 'bg-secondary border-secondary shadow-md' : ''}
                    ${status === 'upcoming' ? 'bg-card border-journey-upcoming' : ''}
                    ${stageId === viewingStage ? 'ring-2 ring-offset-2 ring-primary/50' : ''}
                    transition-all duration-300
                  `}>
                    {getStageIcon(stageId)}
                  </div>

                  {/* Stage Label */}
                  <div className="text-center">
                    <div className={`text-sm ${getStageColor(stageId)} transition-colors duration-300`}>
                      {t('stage', { number: stageId })}
                    </div>
                    {status === 'current' && (
                      <motion.div
                        className="text-xs text-journey-current font-medium mt-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        {t('current')}
                      </motion.div>
                    )}
                  </div>

                  {/* Current Stage Glow Effect */}
                  {status === 'current' && (
                    <motion.div
                      className="absolute inset-0 rounded-full bg-journey-current/20 blur-lg -z-10"
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0.8, 0.5]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};