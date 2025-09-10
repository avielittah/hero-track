import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BuddyButton } from '@/components/BuddyButton';
import { ProgressBar } from '@/components/ProgressBar';
import { StageContainer } from '@/features/journey/StageContainer';
import { FooterBar } from '@/components/layout/FooterBar';

const Index = () => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  const [showBuddyNudge, setShowBuddyNudge] = useState(false);

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

  return (
    <div className="min-h-screen bg-background font-sans relative pb-16">
      <ProgressBar 
        currentLanguage={currentLanguage}
        onLanguageToggle={handleLanguageToggle}
      />
      <StageContainer />
      
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
