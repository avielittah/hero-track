import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BuddyButton } from '@/components/BuddyButton';
import { UnifiedTopBar } from '@/components/UnifiedTopBar';
import { LevelUpModal } from '@/components/LevelUpModal';
import { ProgressBar } from '@/components/ProgressBar';
import { StageContainer } from '@/features/journey/StageContainer';
import { FooterBar } from '@/components/layout/FooterBar';
import { useLearningStore } from '@/lib/store';

const Index = () => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  const [showBuddyNudge, setShowBuddyNudge] = useState(false);
  const [levelUpModal, setLevelUpModal] = useState<{
    isOpen: boolean;
    newLevel?: string;
    previousLevel?: string;
    currentXP?: number;
  }>({ isOpen: false });
  
  const { currentXP, level } = useLearningStore();

  useEffect(() => {
    // Set document direction based on language
    document.documentElement.dir = i18n.language === 'he' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  const handleLanguageToggle = () => {
    const newLanguage = currentLanguage === 'en' ? 'he' : 'en';
    i18n.changeLanguage(newLanguage);
    setCurrentLanguage(newLanguage);
  };

  // Listen for stage completion events to show buddy nudge
  useEffect(() => {
    const handleStageComplete = () => {
      setShowBuddyNudge(true);
      
      // Auto-hide nudge after 8 seconds
      const timer = setTimeout(() => {
        setShowBuddyNudge(false);
      }, 8000);
      
      return () => clearTimeout(timer);
    };

    // Listen for custom stage completion events
    window.addEventListener('stageCompleted', handleStageComplete);
    
    return () => {
      window.removeEventListener('stageCompleted', handleStageComplete);
    };
  }, []);

  // Listen for level up events
  useEffect(() => {
    const handleLevelUp = (event: CustomEvent) => {
      const { newLevel, previousLevel, currentXP } = event.detail;
      setLevelUpModal({
        isOpen: true,
        newLevel,
        previousLevel,
        currentXP
      });
    };

    // Listen for custom level up events
    window.addEventListener('levelUp', handleLevelUp as EventListener);
    
    return () => {
      window.removeEventListener('levelUp', handleLevelUp as EventListener);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background font-sans relative pb-16">
      <UnifiedTopBar 
        currentLanguage={currentLanguage}
        onLanguageToggle={handleLanguageToggle}
      />
      <ProgressBar />
      <StageContainer />
      
      {/* Buddy Button */}
      <BuddyButton 
        showNudge={showBuddyNudge}
        onNudgeClose={() => setShowBuddyNudge(false)}
      />
      
      {/* Level Up Modal */}
      <LevelUpModal
        isOpen={levelUpModal.isOpen}
        onClose={() => setLevelUpModal({ isOpen: false })}
        newLevel={levelUpModal.newLevel as any}
        previousLevel={levelUpModal.previousLevel as any}
        currentXP={levelUpModal.currentXP || currentXP}
      />
      
      {/* Footer Bar with Admin */}
      <FooterBar />
    </div>
  );
};

export default Index;
