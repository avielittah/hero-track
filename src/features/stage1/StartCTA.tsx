import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Sparkles, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useLearningStore } from '@/lib/store';
import { useJourneyMachine } from '@/features/journey/journeyMachine';
import { welcomeContent } from './welcome.content';

export const StartCTA = () => {
  const { toast } = useToast();
  const { addXP, awardTrophy } = useLearningStore();
  const { completeCurrentStage } = useJourneyMachine();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleStart = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      // Award XP for starting the journey
      const xpResult = await addXP(welcomeContent.xpOnStart);
      
      // Award badge if configured
      if (welcomeContent.badgeOnStart) {
        awardTrophy(1); // Stage 1 trophy
      }
      
      // Show success toast
      toast({
        title: welcomeContent.cta.xpToast,
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
          className="text-muted-foreground text-xl font-light leading-relaxed"
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
              w-full h-16 text-xl font-bold
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
                  <span>{welcomeContent.cta.label}</span>
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
          <span>+{welcomeContent.xpOnStart} XP for getting started</span>
          {welcomeContent.badgeOnStart && (
            <>
              <span>•</span>
              <Trophy className="h-4 w-4 text-primary" />
              <span>"{welcomeContent.badgeOnStart}" badge</span>
            </>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};