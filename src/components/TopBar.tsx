import { useState } from 'react';
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
import { Globe, LogIn, LogOut, User, MoreVertical, HelpCircle, Bug } from 'lucide-react';
import { useLearningStore } from '@/lib/store';
import { Trophy } from 'lucide-react';

interface TopBarProps {
  currentLanguage: string;
  onLanguageToggle: () => void;
}

export const TopBar = ({ currentLanguage, onLanguageToggle }: TopBarProps) => {
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
    trophies 
  } = useLearningStore();

  const handleAuthClick = () => {
    if (isLoggedIn) {
      logout();
    } else {
      login('Demo User');
    }
  };

  // Calculate XP progress for current level using the store method
  const xpProgress = getXPProgressInCurrentLevel();
  const { current: progressInLevel, max: levelRange, percentage: progressPercentage } = xpProgress;

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
                <span className="text-muted-foreground">{t('level')}: </span>
                <span className="font-semibold text-primary">{t(level)}</span>
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
            className="flex-1 max-w-md mx-8"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-center mb-2">
              <span className="text-sm font-medium text-muted-foreground">
                {progressInLevel} / {levelRange} {t('xp')} to next level
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
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" 
                animate={{ x: [-100, 300] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
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
                <span className="hidden sm:inline">Support</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-background border shadow-lg">
              <DropdownMenuItem
                onClick={() => setShowReportIssueModal(true)}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <Bug className="h-4 w-4" />
                <span>Report Issue</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center space-x-2 cursor-pointer">
                <HelpCircle className="h-4 w-4" />
                <span>Help Center</span>
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

      {/* Report Issue Modal */}
      <ReportIssueModal
        isOpen={showReportIssueModal}
        onClose={() => setShowReportIssueModal(false)}
      />
    </motion.div>
  );
};