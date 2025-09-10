import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Sparkles, X, Bot } from 'lucide-react';

interface BuddyButtonProps {
  showNudge?: boolean;
  onNudgeClose?: () => void;
}

export const BuddyButton = ({ showNudge = false, onNudgeClose }: BuddyButtonProps) => {
  const { t, i18n } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showGameTooltip, setShowGameTooltip] = useState(false);
  const isRTL = i18n.language === 'he';

  // Placeholder Agent URL - replace with actual URL when available
  const AGENT_URL = 'https://app.lovable.dev/chat/placeholder-buddy-agent';

  const handleBuddyClick = () => {
    // Open in new window/tab
    window.open(AGENT_URL, '_blank', 'noopener,noreferrer');
  };

  // Show tooltip briefly after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(true);
      const hideTimer = setTimeout(() => setShowTooltip(false), 3000);
      return () => clearTimeout(hideTimer);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Game-style tooltip that appears every 3 minutes
  useEffect(() => {
    const gameTooltipMessages = [
      "Hello! I'm Buddy, your smart learning companion. Need guidance?",
      "Stuck on something? I'm here to help you navigate through any challenge.",
      "Ready to continue your journey? Let me assist you with expert insights.",
      "Questions? I provide personalized support tailored to your learning path.",
      "Need professional guidance? Click here for instant mentoring support."
    ];

    const showGameTooltip = () => {
      setShowGameTooltip(true);
      setTimeout(() => setShowGameTooltip(false), 8000); // נסגר אחרי 8 שניות
    };

    const closeGameTooltip = () => {
      setShowGameTooltip(false);
    };

    // מופיע אחרי 30 שניות ואז כל 3 דקות
    const initialTimer = setTimeout(showGameTooltip, 30000);
    const intervalTimer = setInterval(showGameTooltip, 180000); // כל 3 דקות

    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalTimer);
    };
  }, []);

  return (
    <>
      {/* Main Buddy Button */}
      <motion.div
        className={`
          fixed z-50 
          ${isRTL ? 'bottom-6 left-6' : 'bottom-6 right-6'}
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
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="relative">
          {/* Nudge Bubble */}
          <AnimatePresence>
            {showNudge && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                className={`
                  absolute bottom-full mb-3 w-64 p-3 bg-primary text-primary-foreground 
                  rounded-lg shadow-lg border
                  ${isRTL ? 'right-0' : 'left-0'}
                  max-md:left-1/2 max-md:-translate-x-1/2 max-md:right-auto
                `}
              >
                <div className="flex items-start space-x-2">
                  <Sparkles className="h-4 w-4 text-yellow-300 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{t('ui:questionsAskBuddy')}</p>
                    <p className="text-xs opacity-90 mt-1">{t('ui:buddyDescription')}</p>
                  </div>
                  {onNudgeClose && (
                    <button 
                      onClick={onNudgeClose}
                      className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                      aria-label={t('ui:closeNudge')}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
                
                {/* Pointer */}
                <div 
                  className={`
                    absolute top-full w-0 h-0 border-l-8 border-r-8 border-t-8 
                    border-transparent border-t-primary
                    ${isRTL ? 'right-4' : 'left-4'}
                    max-md:left-1/2 max-md:-translate-x-1/2 max-md:right-auto
                  `}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Game-style Buddy Tooltip */}
          <AnimatePresence>
            {showGameTooltip && !showNudge && (
              <motion.div
                initial={{ opacity: 0, scale: 0.3, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.3, y: 20 }}
                className={`
                  absolute bottom-full mb-4 w-72 
                  ${isRTL ? 'left-0' : 'right-0'}
                  max-md:right-1/2 max-md:translate-x-1/2 max-md:left-auto max-md:w-64
                `}
              >
                <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 text-white p-4 rounded-2xl shadow-2xl border border-white/20">
                  {/* Close button */}
                  <button 
                    onClick={() => setShowGameTooltip(false)}
                    className="absolute top-2 right-2 w-6 h-6 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors backdrop-blur-sm border border-white/30"
                    aria-label="סגור הודעה"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>

                  {/* Avatar */}
                  <div className="flex items-start gap-3">
                    <motion.div 
                      className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30"
                      animate={{ 
                        rotate: [0, -5, 5, 0],
                        scale: [1, 1.05, 1]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <Bot className="w-6 h-6 text-white" />
                    </motion.div>
                    
                    <div className="flex-1 pr-6">
                      <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/20">
                        <motion.p 
                          className="text-sm font-medium leading-relaxed"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          Hello! I'm here to guide you through your learning journey. Need assistance?
                        </motion.p>
                      </div>
                      
                      <motion.div 
                        className="text-xs text-white/80 mt-2 font-medium"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        — Buddy, your smart learning mentor
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
                      border-transparent border-t-indigo-600
                      ${isRTL ? 'left-6' : 'right-6'}
                      max-md:right-1/2 max-md:translate-x-1/2 max-md:left-auto
                    `}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Simple Tooltip */}
          <AnimatePresence>
            {showTooltip && !showNudge && !showGameTooltip && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 10 }}
                className={`
                  absolute bottom-full mb-2 px-3 py-1 bg-gray-900 text-white text-xs 
                  rounded-md whitespace-nowrap
                  ${isRTL ? 'right-0' : 'left-0'}
                  max-md:left-1/2 max-md:-translate-x-1/2 max-md:right-auto
                `}
              >
                {t('ui:needHelp')}
                <div 
                  className={`
                    absolute top-full w-0 h-0 border-l-4 border-r-4 border-t-4 
                    border-transparent border-t-gray-900
                    ${isRTL ? 'right-3' : 'left-3'}
                    max-md:left-1/2 max-md:-translate-x-1/2 max-md:right-auto
                  `}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Buddy Button */}
          <Button
            onClick={handleBuddyClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="
              h-14 px-4 bg-gradient-to-r from-blue-500 to-blue-600 
              hover:from-blue-600 hover:to-blue-700 
              text-white shadow-xl hover:shadow-2xl 
              rounded-full transition-all duration-300
              group focus:ring-4 focus:ring-blue-300
            "
            aria-label={t('ui:askBuddy')}
          >
            <div className="flex items-center space-x-2">
              <motion.div
                animate={isHovered ? { rotate: [0, -10, 10, 0] } : {}}
                transition={{ duration: 0.5 }}
              >
                <MessageCircle className="h-5 w-5" />
              </motion.div>
              
              <span className="font-medium hidden sm:inline">
                {t('ui:askBuddy')}
              </span>
              
              {/* Mobile label */}
              <span className="font-medium sm:hidden text-xs">
                {t('ui:help')}
              </span>
            </div>
          </Button>

          {/* Pulse animation for attention */}
          <motion.div
            className="absolute inset-0 rounded-full bg-blue-400 opacity-30 -z-10"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.1, 0.3]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      </motion.div>
    </>
  );
};