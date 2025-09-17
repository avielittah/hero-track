import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Sparkles, X } from 'lucide-react';
import { BuddyCharacter, type BuddyMood } from './BuddyCharacter';
import { useBuddyContext, type BuddyMessage } from '@/hooks/useBuddyContext';

interface SmartBuddyButtonProps {
  showNudge?: boolean;
  onNudgeClose?: () => void;
}

export const SmartBuddyButton = ({ showNudge = false, onNudgeClose }: SmartBuddyButtonProps) => {
  const { t, i18n } = useTranslation();
  const buddyContext = useBuddyContext();
  const [isHovered, setIsHovered] = useState(false);
  const [currentMessage, setCurrentMessage] = useState<BuddyMessage | null>(null);
  const [buddyMood, setBuddyMood] = useState<BuddyMood>('normal');
  const [showContextualMessage, setShowContextualMessage] = useState(false);
  const isRTL = i18n.language === 'he';

  // Agent URL - will be replaced with actual URL
  const AGENT_URL = 'https://app.lovable.dev/chat/placeholder-buddy-agent';

  const handleBuddyClick = () => {
    setBuddyMood('happy');
    setTimeout(() => setBuddyMood('normal'), 2000);
    window.open(AGENT_URL, '_blank', 'noopener,noreferrer');
  };

  // Smart message system - shows contextual messages periodically
  useEffect(() => {
    const showSmartMessage = () => {
      const messages = buddyContext.contextualMessages.filter(msg => 
        msg.type === 'guidance' || msg.type === 'tip'
      );
      
      if (messages.length === 0) return;
      
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      setCurrentMessage(randomMessage);
      setBuddyMood('thinking');
      setShowContextualMessage(true);
      
      const hideTimer = setTimeout(() => {
        setShowContextualMessage(false);
        setBuddyMood('normal');
      }, randomMessage.showFor || 6000);
      
      return () => clearTimeout(hideTimer);
    };

    // Show first message after 15 seconds, then every 2-3 minutes
    const initialTimer = setTimeout(showSmartMessage, 15000);
    const intervalTimer = setInterval(() => {
      if (!showNudge && !showContextualMessage) {
        showSmartMessage();
      }
    }, 120000 + Math.random() * 60000); // 2-3 minutes

    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalTimer);
    };
  }, [buddyContext.contextualMessages, showNudge, showContextualMessage]);

  // Achievement reaction
  useEffect(() => {
    const achievementMessage = buddyContext.getMessageByType('achievement');
    if (achievementMessage && buddyContext.currentXP > 0) {
      setBuddyMood('happy');
      setTimeout(() => setBuddyMood('normal'), 3000);
    }
  }, [buddyContext.currentXP, buddyContext.getMessageByType]);

  // Hover reactions
  const handleMouseEnter = () => {
    setIsHovered(true);
    setBuddyMood('pointing');
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setBuddyMood('normal');
  };

  return (
    <TooltipProvider>
      <motion.div
        className={`
          fixed z-50 
          ${isRTL ? 'bottom-32 left-6' : 'bottom-32 right-6'}
          md:${isRTL ? 'left-6' : 'right-6'}
          max-md:left-1/2 max-md:-translate-x-1/2 max-md:right-auto
        `}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 200, 
          damping: 15,
          delay: 1 
        }}
      >
        <div className="relative">
          {/* Priority Nudge Bubble */}
          <AnimatePresence>
            {showNudge && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                className={`
                  absolute bottom-full mb-3 w-72 p-4 bg-primary text-primary-foreground 
                  rounded-2xl shadow-2xl border border-primary/20
                  ${isRTL ? 'right-0' : 'left-0'}
                  max-md:left-1/2 max-md:-translate-x-1/2 max-md:right-auto max-md:w-64
                `}
              >
                <div className="flex items-start space-x-3">
                  <BuddyCharacter size={32} mood="pointing" animated={false} />
                  <div className="flex-1">
                    <p className="text-sm font-medium mb-1">
                      {t('stage1:buddy.nudge')}
                    </p>
                    <p className="text-xs opacity-90">
                      {buddyContext.stageTitle} • {buddyContext.roleTitle}
                    </p>
                  </div>
                  {onNudgeClose && (
                    <button 
                      onClick={onNudgeClose}
                      className="text-primary-foreground/80 hover:text-primary-foreground transition-colors p-1"
                      aria-label={t('ui:closeNudge')}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                
                {/* Enhanced Pointer */}
                <div 
                  className={`
                    absolute top-full w-0 h-0 border-l-6 border-r-6 border-t-8 
                    border-transparent border-t-primary
                    ${isRTL ? 'right-8' : 'left-8'}
                    max-md:left-1/2 max-md:-translate-x-1/2 max-md:right-auto
                  `}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Smart Contextual Message */}
          <AnimatePresence>
            {showContextualMessage && currentMessage && !showNudge && (
              <motion.div
                initial={{ opacity: 0, scale: 0.3, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.3, y: 20 }}
                className={`
                  absolute bottom-full mb-4 w-80 
                  ${isRTL ? 'left-0' : 'right-0'}
                  max-md:right-1/2 max-md:translate-x-1/2 max-md:left-auto max-md:w-72
                `}
              >
                <div className="relative bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-500 text-white p-4 rounded-2xl shadow-2xl border border-white/20 backdrop-blur-sm">
                  {/* Close button */}
                  <button 
                    onClick={() => setShowContextualMessage(false)}
                    className="absolute top-2 right-2 w-6 h-6 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors backdrop-blur-sm border border-white/30"
                    aria-label="Close message"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>

                  {/* Message content */}
                  <div className="flex items-start gap-3 pr-8">
                    <BuddyCharacter size={40} mood={buddyMood} animated={true} />
                    
                    <div className="flex-1">
                      <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/20">
                        <motion.p 
                          className="text-sm font-medium leading-relaxed"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          {currentMessage.text}
                        </motion.p>
                      </div>
                      
                      {/* Context info */}
                      <motion.div 
                        className="text-xs text-white/80 mt-2 font-medium"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        {buddyContext.stageTitle} • Level {buddyContext.currentLevel}
                      </motion.div>
                    </div>
                  </div>
                  
                  {/* Sparkle effects */}
                  <motion.div 
                    className="absolute -top-1 -right-1 text-yellow-300"
                    animate={{ 
                      rotate: [0, 360],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity
                    }}
                  >
                    <Sparkles className="w-4 h-4" />
                  </motion.div>
                  
                  {/* Speech bubble tail */}
                  <div 
                    className={`
                      absolute top-full w-0 h-0 border-l-8 border-r-8 border-t-8 
                      border-transparent border-t-indigo-500
                      ${isRTL ? 'left-6' : 'right-6'}
                      max-md:right-1/2 max-md:translate-x-1/2 max-md:left-auto
                    `}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Enhanced Buddy Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleBuddyClick}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="
                  h-16 w-16 bg-gradient-to-br from-primary via-primary/90 to-primary/80
                  hover:from-primary/90 hover:via-primary/80 hover:to-primary/70
                  text-primary-foreground shadow-2xl hover:shadow-3xl 
                  rounded-full transition-all duration-300 p-0
                  group focus:ring-4 focus:ring-primary/30
                  hover:scale-110 relative overflow-visible
                "
                aria-label={t('ui:askBuddy')}
              >
                <BuddyCharacter 
                  size={36} 
                  mood={buddyMood} 
                  animated={true}
                  className="text-white"
                />
                
                {/* Enhanced pulse effect */}
                <motion.div
                  className="absolute inset-0 rounded-full bg-primary/30"
                  animate={{ 
                    scale: [1, 1.4, 1],
                    opacity: [0.3, 0.1, 0.3]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent 
              side="left" 
              className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border-none shadow-2xl max-w-xs p-4"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <BuddyCharacter size={20} mood="happy" animated={false} />
                  <span className="font-bold">Buddy AI Mentor</span>
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                    🤖 ONLINE
                  </span>
                </div>
                <p className="text-sm opacity-90 leading-relaxed">
                  {t('stage1:ui.buddy.hover')}
                </p>
                <div className="flex items-center justify-between text-xs opacity-75">
                  <span>{buddyContext.stageTitle}</span>
                  <span>{buddyContext.currentXP} XP</span>
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </div>
      </motion.div>
    </TooltipProvider>
  );
};