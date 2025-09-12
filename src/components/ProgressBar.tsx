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
      className="bg-gradient-to-r from-card/80 to-card/60 backdrop-blur-sm border-b border-border/50 px-3 py-2"
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="relative">
          {/* Gaming-style progress track */}
          <div className="relative h-2 bg-gradient-to-r from-muted/30 to-muted/60 rounded-full overflow-hidden mb-6">
            {/* Animated progress fill */}
            <motion.div
              className="h-full bg-gradient-to-r from-primary via-primary/80 to-primary rounded-full relative overflow-hidden"
              style={{ width: `${((currentStage - 1) / (stages.length - 1)) * 100}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${((currentStage - 1) / (stages.length - 1)) * 100}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            >
              {/* Glowing effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
            </motion.div>
            
            {/* Subtle inner glow */}
            <div className="absolute inset-0 rounded-full shadow-inner" />
          </div>

          {/* Gaming-style stage nodes */}
          <div className="absolute -top-2 left-0 right-0 flex justify-between">
            {stages.map((stageId, index) => {
              const status = getStageStatus(stageId);
              const isClickableStage = isClickable(stageId);
              
              return (
                <motion.div
                  key={stageId}
                  className={`relative group ${isClickableStage ? 'cursor-pointer' : 'cursor-default'} flex flex-col items-center`}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: index * 0.05,
                    type: "spring",
                    stiffness: 150
                  }}
                  onClick={() => handleStageClick(stageId)}
                  whileHover={isClickableStage ? { scale: 1.05 } : {}}
                >
                  {/* Gaming-style node */}
                  <div className={`
                    w-6 h-6 rounded-full border-2 flex items-center justify-center
                    transition-all duration-300 relative overflow-hidden
                    ${status === 'completed' ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 border-emerald-400 shadow-lg shadow-emerald-400/30' : ''}
                    ${status === 'current' ? 'bg-gradient-to-br from-primary to-primary/80 border-primary shadow-lg shadow-primary/40' : ''}
                    ${status === 'peeking' ? 'bg-gradient-to-br from-secondary to-secondary/80 border-secondary shadow-md shadow-secondary/30' : ''}
                    ${status === 'upcoming' ? 'bg-gradient-to-br from-muted to-muted/60 border-muted-foreground/30' : ''}
                    ${stageId === viewingStage ? 'ring-2 ring-primary/60 ring-offset-1' : ''}
                  `}>
                    {/* Gaming icon */}
                    <div className="relative z-10">
                      {status === 'completed' && <CheckCircle className="h-3 w-3 text-white" />}
                      {status === 'current' && <Circle className="h-3 w-3 text-white fill-current" />}
                      {status === 'peeking' && <Eye className="h-3 w-3 text-white" />}
                      {status === 'upcoming' && <Lock className="h-3 w-3 text-muted-foreground" />}
                    </div>
                    
                    {/* Subtle inner glow for active states */}
                    {(status === 'current' || status === 'completed') && (
                      <div className="absolute inset-0 bg-white/10 rounded-full" />
                    )}
                  </div>

                  {/* Stage label */}
                  <div className="mt-2 text-center">
                    <div className={`text-xs font-medium transition-colors duration-300 ${getStageColor(stageId)}`}>
                      {t('stage', { number: stageId })}
                    </div>
                    {status === 'current' && (
                      <motion.div
                        className="text-[10px] text-primary font-medium mt-0.5"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        {t('current')}
                      </motion.div>
                    )}
                  </div>

                  {/* Pulsing effect for current stage */}
                  {status === 'current' && (
                    <motion.div
                      className="absolute top-0 inset-x-0 h-6 rounded-full bg-primary/30 -z-10"
                      animate={{ 
                        scale: [1, 1.4, 1],
                        opacity: [0.3, 0.6, 0.3]
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