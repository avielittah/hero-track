import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Crown, Star, Trophy, Zap, Target, Book, Award, Shield, Gem } from 'lucide-react';
import { useLearningStore } from '@/lib/store';
import { XPThresholds } from '@/types/journey';
import { Badge } from '@/components/ui/badge';

export const LevelBar = () => {
  const { t } = useTranslation();
  const { level, currentXP, trophies, mluTrophies, getTotalTrophyCount, checkForMedals } = useLearningStore();

  const levelIndex = ['New Explorer', 'Team Rookie', 'Skilled Learner', 'Problem Solver', 'Project Builder', 'Pro Team Member'].indexOf(level);
  const currentThreshold = XPThresholds[levelIndex] || 0;
  const nextThreshold = XPThresholds[levelIndex + 1] || XPThresholds[XPThresholds.length - 1];
  const isMaxLevel = levelIndex === 5;
  const totalTrophies = getTotalTrophyCount();
  const { newMedal } = checkForMedals();

  // Determine skill levels based on progress
  const skills = [
    { name: 'Learning', level: Math.min(Math.floor(currentXP / 50) + 1, 10), icon: Book },
    { name: 'Problem Solving', level: Math.min(Math.floor(trophies.length * 2) + 1, 10), icon: Target },
    { name: 'Technical', level: Math.min(Math.floor(mluTrophies.length) + 1, 10), icon: Zap },
  ];

  const getMedalIcon = () => {
    if (totalTrophies >= 100) return '💎';
    if (totalTrophies >= 50) return '🏆';
    if (totalTrophies >= 20) return '🥇';
    if (totalTrophies >= 10) return '🥈';
    if (totalTrophies >= 5) return '🥉';
    return null;
  };

  return (
    <motion.div 
      className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-background/95 via-primary/5 to-secondary/5 backdrop-blur-md border-t border-primary/20 shadow-2xl z-40"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 100 }}
    >
      {/* Ambient lighting effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/3 via-secondary/3 to-primary/3 pointer-events-none" />
      
      <div className="relative px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between gap-4">
            
            {/* Player Level & Avatar */}
            <div className="flex items-center gap-3">
              <motion.div
                className="relative"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Level Border */}
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary via-primary-700 to-primary p-0.5 shadow-lg">
                  <div className="w-full h-full rounded-xl bg-gradient-to-br from-card to-muted flex flex-col items-center justify-center relative overflow-hidden">
                    {/* Background glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl" />
                    
                    {/* Level number */}
                    <motion.span 
                      className="text-lg font-bold text-primary relative z-10"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
                    >
                      {levelIndex + 1}
                    </motion.span>
                    
                    {/* Icon */}
                    <div className="relative z-10">
                      {isMaxLevel ? (
                        <Crown className="h-4 w-4 text-primary" />
                      ) : (
                        <Star className="h-4 w-4 text-primary" />
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Rank badge */}
                <div className="absolute -top-1 -right-1 bg-gradient-to-r from-secondary to-secondary/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-lg">
                  {isMaxLevel ? 'MAX' : `L${levelIndex + 1}`}
                </div>
              </motion.div>

              {/* Player Info */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-foreground">{level}</span>
                  {getMedalIcon() && (
                    <Badge variant="secondary" className="h-5 px-2 text-xs bg-secondary/20 text-secondary border-secondary/30">
                      {getMedalIcon()}
                    </Badge>
                  )}
                </div>
                
                {/* XP Progress Bar */}
                <div className="flex items-center gap-2">
                  <div className="relative w-32 h-2 bg-muted rounded-full overflow-hidden shadow-inner">
                    {/* Background glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full" />
                    
                    {/* Progress fill */}
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary via-primary-700 to-secondary rounded-full relative shadow-sm"
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
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-12"
                        animate={{ x: ['-100%', '200%'] }}
                        transition={{ 
                          duration: 3,
                          repeat: Infinity,
                          repeatDelay: 4,
                          ease: "easeInOut"
                        }}
                      />
                    </motion.div>
                  </div>
                  
                  <span className="text-xs font-bold text-primary min-w-max">
                    {isMaxLevel ? (
                      `${currentXP} XP`
                    ) : (
                      `${currentXP - currentThreshold}/${nextThreshold - currentThreshold}`
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Skills Section */}
            <div className="hidden md:flex items-center gap-4">
              <div className="text-xs text-muted-foreground font-medium">SKILLS</div>
              <div className="flex gap-3">
                {skills.map((skill, index) => (
                  <motion.div
                    key={skill.name}
                    className="flex flex-col items-center gap-1"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center gap-1">
                      <skill.icon className="h-3 w-3 text-journey-complete" />
                      <span className="text-[10px] text-muted-foreground font-medium">{skill.name}</span>
                    </div>
                    <div className="flex gap-px">
                      {[...Array(10)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-1 h-2 rounded-full ${
                            i < skill.level 
                              ? 'bg-gradient-to-t from-journey-complete to-journey-complete/80' 
                              : 'bg-muted'
                          }`}
                        />
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Trophy Collection */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-xs text-muted-foreground font-medium">ACHIEVEMENTS</div>
              
              <div className="flex items-center gap-3">
                {/* Trophy Count */}
                <motion.div
                  className="flex items-center gap-2 bg-gradient-to-r from-secondary/20 to-secondary/30 border border-secondary/30 rounded-lg px-3 py-1.5"
                  whileHover={{ scale: 1.05 }}
                >
                  <Trophy className="h-4 w-4 text-secondary" />
                  <span className="text-sm font-bold text-secondary">{totalTrophies}</span>
                  
                  {/* Medal indicator */}
                  {getMedalIcon() && (
                    <div className="ml-1 text-sm">{getMedalIcon()}</div>
                  )}
                </motion.div>

                {/* Recent trophies preview */}
                <div className="hidden lg:flex gap-1">
                  {mluTrophies.slice(-3).map((trophy, index) => (
                    <motion.div
                      key={trophy.id}
                      className="w-6 h-6 bg-gradient-to-br from-secondary to-secondary/80 rounded-md flex items-center justify-center shadow-lg"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      title={trophy.unitName}
                    >
                      <Trophy className="h-3 w-3 text-white" />
                    </motion.div>
                  ))}
                  {mluTrophies.length > 3 && (
                    <div className="w-6 h-6 bg-muted rounded-md flex items-center justify-center text-[10px] text-muted-foreground font-bold">
                      +{mluTrophies.length - 3}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Next Level Info - Desktop */}
            {!isMaxLevel && (
              <motion.div 
                className="hidden lg:block text-right"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">NEXT RANK</div>
                <div className="text-xs font-bold text-foreground">
                  {['Team Rookie', 'Skilled Learner', 'Problem Solver', 'Project Builder', 'Pro Team Member'][levelIndex]}
                </div>
                <div className="text-[10px] text-primary font-medium">
                  {nextThreshold - currentXP} XP to go
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};