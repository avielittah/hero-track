import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { PlayCircle, CheckCircle } from 'lucide-react';
import { useLearningStore } from '@/lib/store';

export const StageHeader = () => {
  const { t } = useTranslation();
  const { currentStage } = useLearningStore();

  return (
    <motion.div
      className="text-center py-8"
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <motion.div
        className="inline-flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full mb-4"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
      >
        <PlayCircle className="h-5 w-5 text-primary" />
        <span className="text-primary font-semibold">
          {t('stage', { number: currentStage })}
        </span>
      </motion.div>

      <motion.h1
        className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        {t('stageTitle')}
      </motion.h1>

      <motion.p
        className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        {t('stageDescription')}
      </motion.p>

      {/* Decorative elements */}
      <motion.div
        className="flex justify-center space-x-2 mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
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