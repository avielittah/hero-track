import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BuddyButton } from '@/components/BuddyButton';
import { TopBar } from '@/components/TopBar';
import { ProgressBar } from '@/components/ProgressBar';
import { LevelBar } from '@/components/LevelBar';
import { LevelUpModal } from '@/components/LevelUpModal';
import { StageContainer } from '@/features/journey/StageContainer';
import { FooterBar } from '@/components/layout/FooterBar';
import { useLearningStore } from '@/lib/store';

const Index = () => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  const [showBuddyNudge, setShowBuddyNudge] = useState(false);
  
  // Level Up Modal from store
  const { 
    showLevelUpModal, 
    levelUpData, 
    setLevelUpModal,
    awardTaskXP,
    awardStageXP,
    currentXP,
    level 
  } = useLearningStore();

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

  // Test XP system - temporary function for testing
  const testXPSystem = async () => {
    // Award task XP to test the system
    await awardTaskXP('task');
  };

  // Test Stage XP - temporary function for testing
  const testStageXP = async () => {
    await awardStageXP(2);
  };

  return (
    <div className="min-h-screen bg-background font-sans relative pb-20">
      <TopBar 
        currentLanguage={currentLanguage}
        onLanguageToggle={handleLanguageToggle}
      />
      <ProgressBar />
      <StageContainer />
      
      {/* Fixed Gaming XP Bar */}
      <LevelBar />
      
      {/* Level Up Modal */}
      {showLevelUpModal && levelUpData && (
        <LevelUpModal
          isOpen={showLevelUpModal}
          onClose={() => setLevelUpModal(false)}
          newLevel={levelUpData.newLevel}
          previousLevel={levelUpData.previousLevel}
          currentXP={levelUpData.currentXP}
        />
      )}
      
      {/* Temporary XP Testing Buttons - Remove in production */}
      <div className="fixed top-20 left-4 z-50 space-y-2 bg-background/80 backdrop-blur-sm p-2 rounded-lg border">
        <button
          onClick={testXPSystem}
          className="block w-full text-xs px-2 py-1 bg-primary text-primary-foreground rounded hover:bg-primary/90"
        >
          +15 XP (Task)
        </button>
        <button
          onClick={testStageXP}
          className="block w-full text-xs px-2 py-1 bg-secondary text-secondary-foreground rounded hover:bg-secondary/90"
        >
          +75 XP (Stage)
        </button>
        <div className="text-xs text-muted-foreground">
          {currentXP} XP | {level}
        </div>
      </div>
      
      {/* Buddy Button */}
      <BuddyButton 
        showNudge={showBuddyNudge}
        onNudgeClose={() => setShowBuddyNudge(false)}
      />
      
      {/* Footer Bar with Admin */}
      <FooterBar />
    </div>
  );
};

export default Index;
