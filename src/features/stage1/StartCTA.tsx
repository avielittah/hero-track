import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ChevronRight, Sparkles, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useLearningStore } from '@/lib/store';
import { useJourneyMachine } from '@/features/journey/journeyMachine';
import { WelcomeContent } from './content.welcome.schema';

interface StartCTAProps {
  content: WelcomeContent;
}

export const StartCTA = ({ content }: StartCTAProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { addXP, awardTrophy } = useLearningStore();
  const { completeCurrentStage } = useJourneyMachine();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleStart = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      // Award XP for starting the journey
      const xpResult = await addXP(content.xpAwardOnContinue);
      
      // Award badge if configured
      if (content.badgeOnContinue) {
        awardTrophy(1); // Stage 1 trophy
      }
      
      // Show success toast
      toast({
        title: t('stage1:cta.toast', { xp: content.xpAwardOnContinue }),
        description: xpResult.leveledUp ? 
          `🎉 Level up! You're now a ${xpResult.newLevel}!` : 
          "Your learning journey has begun!",
      });
      
      // Complete current stage and advance
      setTimeout(() => {
        completeCurrentStage();
        setIsProcessing(false);
      }, 1000);
      
    } catch (error) {
      console.error('Error starting journey:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to start journey. Please try again.",
      });
      setIsProcessing(false);
    }
  };

  return (
    <motion.div
      className="text-center"
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 1.2 }}
    >
      <div className="max-w-md mx-auto space-y-6">
        {/* Encouragement text */}
        <motion.p
          className="text-muted-foreground text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
        >
          Ready to embark on your learning adventure?
        </motion.p>

        {/* Main CTA Button */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Button
            onClick={handleStart}
            disabled={isProcessing}
            size="lg"
            className="
              w-full h-14 text-lg font-semibold
              bg-gradient-to-r from-primary to-secondary
              hover:from-primary-700 hover:to-secondary
              text-white shadow-lg hover:shadow-xl
              transition-all duration-300 group
              relative overflow-hidden
            "
          >
            <span className="relative z-10 flex items-center justify-center space-x-3">
              {isProcessing ? (
                <>
                  <Sparkles className="h-5 w-5 animate-spin" />
                  <span>Starting your journey...</span>
                </>
              ) : (
                <>
                  <Trophy className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  <span>{content.ctaLabel}</span>
                  <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </span>
            
            {/* Animated background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                repeatDelay: 3,
                ease: "linear" 
              }}
            />
          </Button>
        </motion.div>

        {/* XP Preview */}
        <motion.div
          className="flex items-center justify-center space-x-2 text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
        >
          <Sparkles className="h-4 w-4 text-secondary" />
          <span>+{content.xpAwardOnContinue} XP for getting started</span>
          {content.badgeOnContinue && (
            <>
              <span>•</span>
              <Trophy className="h-4 w-4 text-primary" />
              <span>"{content.badgeOnContinue}" badge</span>
            </>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};