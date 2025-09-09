import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { MapPin, ChevronLeft } from 'lucide-react';
import { useJourneyMachine } from './journeyMachine';
import { Button } from '@/components/ui/button';

export const StageBanner = () => {
  const { t } = useTranslation();
  const { viewingStage, viewMode, currentStage, returnToCurrent } = useJourneyMachine();

  const getBannerVariant = () => {
    switch (viewMode) {
      case 'preview-back':
        return 'bg-muted/80 border-muted-foreground/20 text-muted-foreground';
      case 'peek-forward':
        return 'bg-secondary/10 border-secondary/30 text-secondary';
      default:
        return 'bg-primary/10 border-primary/30 text-primary';
    }
  };

  const getBannerText = () => {
    switch (viewMode) {
      case 'preview-back':
        return `${t('stage', { number: viewingStage })} of 8 - ${t('completed')} ✓`;
      case 'peek-forward':
        return `${t('stage', { number: viewingStage })} of 8 - Preview Mode`;
      default:
        return `You're on ${t('stage', { number: viewingStage })} of 8`;
    }
  };

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-50"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-6 pb-6">
        <motion.div
          className={`
            flex items-center justify-between p-4 rounded-lg border backdrop-blur-sm
            shadow-lg ${getBannerVariant()}
          `}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{ rotate: viewMode === 'current' ? 0 : 45 }}
              transition={{ duration: 0.3 }}
            >
              <MapPin className="h-5 w-5" />
            </motion.div>
            <span className="font-semibold">
              {getBannerText()}
            </span>
          </div>

          {/* Return to Current Button (only shown when not on current stage) */}
          {viewMode !== 'current' && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Button
                variant="outline"
                size="sm"
                onClick={returnToCurrent}
                className="bg-background/80 hover:bg-background border-current/20 hover:border-current/40"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to {t('stage', { number: currentStage })}
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};