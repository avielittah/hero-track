import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import { Trophy, Star, Sparkles, Crown, Users, Target, User, Folder } from 'lucide-react';
import { Level } from '@/types/journey';

interface LevelUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  newLevel: Level;
  previousLevel: Level;
  currentXP: number;
}

const CONFETTI_COUNT = 50;

const ConfettiParticle = ({ delay }: { delay: number }) => {
  return (
    <motion.div
      className="absolute w-2 h-2 bg-gradient-to-r from-primary to-secondary rounded-full"
      initial={{
        opacity: 0,
        scale: 0,
        x: Math.random() * 400 - 200,
        y: Math.random() * 300 - 150,
      }}
      animate={{
        opacity: [0, 1, 1, 0],
        scale: [0, 1, 1, 0],
        y: [0, -100, -200, -300],
        x: [0, Math.random() * 100 - 50],
        rotate: [0, 360],
      }}
      transition={{
        duration: 3,
        delay,
        ease: "easeOut",
      }}
    />
  );
};

const SparkleEffect = ({ delay }: { delay: number }) => {
  return (
    <motion.div
      className="absolute"
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: [0, 1, 0], 
        scale: [0, 1, 0],
        rotate: [0, 180]
      }}
      transition={{
        duration: 1.5,
        delay,
        repeat: 3,
        repeatDelay: 0.5,
      }}
    >
      <Sparkles className="h-4 w-4 text-yellow-400" />
    </motion.div>
  );
};

export const LevelUpModal = ({
  isOpen,
  onClose,
  newLevel,
  previousLevel,
  currentXP,
}: LevelUpModalProps) => {
  const { t } = useTranslation();
  const [showConfetti, setShowConfetti] = useState(false);

  const levels: Level[] = [
    'New Explorer',
    'Team Rookie', 
    'Skilled Learner',
    'Problem Solver',
    'Project Builder',
    'Pro Team Member'
  ];

  const getLevelIcon = (level: Level) => {
    const index = levels.indexOf(level);
    switch (index) {
      case 0: return <Star className="h-5 w-5 text-yellow-500" />; // New Explorer
      case 1: return <Users className="h-5 w-5 text-blue-500" />; // Team Rookie
      case 2: return <Target className="h-5 w-5 text-green-500" />; // Skilled Learner
      case 3: return <User className="h-5 w-5 text-purple-500" />; // Problem Solver
      case 4: return <Folder className="h-5 w-5 text-orange-500" />; // Project Builder
      case 5: return <Crown className="h-5 w-5 text-red-500" />; // Pro Team Member
      default: return <Star className="h-5 w-5" />;
    }
  };

  const getLevelColor = (level: Level) => {
    const index = levels.indexOf(level);
    const colors = [
      'text-slate-600',
      'text-blue-600', 
      'text-green-600',
      'text-purple-600',
      'text-orange-600',
      'text-yellow-600'
    ];
    return colors[index] || 'text-gray-600';
  };

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md relative overflow-hidden">
        {/* Confetti Effect */}
        <AnimatePresence>
          {showConfetti && (
            <div className="absolute inset-0 pointer-events-none z-10">
              {Array.from({ length: CONFETTI_COUNT }).map((_, i) => (
                <ConfettiParticle key={i} delay={i * 0.1} />
              ))}
              {Array.from({ length: 10 }).map((_, i) => (
                <SparkleEffect key={i} delay={i * 0.3} />
              ))}
            </div>
          )}
        </AnimatePresence>

        <DialogHeader className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
            className="mx-auto w-20 h-20 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: 3, delay: 0.5 }}
              className="text-white"
            >
              {getLevelIcon(newLevel)}
            </motion.div>
          </motion.div>

          <DialogTitle className="text-3xl font-black text-foreground tracking-tight">
            Level Up! 🎉
          </DialogTitle>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-2"
          >
            <p className="text-xl font-light text-muted-foreground">
              You're now a
            </p>
            <h2 className={`text-3xl font-black tracking-tight ${getLevelColor(newLevel)}`}>
              {t(newLevel)}
            </h2>
            <p className="text-sm text-muted-foreground">
              Current XP: {currentXP}
            </p>
          </motion.div>
        </DialogHeader>

        {/* Level Ladder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-4"
        >
          <h3 className="text-sm font-semibold text-muted-foreground text-center">
            Your Progress
          </h3>
          
          <Card className="p-4 bg-gradient-to-r from-primary/5 to-secondary/5">
            <div className="space-y-3">
              {levels.map((level, index) => {
                const isCurrent = level === newLevel;
                const isPrevious = level === previousLevel;
                const isCompleted = levels.indexOf(level) < levels.indexOf(newLevel);
                
                return (
                  <motion.div
                    key={level}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className={`
                      flex items-center space-x-3 p-2 rounded-lg transition-all
                      ${isCurrent ? 'bg-primary/10 border-l-4 border-primary' : ''}
                      ${isPrevious ? 'bg-muted/50' : ''}
                    `}
                  >
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center
                      ${isCurrent ? 'bg-primary text-primary-foreground' : ''}
                      ${isCompleted ? 'bg-green-500 text-white' : ''}
                      ${!isCurrent && !isCompleted ? 'bg-muted text-muted-foreground' : ''}
                    `}>
                      {isCurrent ? (
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.5, repeat: 2 }}
                        >
                          {getLevelIcon(level)}
                        </motion.div>
                      ) : isCompleted ? (
                        '✓'
                      ) : (
                        index + 1
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <p className={`
                        text-sm font-medium
                        ${isCurrent ? 'text-primary' : ''}
                        ${isCompleted ? 'text-green-600' : ''}
                        ${!isCurrent && !isCompleted ? 'text-muted-foreground' : ''}
                      `}>
                        {t(level)}
                      </p>
                    </div>
                    
                    {isCurrent && (
                      <Badge variant="secondary" className="bg-primary/20 text-primary">
                        Current
                      </Badge>
                    )}
                    {isPrevious && (
                      <Badge variant="outline" className="text-muted-foreground">
                        Previous
                      </Badge>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </Card>
        </motion.div>

        {/* Close Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="flex justify-center pt-4"
        >
          <Button 
            onClick={onClose}
            className="bg-primary hover:bg-primary-700 text-primary-foreground"
          >
            Continue Learning
          </Button>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};