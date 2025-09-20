import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Star, Sparkles, Trophy, ArrowRight } from 'lucide-react';
import { StageId } from '@/types/journey';

interface StageCompleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
  stageNumber: StageId;
  totalXP: number;
  completedUnits: string[];
  newTrophies?: string[];
}

const CONFETTI_COUNT = 30;

const ConfettiParticle = ({ delay }: { delay: number }) => {
  return (
    <motion.div
      className="absolute w-2 h-2 bg-gradient-to-r from-primary to-secondary rounded-full"
      initial={{
        opacity: 0,
        scale: 0,
        x: Math.random() * 300 - 150,
        y: Math.random() * 200 - 100,
      }}
      animate={{
        opacity: [0, 1, 1, 0],
        scale: [0, 1, 1, 0],
        y: [0, -80, -160, -240],
        x: [0, Math.random() * 80 - 40],
        rotate: [0, 360],
      }}
      transition={{
        duration: 2.5,
        delay,
        ease: "easeOut",
      }}
    />
  );
};

export const StageCompleteModal = ({
  isOpen,
  onClose,
  onContinue,
  stageNumber,
  totalXP,
  completedUnits,
  newTrophies = [],
}: StageCompleteModalProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [showConfetti, setShowConfetti] = useState(false);

  const getStageAchievement = (stage: StageId): { title: string; description: string } => {
    return {
      title: t(`copy:stageAchievement${stage}Title`),
      description: t(`copy:stageAchievement${stage}Description`)
    };
  };

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      
      // Show buddy nudge toast after stage completion
      setTimeout(() => {
        toast({
          title: t('copy:toastAmazingWork'),
          description: t('copy:toastStageCompleteDescription'),
          duration: 6000,
        });
        
        // Trigger custom event for buddy nudge
        window.dispatchEvent(new CustomEvent('stageCompleted'));
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, toast]);

  const achievement = getStageAchievement(stageNumber);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg relative overflow-hidden">
        {/* Confetti Effect */}
        <AnimatePresence>
          {showConfetti && (
            <div className="absolute inset-0 pointer-events-none z-10">
              {Array.from({ length: CONFETTI_COUNT }).map((_, i) => (
                <ConfettiParticle key={i} delay={i * 0.1} />
              ))}
            </div>
          )}
        </AnimatePresence>

        <DialogHeader className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
            className="mx-auto w-16 h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5, repeat: 2, delay: 0.5 }}
              className="text-white"
            >
              <CheckCircle className="h-8 w-8" />
            </motion.div>
          </motion.div>

          <DialogTitle className="text-3xl font-black text-foreground tracking-tight">
            {achievement.title}
          </DialogTitle>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-muted-foreground"
          >
            {achievement.description}
          </motion.p>
        </DialogHeader>

        {/* What You Learned */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-4"
        >
          <Card className="p-4 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
            <h3 className="font-semibold text-foreground mb-3 flex items-center space-x-2">
              <Star className="h-4 w-4 text-primary" />
              <span>{t('ui:whatYouAccomplished')}</span>
            </h3>
            
            <div className="space-y-2">
              {completedUnits.map((unit, index) => (
                <motion.div
                  key={unit}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center space-x-2 text-sm"
                >
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span>{unit}</span>
                </motion.div>
              ))}
            </div>
          </Card>

          {/* XP and Trophies */}
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
              className="flex items-center space-x-2"
            >
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{t('ui:xpEarned')}</p>
                <p className="text-lg font-bold text-primary">+{totalXP}</p>
              </div>
            </motion.div>

            {newTrophies.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 }}
                className="flex items-center space-x-2"
              >
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{t('ui:newTrophy')}</p>
                  <p className="text-sm text-yellow-600 font-semibold">{newTrophies[0]}</p>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex justify-center pt-4"
        >
          <Button 
            onClick={onContinue}
            className="bg-primary hover:bg-primary-700 text-primary-foreground group"
          >
            <span className="flex items-center space-x-2">
              <span>{t('ui:continueYourJourney')}</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </Button>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};