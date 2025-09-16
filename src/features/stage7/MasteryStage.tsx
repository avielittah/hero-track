import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Rocket, Star } from 'lucide-react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useJourneyMachine } from '@/features/journey/journeyMachine';
import { useLearningStore } from '@/lib/store';
import { isAdmin } from '@/lib/admin';
import {
  StageIntro,
  ToolCard,
  StageSummary,
  DidYouKnowBox,
  MiniQuiz,
  MLUModal,
  XPSkillsRecap,
  StageFeedback,
  InfoBadgeTip
} from '@/components/unified-stage';

export function MasteryStage() {
  // State management
  const [portfolioSubmitted, setPortfolioSubmitted] = useState(false);
  const [presentationSubmitted, setPresentationSubmitted] = useState(false);
  const [activeUnit, setActiveUnit] = useState<'portfolio' | 'presentation' | null>(null);
  const [showMLUModal, setShowMLUModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showLockModal, setShowLockModal] = useState(false);

  // Hooks
  const { width, height } = useWindowSize();
  const { 
    currentStage, 
    viewingStage, 
    viewMode, 
    completeCurrentStage,
    isStageCompleted 
  } = useJourneyMachine();
  const { 
    addXP, 
    awardTrophy, 
    awardMLUTrophy,
    getCurrentLevelIndex 
  } = useLearningStore();

  // Access control
  const stage6Completed = isStageCompleted(6);
  const adminBypass = isAdmin();
  const canComplete = portfolioSubmitted && presentationSubmitted;

  // Unit handlers
  const handlePortfolioSubmit = () => {
    setPortfolioSubmitted(true);
    setShowMLUModal(false);
    toast.success("Portfolio Development completed! +35 XP");
    addXP(35);
  };

  const handlePresentationSubmit = () => {
    setPresentationSubmitted(true);
    setShowMLUModal(false);
    toast.success("Executive Presentation completed! +35 XP");
    addXP(35);
  };

  const handleBonusXPClaim = () => {
    addXP(30);
    toast.success("Mastery Bonus claimed! +30 XP");
  };

  const handleStageComplete = async () => {
    try {
      setShowConfetti(true);
      
      // Award trophy
      const trophy = awardTrophy(7);
      
      // Complete stage
      completeCurrentStage();
      
      // Navigate to next stage
      toast.success("Mastery achieved! Proceeding to final reflection stage. +50 XP");
      addXP(50);
      
      setTimeout(() => setShowConfetti(false), 5000);
    } catch (error) {
      toast.error("Failed to complete stage");
    }
  };

  const handleUnitStart = (unit: 'portfolio' | 'presentation') => {
    if (!stage6Completed && !adminBypass) {
      setShowLockModal(true);
      return;
    }
    
    setActiveUnit(unit);
    setShowMLUModal(true);
  };

  // Get current MLU data
  const getCurrentMLUData = () => {
    if (activeUnit === 'portfolio') {
      return {
        title: "Professional Portfolio Development",
        description: "Create a comprehensive portfolio that showcases your journey, skills, and accomplishments for career advancement.",
        estimatedTime: "40-45 min",
        xpReward: 35,
        learningObjective: "Build a compelling professional portfolio that demonstrates your growth and capabilities.",
        backgroundInfo: "Your portfolio is your professional story. Learn to curate projects, highlight achievements, and present your skills in a way that opens doors to new opportunities.",
        videoUrl: "https://www.youtube.com/embed/eFyp-4zWF7M",
        tasks: [
          {
            type: 'multiple-choice' as const,
            question: "What should be the primary focus of a professional portfolio?",
            options: ["Showing everything you've ever done", "Demonstrating growth and impact through selected examples", "Using the most sophisticated design", "Including as many technical details as possible"],
            correctAnswer: 1
          },
          {
            type: 'open-question' as const,
            question: "Outline your portfolio structure. Include 3-5 key sections and explain what specific projects or achievements you would feature to demonstrate your professional growth."
          }
        ],
        didYouKnow: "Professionals with strong portfolios are 40% more likely to receive interview invitations and 25% more likely to negotiate higher salaries!",
        onSubmit: handlePortfolioSubmit,
        isSubmitted: portfolioSubmitted
      };
    }

    if (activeUnit === 'presentation') {
      return {
        title: "Executive-Level Presentation",
        description: "Master the art of compelling presentations that influence decisions and inspire action at the highest levels.",
        estimatedTime: "35-40 min",
        xpReward: 35,
        learningObjective: "Create and deliver executive-level presentations that drive results and demonstrate leadership.",
        backgroundInfo: "Executive presentations are about more than information—they're about influence, clarity, and action. Learn to craft messages that resonate with decision-makers.",
        videoUrl: "https://www.youtube.com/embed/Unzc731iCUY",
        tasks: [
          {
            type: 'multiple-choice' as const,
            question: "What's the most critical element of an executive presentation?",
            options: ["Having perfect slides", "Starting with a clear call to action", "Using lots of data and charts", "Speaking for the full time allotted"],
            correctAnswer: 1
          },
          {
            type: 'open-question' as const,
            question: "Design an executive presentation on 'Improving Team Productivity.' Outline your key messages, supporting evidence, and call to action. How would you adapt this for different executive audiences?"
          }
        ],
        didYouKnow: "Research shows that executives make decisions within the first 30 seconds of a presentation, making your opening and structure absolutely critical!",
        onSubmit: handlePresentationSubmit,
        isSubmitted: presentationSubmitted
      };
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 relative">
      {/* Confetti */}
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={300}
          gravity={0.3}
        />
      )}

      {/* Preview Banner */}
      {viewMode === 'peek-forward' && (
        <div className="bg-secondary/20 border-b border-secondary/30 p-3 text-center">
          <p className="text-sm text-secondary-700 font-medium">
            🔍 Preview Mode - Complete Stage 6 to unlock this content
          </p>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Stage Intro */}
        <StageIntro
          title="Mastery — Portfolio & Executive Presence"
          description="Achieve professional mastery! Develop your portfolio and executive-level presentation skills to showcase your complete transformation."
          estimatedTime="75-85 minutes total"
          xpTarget={70}
          icon={<Award className="h-8 w-8" />}
        />

        {/* Did You Know Box */}
        {(!portfolioSubmitted || !presentationSubmitted) && (
          <DidYouKnowBox 
            title="Mastery Moment"
            content="You're in the final content stage! These capstone skills—portfolio development and executive communication—are what differentiate masters from learners."
            className="mb-8"
          />
        )}

        {/* Info Badge Tip */}
        <div className="mb-8">
          <InfoBadgeTip
            label="🏆 Capstone Challenge"
            title="Mastery Synthesis"
            content="These mastery units require synthesis of everything you've learned. Take your time to create work you're proud of."
          />
        </div>

        {/* Tool Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Portfolio Development Unit */}
          <ToolCard
            id="portfolio"
            title="Professional Portfolio Development"
            description="Create a comprehensive portfolio that showcases your journey, skills, and accomplishments for career advancement."
            estimatedTime="40-45 min"
            icon={<Star className="h-6 w-6" />}
            isCompleted={portfolioSubmitted}
            onStart={() => handleUnitStart('portfolio')}
            isDisabled={!stage6Completed && !adminBypass}
          />

          {/* Executive Presentation Unit */}
          <ToolCard
            id="presentation"
            title="Executive-Level Presentation"
            description="Master the art of compelling presentations that influence decisions and inspire action at the highest levels."
            estimatedTime="35-40 min"
            icon={<Rocket className="h-6 w-6" />}
            isCompleted={presentationSubmitted}
            onStart={() => handleUnitStart('presentation')}
            isDisabled={!stage6Completed && !adminBypass}
          />
        </div>

        {/* Mini Quiz (shown after both units completed) */}
        {canComplete && (
          <MiniQuiz
            title="Mastery Philosophy"
            questions={[
              {
                question: "What's the ultimate goal of professional mastery?",
                options: [
                  "Having all the right credentials",
                  "Knowing every possible technique",
                  "Creating value and inspiring others",
                  "Being the smartest person in the room"
                ],
                correctIndex: 2
              }
            ]}
            onComplete={handleBonusXPClaim}
            className="mb-12"
          />
        )}

        {/* Stage Summary */}
        {canComplete ? (
          <div className="space-y-8">
            <StageSummary
              units={[
                {
                  id: 'portfolio',
                  title: 'Professional Portfolio Development',
                  isCompleted: portfolioSubmitted,
                  xpEarned: 35
                },
                {
                  id: 'presentation',
                  title: 'Executive-Level Presentation',
                  isCompleted: presentationSubmitted,
                  xpEarned: 35
                }
              ]}
              earnedXP={70}
              totalXP={70}
              canComplete={canComplete}
              onComplete={handleStageComplete}
              nextStageName="Final Reflection"
            />

            <XPSkillsRecap
              earnedXP={70}
              stageXP={70}
              className="mt-8"
            />

            <StageFeedback
              onSubmit={(feedback) => {
                console.log('Stage 7 Feedback:', feedback);
                toast.success("Thank you for your feedback!");
                addXP(5);
              }}
              className="mt-8"
            />
          </div>
        ) : (
          <div className="text-center py-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Award className="h-8 w-8 text-primary" />
              </div>
            </motion.div>
            <h3 className="text-xl font-semibold mb-2">Ready for Mastery?</h3>
            <p className="text-muted-foreground mb-6">
              Demonstrate your complete professional transformation with portfolio and presentation mastery.
            </p>
            <div className="text-sm text-muted-foreground">
              Progress: {[portfolioSubmitted, presentationSubmitted].filter(Boolean).length}/2 units completed
            </div>
          </div>
        )}

        {/* Continue CTA */}
        {canComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-12"
          >
            <Button
              onClick={handleStageComplete}
              size="lg"
              className="px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-primary to-secondary text-white hover:shadow-primary/25"
            >
              Achieve Mastery → Final Reflection
            </Button>
          </motion.div>
        )}
      </div>

      {/* MLU Modal */}
      {showMLUModal && (
        <MLUModal
          isOpen={showMLUModal}
          onClose={() => setShowMLUModal(false)}
          unitData={{
            id: activeUnit || 'unit',
            title: getCurrentMLUData()?.title || 'Unit',
            estimatedTime: getCurrentMLUData()?.estimatedTime || '40 min',
            objective: getCurrentMLUData()?.learningObjective || 'Learn mastery skills',
            background: getCurrentMLUData()?.backgroundInfo || 'Background info',
            tasks: [],
            quiz: { questions: [], xpReward: 35 },
            didYouKnow: { title: 'Did You Know?', content: getCurrentMLUData()?.didYouKnow || 'Mastery insight', xpReward: 5 },
            baseXP: 35,
            totalXP: 40
          }}
          stageXP={{ earned: 70, total: 70 }}
          onComplete={(earnedXP) => {
            if (activeUnit === 'portfolio') handlePortfolioSubmit();
            if (activeUnit === 'presentation') handlePresentationSubmit();
          }}
        />
      )}

      {/* Stage Lock Modal */}
      {showLockModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-card rounded-2xl p-8 max-w-md w-full text-center border shadow-xl"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-100 flex items-center justify-center">
              <Award className="h-8 w-8 text-orange-500" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Complete Previous Stage</h3>
            <p className="text-muted-foreground mb-6">
              Finish Stage 6 (Advanced Skills) to unlock these mastery challenges.
            </p>
            <Button onClick={() => setShowLockModal(false)} className="w-full">
              Got it!
            </Button>
          </motion.div>
        </div>
      )}
    </div>
  );
}