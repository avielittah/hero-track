import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { CompletionBanner } from '@/components/CompletionBanner';
import { WelcomeHero } from './WelcomeHero';
import { WelcomeInfoCards } from './WelcomeInfoCards';
import { CoreValues } from './CoreValues';
import { SuccessCriteria } from './SuccessCriteria';
import { BuddyHighlight } from './BuddyHighlight';
import { StartCTA } from './StartCTA';
import { VoiceGuidePanel } from '@/components/VoiceGuideButton';
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
  const isPreviewMode = viewMode === 'preview-back' || currentStage > 1;

  // Create voice guide content
  const hebrewVoiceContent = `
    ברוכים הבאים לתוכנית ההדרכה של TaleAI למהנדס מערכות תקשורת.
    התוכנית מחולקת ל-8 שלבים שיכינו אתכם לתפקיד החדש.
    בכל שלב תלמדו כלים חדשים, תבצעו תרגילים מעשיים, ותקבלו משוב מיידי.
    התוכנית נמשכת כ-3 שבועות, שעה עד שעתיים ביום, בקצב שלכם.
    תקבלו נקודות ניסיון על כל משימה שתשלימו, ותעלו רמות בהתקדמכם.
    באדי, המנטור החכם שלכם, ילווה אתכם לאורך כל הדרך ויענה על כל שאלה.
    בואו נתחיל במסע!
  `.trim();

  const englishVoiceContent = `
    Welcome to TaleAI's onboarding program for Communication Systems Engineers.
    The program is divided into 8 stages that will prepare you for your new role.
    In each stage, you'll learn new tools, perform practical exercises, and receive immediate feedback.
    The program lasts about 3 weeks, 1-2 hours per day, at your own pace.
    You'll earn experience points for each completed task and level up as you progress.
    Buddy, your smart AI mentor, will accompany you throughout the journey and answer any questions.
    Let's begin the journey!
  `.trim();

  return (
    <div className="min-h-screen bg-background">
      {/* Preview Banner */}
      {isPreviewMode && (
        <CompletionBanner stageName="Welcome" />
      )}
      
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

      {/* Background Decoration - פישוט הגרדיאנט */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-primary/3 rounded-full blur-3xl" />
      </div>

      {/* Voice Guide Panel */}
      <VoiceGuidePanel 
        hebrewContent={hebrewVoiceContent}
        englishContent={englishVoiceContent}
      />
    </div>
  );
};