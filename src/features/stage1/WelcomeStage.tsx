import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { WelcomeHero } from './WelcomeHero';
import { WelcomeInfoCards } from './WelcomeInfoCards';
import { BuddyHighlight } from './BuddyHighlight';
import { StartCTA } from './StartCTA';
import { welcomeContent } from './welcome.content';
import { useJourneyMachine } from '@/features/journey/journeyMachine';

export const WelcomeStage = () => {
  const { i18n } = useTranslation();
  const { currentStage, viewingStage, viewMode } = useJourneyMachine();

  // Set page direction for RTL support
  useEffect(() => {
    document.documentElement.dir = i18n.language === 'he' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  // Check if we should show this welcome screen
  const shouldShowWelcome = currentStage === 1 && viewingStage === 1 && viewMode === 'current';

  if (!shouldShowWelcome) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto" />
          <p className="text-muted-foreground">
            Welcome stage is only available at the beginning of your journey.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Main Container */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="space-y-12"
        >
          {/* Hero Section */}
          <WelcomeHero />

          {/* Info Cards */}
          <WelcomeInfoCards />

          {/* Buddy Highlight */}
          <BuddyHighlight />

          {/* Start CTA */}
          <StartCTA />
        </motion.div>

        {/* Bottom Spacing for Mobile */}
        <div className="h-24 md:h-12" />
      </div>

      {/* Background Decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
      </div>
    </div>
  );
};