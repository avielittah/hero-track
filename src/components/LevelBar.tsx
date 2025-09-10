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
      className="bg-gradient-to-r from-primary/10 to-secondary/10 px-6 py-3 border-b"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.div
              className="p-2 bg-primary rounded-lg"
              whileHover={{ rotate: 12, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isMaxLevel ? (
                <Crown className="h-5 w-5 text-primary-foreground" />
              ) : (
                <Star className="h-5 w-5 text-primary-foreground" />
              )}
            </motion.div>
            
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-muted-foreground">{t('level')}:</span>
                <span className="text-lg font-bold text-foreground">{t(level)}</span>
              </div>
              {/* Gaming-style XP Progress Bar */}
              <div className="w-64 space-y-1">
                <div className="flex justify-between items-center text-xs font-medium">
                  <span className="text-muted-foreground">
                    {isMaxLevel ? (
                      `${currentXP} ${t('xp')} - MAX LEVEL`
                    ) : (
                      `${currentXP - currentThreshold} / ${nextThreshold - currentThreshold} ${t('xp')}`
                    )}
                  </span>
                  {!isMaxLevel && (
                    <span className="text-primary font-bold">
                      {nextThreshold - currentXP} ${t('xp')} left
                    </span>
                  )}
                </div>
                
                {/* XP Progress Bar */}
                <div className="relative h-3 bg-muted rounded-full overflow-hidden shadow-inner">
                  {/* Background glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full" />
                  
                  {/* Progress fill with gradient */}
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary via-primary to-secondary rounded-full relative overflow-hidden"
                    initial={{ width: 0 }}
                    animate={{ 
                      width: isMaxLevel 
                        ? '100%' 
                        : `${((currentXP - currentThreshold) / (nextThreshold - currentThreshold)) * 100}%` 
                    }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                  >
                    {/* Animated shine effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                      animate={{ x: ['-100%', '300%'] }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 3,
                        ease: "easeInOut"
                      }}
                    />
                    
                    {/* Inner glow */}
                    <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20" />
                  </motion.div>
                  
                  {/* Progress percentage text overlay */}
                  {!isMaxLevel && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-bold text-white drop-shadow-sm">
                        {Math.round(((currentXP - currentThreshold) / (nextThreshold - currentThreshold)) * 100)}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {!isMaxLevel && (
            <motion.div 
              className="text-right"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="text-sm font-medium text-muted-foreground">Next Level</div>
              <div className="text-sm font-semibold text-primary">
                {t(['New Explorer', 'Team Rookie', 'Skilled Learner', 'Problem Solver', 'Project Builder', 'Pro Team Member'][levelIndex + 1])}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};