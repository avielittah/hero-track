import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, Lock, Eye, Globe, LogIn, LogOut, User, MoreVertical, HelpCircle, Bug, Crown, Star, Trophy } from 'lucide-react';
import { useJourneyMachine } from '@/features/journey/journeyMachine';
import { StageId, XPThresholds } from '@/types/journey';
import { useLearningStore } from '@/lib/store';
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

interface ProgressBarProps {
  currentLanguage: string;
  onLanguageToggle: () => void;
}

export const ProgressBar = ({ currentLanguage, onLanguageToggle }: ProgressBarProps) => {
  const { t } = useTranslation();
  const { currentStage, viewingStage, viewMode, completedStages, canPreviewBack, canPeekNext, previewStage, goToStage } = useJourneyMachine();
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

  // Level calculations
  const levelIndex = ['New Explorer', 'Team Rookie', 'Skilled Learner', 'Problem Solver', 'Project Builder', 'Pro Team Member'].indexOf(level);
  const currentThreshold = XPThresholds[levelIndex] || 0;
  const nextThreshold = XPThresholds[levelIndex + 1] || XPThresholds[XPThresholds.length - 1];
  const isMaxLevel = levelIndex === 5;
  
  // XP Progress calculations
  const xpProgress = getXPProgressInCurrentLevel();
  const { current: progressInLevel, max: levelRange, percentage: progressPercentage } = xpProgress;

  const stages: StageId[] = [1, 2, 3, 4, 5, 6, 7, 8];

  const getStageStatus = (stageId: StageId) => {
    if (completedStages.has(stageId)) return 'completed';
    if (stageId === currentStage) return 'current';
    if (stageId === viewingStage && viewMode === 'peek-forward') return 'peeking';
    return 'upcoming';
  };

  const getStageIcon = (stageId: StageId) => {
    const status = getStageStatus(stageId);
    
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-journey-complete" />;
      case 'current':
        return <Circle className="h-5 w-5 text-journey-current fill-current" />;
      case 'peeking':
        return <Eye className="h-5 w-5 text-secondary" />;
      default:
        return <Lock className="h-5 w-5 text-journey-upcoming" />;
    }
  };

  const getStageColor = (stageId: StageId) => {
    const status = getStageStatus(stageId);
    
    switch (status) {
      case 'completed':
        return 'text-journey-complete';
      case 'current':
        return 'text-journey-current font-semibold';
      case 'peeking':
        return 'text-secondary font-medium';
      default:
        return 'text-journey-upcoming';
    }
  };

  const handleStageClick = (stageId: StageId) => {
    if (canPreviewBack(stageId)) {
      previewStage(stageId);
    } else if (stageId === currentStage + 1 && canPeekNext()) {
      previewStage(stageId);
    } else if (stageId === currentStage) {
      goToStage(stageId);
    }
  };

  const isClickable = (stageId: StageId) => {
    return canPreviewBack(stageId) || 
           (stageId === currentStage + 1 && canPeekNext()) ||
           stageId === currentStage;
  };

  return (
    <motion.div 
      className="bg-card border-b shadow-sm px-6 py-4"
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Top Section - User Info & Controls */}
        <div className="flex items-center justify-between mb-6">
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
                  <Avatar className="h-10 w-10 ring-2 ring-primary/20 hover:ring-primary/40 transition-all cursor-pointer">
                    <AvatarImage src="" alt={username || 'Learner'} />
                    <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                </motion.button>
              }
            />
            
            {isLoggedIn && (
              <div className="flex items-center space-x-4">
                <div className="flex flex-col">
                  <span className="font-medium text-foreground text-sm">{username}</span>
                  <div className="flex items-center space-x-2 text-xs">
                    <div className="flex items-center space-x-1">
                      {isMaxLevel ? (
                        <Crown className="h-3 w-3 text-primary" />
                      ) : (
                        <Star className="h-3 w-3 text-primary" />
                      )}
                      <span className="text-muted-foreground">{t('level')}:</span>
                      <span className="font-semibold text-primary">{t(level)}</span>
                    </div>
                    {trophies.length > 0 && (
                      <div className="flex items-center space-x-1">
                        <Trophy className="h-3 w-3 text-yellow-500" />
                        <span className="text-xs text-yellow-600 font-medium">{trophies.length}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* XP Progress Bar */}
                {!isMaxLevel && (
                  <div className="flex-1 min-w-[120px] max-w-[200px]">
                    <div className="text-center mb-1">
                      <span className="text-xs font-medium text-muted-foreground">
                        {progressInLevel} / {levelRange} {t('xp')}
                      </span>
                    </div>
                    <div className="relative h-2 bg-xp-bg rounded-full overflow-hidden">
                      <motion.div
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-primary-700 rounded-full"
                        style={{ width: `${progressPercentage}%` }}
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercentage}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right side - Controls */}
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

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <MoreVertical className="h-4 w-4" />
                  <span className="hidden sm:inline">{t('support')}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-background border shadow-lg">
                <DropdownMenuItem
                  onClick={() => setShowReportIssueModal(true)}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <Bug className="h-4 w-4" />
                  <span>{t('reportIssue')}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center space-x-2 cursor-pointer">
                  <HelpCircle className="h-4 w-4" />
                  <span>{t('helpCenter')}</span>
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

        {/* Journey Progress Section */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">{t('journeyProgress')}</h2>
        
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute top-6 left-6 right-6 h-0.5 bg-journey-bg">
            <motion.div
              className="h-full bg-gradient-to-r from-journey-complete to-journey-current"
              style={{ width: `${((currentStage - 1) / (stages.length - 1)) * 100}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${((currentStage - 1) / (stages.length - 1)) * 100}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </div>

          {/* Stage Indicators */}
          <div className="flex justify-between items-center">
            {stages.map((stageId, index) => {
              const status = getStageStatus(stageId);
              
              return (
                <motion.div
                  key={stageId}
                  className={`flex flex-col items-center space-y-2 z-10 relative ${isClickable(stageId) ? 'cursor-pointer' : 'cursor-default'}`}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: index * 0.1 + 0.2,
                    type: "spring",
                    stiffness: 100
                  }}
                  onClick={() => handleStageClick(stageId)}
                  whileHover={isClickable(stageId) ? { scale: 1.1 } : {}}
                >
                  {/* Stage Circle */}
                  <div className={`
                    w-12 h-12 rounded-full border-2 flex items-center justify-center
                    ${status === 'completed' ? 'bg-journey-complete border-journey-complete' : ''}
                    ${status === 'current' ? 'bg-journey-current border-journey-current shadow-lg' : ''}
                    ${status === 'peeking' ? 'bg-secondary border-secondary shadow-md' : ''}
                    ${status === 'upcoming' ? 'bg-card border-journey-upcoming' : ''}
                    ${stageId === viewingStage ? 'ring-2 ring-offset-2 ring-primary/50' : ''}
                    transition-all duration-300
                  `}>
                    {getStageIcon(stageId)}
                  </div>

                  {/* Stage Label */}
                  <div className="text-center">
                    <div className={`text-sm ${getStageColor(stageId)} transition-colors duration-300`}>
                      {t('stage', { number: stageId })}
                    </div>
                    {status === 'current' && (
                      <motion.div
                        className="text-xs text-journey-current font-medium mt-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        {t('current')}
                      </motion.div>
                    )}
                  </div>

                  {/* Current Stage Glow Effect */}
                  {status === 'current' && (
                    <motion.div
                      className="absolute inset-0 rounded-full bg-journey-current/20 blur-lg -z-10"
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0.8, 0.5]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  )}
                </motion.div>
              );
            })}
          </div>
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