import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Crown, Star } from 'lucide-react';
import { useLearningStore } from '@/lib/store';
import { XPThresholds } from '@/types/journey';

export const LevelBar = () => {
  const { t } = useTranslation();
  const { level, currentXP } = useLearningStore();

  const levelIndex = ['New Explorer', 'Team Rookie', 'Skilled Learner', 'Problem Solver', 'Project Builder', 'Pro Team Member'].indexOf(level);
  const currentThreshold = XPThresholds[levelIndex] || 0;
  const nextThreshold = XPThresholds[levelIndex + 1] || XPThresholds[XPThresholds.length - 1];
  const isMaxLevel = levelIndex === 5;

  return (
    <motion.div 
      className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-background/95 via-primary/5 to-secondary/5 backdrop-blur-md border-t border-primary/20 shadow-lg z-40 px-4 py-2"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 100 }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between max-w-full">
          <div className="flex items-center space-x-2 min-w-0 flex-1">
            <motion.div
              className="p-1.5 bg-primary rounded-md shadow-sm"
              whileHover={{ rotate: 12, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isMaxLevel ? (
                <Crown className="h-4 w-4 text-primary-foreground" />
              ) : (
                <Star className="h-4 w-4 text-primary-foreground" />
              )}
            </motion.div>
            
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-1">
                <span className="text-xs font-medium text-muted-foreground truncate">{t(level)}</span>
              </div>
              
              {/* Compact Gaming XP Bar */}
              <div className="flex items-center space-x-2 mt-0.5">
                <div className="relative h-2 bg-muted rounded-full overflow-hidden shadow-inner flex-1 max-w-48">
                  {/* Background glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full" />
                  
                  {/* Progress fill */}
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full relative"
                    initial={{ width: 0 }}
                    animate={{ 
                      width: isMaxLevel 
                        ? '100%' 
                        : `${((currentXP - currentThreshold) / (nextThreshold - currentThreshold)) * 100}%` 
                    }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                  >
                    {/* Shine effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 4,
                        ease: "easeInOut"
                      }}
                    />
                  </motion.div>
                </div>
                
                <div className="text-xs font-bold text-primary min-w-max">
                  {isMaxLevel ? (
                    `${currentXP} XP`
                  ) : (
                    `${currentXP - currentThreshold}/${nextThreshold - currentThreshold}`
                  )}
                </div>
              </div>
            </div>
          </div>

          {!isMaxLevel && (
            <motion.div 
              className="text-right ml-2 hidden sm:block"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="text-xs font-medium text-muted-foreground">Next</div>
              <div className="text-xs font-semibold text-primary truncate max-w-20">
                {t(['New Explorer', 'Team Rookie', 'Skilled Learner', 'Problem Solver', 'Project Builder', 'Pro Team Member'][levelIndex + 1])?.split(' ')[0]}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};