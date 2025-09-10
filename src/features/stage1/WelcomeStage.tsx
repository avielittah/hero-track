import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { WelcomeHero } from './WelcomeHero';
import { WelcomeInfoCards } from './WelcomeInfoCards';
import { CoreValues } from './CoreValues';
import { SuccessCriteria } from './SuccessCriteria';
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

  // Welcome stage is always available and shows the same content
  // regardless of current progress - it's the permanent introduction to the journey

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

          {/* Core Values */}
          <CoreValues />

          {/* Success Criteria */}
          <SuccessCriteria />

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