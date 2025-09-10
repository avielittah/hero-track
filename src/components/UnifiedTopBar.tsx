import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ProfileSheet } from './ProfileSheet';
import { ReportIssueModal } from './ReportIssueModal';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe, LogIn, LogOut, User, MoreVertical, HelpCircle, Bug, Crown, Star, Trophy } from 'lucide-react';
import { useLearningStore } from '@/lib/store';
import { XPThresholds } from '@/types/journey';

interface UnifiedTopBarProps {
  currentLanguage: string;
  onLanguageToggle: () => void;
}

export const UnifiedTopBar = ({ currentLanguage, onLanguageToggle }: UnifiedTopBarProps) => {
  const { t } = useTranslation();
  const [showProfileSheet, setShowProfileSheet] = useState(false);
  const [showReportIssueModal, setShowReportIssueModal] = useState(false);
  const { 
    isLoggedIn, 
    username, 
    level, 
    currentXP, 
    login, 
    logout, 
    getXPProgressInCurrentLevel,
    getCurrentLevelIndex,
    trophies 
  } = useLearningStore();

  const handleAuthClick = () => {
    if (isLoggedIn) {
      logout();
    } else {
      login('Demo User');
    }
  };

  // Calculate XP progress and level info
  const xpProgress = getXPProgressInCurrentLevel();
  const { current: progressInLevel, max: levelRange, percentage: progressPercentage } = xpProgress;
  const levelIndex = getCurrentLevelIndex();
  const isMaxLevel = levelIndex === 5;
  const nextThreshold = XPThresholds[levelIndex + 1] || XPThresholds[XPThresholds.length - 1];
  
  const levels = ['New Explorer', 'Team Rookie', 'Skilled Learner', 'Problem Solver', 'Project Builder', 'Pro Team Member'];
  const nextLevel = levels[levelIndex + 1];

  return (
    <motion.div 
      className="bg-gradient-to-r from-card via-card/95 to-card border-b shadow-sm"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Left side - Avatar and User Info */}
          <div className="flex items-center space-x-4">
            <ProfileSheet 
              isOpen={showProfileSheet}
              onOpenChange={setShowProfileSheet}
              trigger={
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowProfileSheet(true)}
                  className="focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-full"
                >
                  <Avatar className="h-12 w-12 ring-2 ring-primary/20 hover:ring-primary/40 transition-all cursor-pointer">
                    <AvatarImage src="" alt={username || 'Learner'} />
                    <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                      <User className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                </motion.button>
              }
            />
            
            {isLoggedIn && (
              <div className="flex flex-col">
                <span className="font-medium text-foreground">{username}</span>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="flex items-center space-x-2">
                    {isMaxLevel ? (
                      <Crown className="h-4 w-4 text-yellow-500" />
                    ) : (
                      <Star className="h-4 w-4 text-blue-500" />
                    )}
                    <span className="font-semibold text-primary">{t(`ui:${level}`)}</span>
                  </div>
                  {trophies.length > 0 && (
                    <div className="flex items-center space-x-1">
                      <Trophy className="h-3 w-3 text-yellow-500" />
                      <span className="text-xs text-yellow-600 font-medium">{trophies.length}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Center - XP Progress (visible when logged in) */}
          {isLoggedIn && (
            <motion.div 
              className="flex-1 max-w-lg mx-8"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="space-y-2">
                {/* Level Progress Info */}
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-muted-foreground">
                    {currentXP} {t('ui:xp')} Total
                  </span>
                  {!isMaxLevel && (
                    <span className="font-medium text-muted-foreground">
                      {progressInLevel} / {levelRange} {t('ui:xp')} to {nextLevel}
                    </span>
                  )}
                </div>
                
                {/* XP Progress Bar */}
                <div className="relative">
                  <div className="h-4 bg-secondary/30 rounded-full overflow-hidden shadow-inner">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary via-primary-600 to-primary-700 rounded-full shadow-sm relative overflow-hidden"
                      style={{ width: `${progressPercentage}%` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercentage}%` }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                    >
                      {/* Animated shine effect */}
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12" 
                        animate={{ x: [-100, 300] }}
                        transition={{ 
                          duration: 2, 
                          repeat: Infinity, 
                          ease: "linear",
                          repeatDelay: 1
                        }}
                      />
                    </motion.div>
                  </div>
                  
                  {/* Progress percentage indicator */}
                  {progressPercentage > 10 && (
                    <motion.div 
                      className="absolute inset-0 flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                    >
                      <span className="text-xs font-bold text-white drop-shadow">
                        {Math.round(progressPercentage)}%
                      </span>
                    </motion.div>
                  )}
                </div>
                
                {/* Next level indicator */}
                {!isMaxLevel && (
                  <motion.div 
                    className="text-center text-xs text-muted-foreground"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                  >
                    Next: <span className="font-semibold text-primary">{nextLevel}</span>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* Right side - Language Toggle, Support Menu, and Auth */}
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onLanguageToggle}
              className="flex items-center space-x-2"
            >
              <Globe className="h-4 w-4" />
              <span className="font-medium">{currentLanguage.toUpperCase()}</span>
            </Button>

            {/* Support Overflow Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <MoreVertical className="h-4 w-4" />
                  <span className="hidden sm:inline">{t('ui:support')}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-background border shadow-lg">
                <DropdownMenuItem
                  onClick={() => setShowReportIssueModal(true)}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <Bug className="h-4 w-4" />
                  <span>{t('ui:reportIssue')}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center space-x-2 cursor-pointer">
                  <HelpCircle className="h-4 w-4" />
                  <span>{t('ui:helpCenter')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant={isLoggedIn ? "outline" : "default"}
              size="sm"
              onClick={handleAuthClick}
              className="flex items-center space-x-2"
            >
              {isLoggedIn ? (
                <>
                  <LogOut className="h-4 w-4" />
                  <span>{t('ui:logout')}</span>
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  <span>{t('ui:login')}</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Report Issue Modal */}
      <ReportIssueModal
        isOpen={showReportIssueModal}
        onClose={() => setShowReportIssueModal(false)}
      />
    </motion.div>
  );
};