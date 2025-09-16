import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Lightbulb, TrendingUp } from 'lucide-react';
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

export function AdvancedSkillsStage() {
  // State management
  const [analyticsSubmitted, setAnalyticsSubmitted] = useState(false);
  const [leadershipSubmitted, setLeadershipSubmitted] = useState(false);
  const [activeUnit, setActiveUnit] = useState<'analytics' | 'leadership' | null>(null);
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
  const stage5Completed = isStageCompleted(5);
  const adminBypass = isAdmin();
  const canComplete = analyticsSubmitted && leadershipSubmitted;

  // Unit handlers
  const handleAnalyticsSubmit = () => {
    setAnalyticsSubmitted(true);
    setShowMLUModal(false);
    toast.success("Data Analytics Unit completed! +30 XP");
    addXP(30);
  };

  const handleLeadershipSubmit = () => {
    setLeadershipSubmitted(true);
    setShowMLUModal(false);
    toast.success("Leadership Development Unit completed! +30 XP");
    addXP(30);
  };

  const handleBonusXPClaim = () => {
    addXP(25);
    toast.success("Bonus XP claimed! +25 XP");
  };

  const handleStageComplete = async () => {
    try {
      setShowConfetti(true);
      
      // Award trophy
      const trophy = awardTrophy(6);
      
      // Complete stage
      completeCurrentStage();
      
      // Navigate to next stage
      toast.success("Advanced Skills mastered! Moving to final content stage. +40 XP");
      addXP(40);
      
      setTimeout(() => setShowConfetti(false), 5000);
    } catch (error) {
      toast.error("Failed to complete stage");
    }
  };

  const handleUnitStart = (unit: 'analytics' | 'leadership') => {
    if (!stage5Completed && !adminBypass) {
      setShowLockModal(true);
      return;
    }
    
    setActiveUnit(unit);
    setShowMLUModal(true);
  };

  // Get current MLU data
  const getCurrentMLUData = () => {
    if (activeUnit === 'analytics') {
      return {
        title: "Data Analytics & Insights",
        description: "Learn to analyze data, create meaningful reports, and make data-driven decisions that impact business outcomes.",
        estimatedTime: "30-35 min",
        xpReward: 30,
        learningObjective: "Master data interpretation, visualization, and strategic decision-making based on analytics.",
        backgroundInfo: "Data literacy is crucial in today's workplace. Learn to work with spreadsheets, create dashboards, and translate numbers into actionable insights.",
        videoUrl: "https://www.youtube.com/embed/yZvFH7B6gKI",
        tasks: [
          {
            type: 'multiple-choice' as const,
            question: "What's the most important step in data analysis?",
            options: ["Collecting as much data as possible", "Defining clear questions and objectives", "Using the most advanced tools", "Creating complex visualizations"],
            correctAnswer: 1
          },
          {
            type: 'open-question' as const,
            question: "Describe how you would analyze team productivity data to identify improvement opportunities. Include specific metrics and visualization approaches."
          }
        ],
        didYouKnow: "Companies that use data-driven decision making are 6% more profitable and 5% more productive than their competitors!",
        onSubmit: handleAnalyticsSubmit,
        isSubmitted: analyticsSubmitted
      };
    }

    if (activeUnit === 'leadership') {
      return {
        title: "Leadership Development",
        description: "Develop essential leadership skills including team motivation, strategic thinking, and change management.",
        estimatedTime: "25-30 min",
        xpReward: 30,
        learningObjective: "Build leadership competencies for guiding teams, managing change, and driving results.",
        backgroundInfo: "Leadership isn't about titles—it's about influence, vision, and empowering others. Learn practical skills for leading in any role.",
        videoUrl: "https://www.youtube.com/embed/ReRcHdeUG9Y",
        tasks: [
          {
            type: 'multiple-choice' as const,
            question: "What's the key characteristic of effective leaders?",
            options: ["Making all decisions independently", "Empowering and developing others", "Having all the answers", "Avoiding difficult conversations"],
            correctAnswer: 1
          },
          {
            type: 'open-question' as const,
            question: "Describe a leadership challenge you've faced or observed. How would you approach it using leadership principles, and what outcome would you aim for?"
          }
        ],
        didYouKnow: "Studies show that organizations with strong leadership development programs are 2.4x more likely to have engaged employees and 1.5x more likely to be top financial performers!",
        onSubmit: handleLeadershipSubmit,
        isSubmitted: leadershipSubmitted
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
          numberOfPieces={200}
          gravity={0.3}
        />
      )}

      {/* Preview Banner */}
      {viewMode === 'peek-forward' && (
        <div className="bg-secondary/20 border-b border-secondary/30 p-3 text-center">
          <p className="text-sm text-secondary-700 font-medium">
            🔍 Preview Mode - Complete Stage 5 to unlock this content
          </p>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Stage Intro */}
        <StageIntro
          title="Advanced Skills — Analytics & Leadership"
          description="Elevate your expertise with advanced professional skills. Master data analytics and leadership capabilities that distinguish top performers."
          estimatedTime="55-65 minutes total"
          xpTarget={60}
          icon={<Target className="h-8 w-8" />}
        />

        {/* Did You Know Box */}
        {(!analyticsSubmitted || !leadershipSubmitted) && (
          <DidYouKnowBox 
            title="Career Accelerator"
            content="These advanced skills are the top differentiators for senior roles. 67% of executives identify data literacy and leadership as critical for career advancement!"
            className="mb-8"
          />
        )}

        {/* Info Badge Tip */}
        <div className="mb-8">
          <InfoBadgeTip
            label="🎯 Strategic Focus"
            title="Advanced Professional Skills"
            content="These units focus on strategic thinking and advanced problem-solving that senior professionals use daily."
          />
        </div>

        {/* Tool Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Data Analytics Unit */}
          <ToolCard
            id="analytics"
            title="Data Analytics & Insights"
            description="Learn to analyze data, create meaningful reports, and make data-driven decisions that impact business outcomes."
            estimatedTime="30-35 min"
            icon={<TrendingUp className="h-6 w-6" />}
            isCompleted={analyticsSubmitted}
            onStart={() => handleUnitStart('analytics')}
            isDisabled={!stage5Completed && !adminBypass}
          />

          {/* Leadership Development Unit */}
          <ToolCard
            id="leadership"
            title="Leadership Development"
            description="Develop essential leadership skills including team motivation, strategic thinking, and change management."
            estimatedTime="25-30 min"
            icon={<Lightbulb className="h-6 w-6" />}
            isCompleted={leadershipSubmitted}
            onStart={() => handleUnitStart('leadership')}
            isDisabled={!stage5Completed && !adminBypass}
          />
        </div>

        {/* Mini Quiz (shown after both units completed) */}
        {canComplete && (
          <MiniQuiz
            title="Advanced Skills Integration"
            questions={[
              {
                question: "What's the most effective way to drive organizational change?",
                options: [
                  "Implement changes quickly without consultation",
                  "Focus only on data and ignore people concerns",
                  "Combine data insights with strong people leadership",
                  "Wait for perfect conditions before starting"
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
                  id: 'analytics',
                  title: 'Data Analytics & Insights',
                  isCompleted: analyticsSubmitted,
                  xpEarned: 30
                },
                {
                  id: 'leadership',
                  title: 'Leadership Development',
                  isCompleted: leadershipSubmitted,
                  xpEarned: 30
                }
              ]}
              earnedXP={60}
              totalXP={60}
              canComplete={canComplete}
              onComplete={handleStageComplete}
              nextStageName="Stage 7"
            />

            <XPSkillsRecap
              earnedXP={60}
              stageXP={60}
              className="mt-8"
            />

            <StageFeedback
              onSubmit={(feedback) => {
                console.log('Stage 6 Feedback:', feedback);
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
                <Target className="h-8 w-8 text-primary" />
              </div>
            </motion.div>
            <h3 className="text-xl font-semibold mb-2">Ready for Advanced Skills?</h3>
            <p className="text-muted-foreground mb-6">
              Master analytics and leadership to become a strategic contributor in any organization.
            </p>
            <div className="text-sm text-muted-foreground">
              Progress: {[analyticsSubmitted, leadershipSubmitted].filter(Boolean).length}/2 units completed
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
              className="px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Complete Stage 6 → Continue Journey
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
            estimatedTime: getCurrentMLUData()?.estimatedTime || '30 min',
            objective: getCurrentMLUData()?.learningObjective || 'Learn skills',
            background: getCurrentMLUData()?.backgroundInfo || 'Background info',
            tasks: [],
            quiz: { questions: [], xpReward: 30 },
            didYouKnow: { title: 'Did You Know?', content: getCurrentMLUData()?.didYouKnow || 'Interesting fact', xpReward: 5 },
            baseXP: 30,
            totalXP: 35
          }}
          stageXP={{ earned: 60, total: 60 }}
          onComplete={(earnedXP) => {
            if (activeUnit === 'analytics') handleAnalyticsSubmit();
            if (activeUnit === 'leadership') handleLeadershipSubmit();
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
              <Target className="h-8 w-8 text-orange-500" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Complete Previous Stage</h3>
            <p className="text-muted-foreground mb-6">
              Finish Stage 5 (Midway Survey) to unlock these advanced skills.
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