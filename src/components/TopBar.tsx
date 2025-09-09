import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Globe, LogIn, LogOut, User } from 'lucide-react';
import { useLearningStore } from '@/lib/store';
import { XPThresholds } from '@/types/journey';

interface TopBarProps {
  currentLanguage: string;
  onLanguageToggle: () => void;
}

export const TopBar = ({ currentLanguage, onLanguageToggle }: TopBarProps) => {
  const { t } = useTranslation();
  const { isLoggedIn, username, level, currentXP, login, logout } = useLearningStore();

  const handleAuthClick = () => {
    if (isLoggedIn) {
      logout();
    } else {
      login('Demo User');
    }
  };

  // Calculate XP progress for current level
  const currentLevelIndex = ['New Explorer', 'Team Rookie', 'Skilled Learner', 'Problem Solver', 'Project Builder', 'Pro Team Member'].indexOf(level);
  const currentThreshold = XPThresholds[currentLevelIndex] || 0;
  const nextThreshold = XPThresholds[currentLevelIndex + 1] || XPThresholds[XPThresholds.length - 1];
  const progressInLevel = currentXP - currentThreshold;
  const levelRange = nextThreshold - currentThreshold;
  const progressPercentage = Math.min((progressInLevel / levelRange) * 100, 100);

  return (
    <motion.div 
      className="bg-card border-b shadow-sm px-6 py-4"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Left side - Avatar and User Info */}
        <div className="flex items-center space-x-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Avatar className="h-12 w-12 ring-2 ring-primary/20">
              <AvatarImage src="" alt={username || 'Learner'} />
              <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                <User className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
          </motion.div>
          
          {isLoggedIn && (
            <div className="flex flex-col">
              <span className="font-medium text-foreground">{username}</span>
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-muted-foreground">{t('level')}: </span>
                <span className="font-semibold text-primary">{t(level)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Center - XP Progress (visible when logged in) */}
        {isLoggedIn && (
          <motion.div 
            className="flex-1 max-w-md mx-8"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-center mb-2">
              <span className="text-sm font-medium text-muted-foreground">
                {currentXP} / {nextThreshold} {t('xp')}
              </span>
            </div>
            <div className="relative h-3 bg-xp-bg rounded-full overflow-hidden">
              <motion.div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-primary-700 rounded-full"
                style={{ width: `${progressPercentage}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
            </div>
          </motion.div>
        )}

        {/* Right side - Language Toggle and Auth */}
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

          <Button
            variant={isLoggedIn ? "outline" : "default"}
            size="sm"
            onClick={handleAuthClick}
            className="flex items-center space-x-2"
          >
            {isLoggedIn ? (
              <>
                <LogOut className="h-4 w-4" />
                <span>{t('logout')}</span>
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                <span>{t('login')}</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};