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
      className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-md border-t border-amber-500/30 shadow-2xl z-40"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 100 }}
    >
      {/* Ambient lighting effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-amber-500/5 to-primary/5 pointer-events-none" />
      
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
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 p-0.5 shadow-lg">
                  <div className="w-full h-full rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 flex flex-col items-center justify-center relative overflow-hidden">
                    {/* Background glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-primary/20 rounded-xl" />
                    
                    {/* Level number */}
                    <motion.span 
                      className="text-lg font-bold text-amber-400 relative z-10"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
                    >
                      {levelIndex + 1}
                    </motion.span>
                    
                    {/* Icon */}
                    <div className="relative z-10">
                      {isMaxLevel ? (
                        <Crown className="h-4 w-4 text-amber-400" />
                      ) : (
                        <Star className="h-4 w-4 text-amber-400" />
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Rank badge */}
                <div className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-lg">
                  {isMaxLevel ? 'MAX' : `L${levelIndex + 1}`}
                </div>
              </motion.div>

              {/* Player Info */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">{level}</span>
                  {getMedalIcon() && (
                    <Badge variant="secondary" className="h-5 px-2 text-xs bg-amber-500/20 text-amber-400 border-amber-500/30">
                      {getMedalIcon()}
                    </Badge>
                  )}
                </div>
                
                {/* XP Progress Bar */}
                <div className="flex items-center gap-2">
                  <div className="relative w-32 h-2 bg-slate-700 rounded-full overflow-hidden shadow-inner">
                    {/* Background glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full" />
                    
                    {/* Progress fill */}
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 rounded-full relative shadow-sm"
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
                  
                  <span className="text-xs font-bold text-cyan-400 min-w-max">
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
              <div className="text-xs text-slate-400 font-medium">SKILLS</div>
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
                      <skill.icon className="h-3 w-3 text-emerald-400" />
                      <span className="text-[10px] text-slate-300 font-medium">{skill.name}</span>
                    </div>
                    <div className="flex gap-px">
                      {[...Array(10)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-1 h-2 rounded-full ${
                            i < skill.level 
                              ? 'bg-gradient-to-t from-emerald-600 to-emerald-400' 
                              : 'bg-slate-600'
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
              <div className="hidden sm:block text-xs text-slate-400 font-medium">ACHIEVEMENTS</div>
              
              <div className="flex items-center gap-3">
                {/* Trophy Count */}
                <motion.div
                  className="flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-lg px-3 py-1.5"
                  whileHover={{ scale: 1.05 }}
                >
                  <Trophy className="h-4 w-4 text-amber-400" />
                  <span className="text-sm font-bold text-amber-400">{totalTrophies}</span>
                  
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
                      className="w-6 h-6 bg-gradient-to-br from-amber-400 to-amber-600 rounded-md flex items-center justify-center shadow-lg"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      title={trophy.unitName}
                    >
                      <Trophy className="h-3 w-3 text-white" />
                    </motion.div>
                  ))}
                  {mluTrophies.length > 3 && (
                    <div className="w-6 h-6 bg-slate-700 rounded-md flex items-center justify-center text-[10px] text-slate-400 font-bold">
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
                <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">NEXT RANK</div>
                <div className="text-xs font-bold text-white">
                  {['Team Rookie', 'Skilled Learner', 'Problem Solver', 'Project Builder', 'Pro Team Member'][levelIndex]}
                </div>
                <div className="text-[10px] text-cyan-400 font-medium">
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