import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { TopBar } from '@/components/TopBar';
import { ProgressBar } from '@/components/ProgressBar';
import { LevelBar } from '@/components/LevelBar';
import { StageContainer } from '@/features/journey/StageContainer';

const Index = () => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  useEffect(() => {
    // Set document direction based on language
    document.documentElement.dir = currentLanguage === 'he' ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage]);

  const handleLanguageToggle = () => {
    const newLanguage = currentLanguage === 'en' ? 'he' : 'en';
    i18n.changeLanguage(newLanguage);
    setCurrentLanguage(newLanguage);
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      <TopBar 
        currentLanguage={currentLanguage}
        onLanguageToggle={handleLanguageToggle}
      />
      <LevelBar />
      <ProgressBar />
      <StageContainer />
    </div>
  );
};

export default Index;
