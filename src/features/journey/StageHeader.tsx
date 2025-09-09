import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { BookOpen, Target, Sparkles } from 'lucide-react';
import { useJourneyMachine } from './journeyMachine';

export const StageHeader = () => {
  const { t } = useTranslation();
  const { currentStage, viewingStage, viewMode } = useJourneyMachine();

  const getStageContent = (stage: number) => {
    return {
      title: t(`copy:stageHeader${stage}Title`),
      subtitle: t(`copy:stageHeader${stage}Subtitle`),
      description: t(`copy:stageHeader${stage}Description`)
    };
  };

  const stageContent = getStageContent(viewingStage);
  const isPreviewMode = viewMode === 'preview-back';
  const isPeekMode = viewMode === 'peek-forward';

  return (
    <motion.div
      className="text-center py-12"
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Stage Badge */}
      <motion.div
        className="inline-flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full mb-6"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
      >
        <BookOpen className="h-5 w-5 text-primary" />
        <span className="text-primary font-semibold">
          {t('ui:stage', { number: viewingStage })} {t('ui:of')} 8
        </span>
        {isPreviewMode && (
          <span className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground">
            {t('ui:completed')} ✓
          </span>
        )}
        {isPeekMode && (
          <span className="text-xs bg-secondary/20 px-2 py-1 rounded text-secondary">
            {t('ui:preview')}
          </span>
        )}
      </motion.div>

      {/* Main Title */}
      <motion.h1
        className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        {stageContent.title}
      </motion.h1>

      {/* Subtitle */}
      <motion.h2
        className="text-xl md:text-2xl text-primary font-medium mb-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        {stageContent.subtitle}
      </motion.h2>

      {/* Description */}
      <motion.p
        className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        {stageContent.description}
      </motion.p>

      {/* Decorative elements */}
      <motion.div
        className="flex justify-center space-x-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-primary/40 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};