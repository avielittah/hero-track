import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, BookOpen, Users } from 'lucide-react';
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

export function ApplicationSkillsStage() {
  // State management
  const [projectSubmitted, setProjectSubmitted] = useState(false);
  const [collaborationSubmitted, setCollaborationSubmitted] = useState(false);
  const [activeUnit, setActiveUnit] = useState<'project' | 'collaboration' | null>(null);
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
  const stage3Completed = isStageCompleted(3);
  const adminBypass = isAdmin();
  const canComplete = projectSubmitted && collaborationSubmitted;

  // Unit handlers
  const handleProjectSubmit = () => {
    setProjectSubmitted(true);
    setShowMLUModal(false);
    toast.success("Project Management Unit completed! +25 XP");
    addXP(25);
  };

  const handleCollaborationSubmit = () => {
    setCollaborationSubmitted(true);
    setShowMLUModal(false);
    toast.success("Team Collaboration Unit completed! +25 XP");
    addXP(25);
  };

  const handleBonusXPClaim = () => {
    addXP(20);
    toast.success("Bonus XP claimed! +20 XP");
  };

  const handleStageComplete = async () => {
    try {
      setShowConfetti(true);
      
      // Award trophy
      const trophy = awardTrophy(4);
      
      // Complete stage
      completeCurrentStage();
      
      // Navigate to next stage
      toast.success("Application Skills mastered! Moving to Midway Survey. +30 XP");
      addXP(30);
      
      setTimeout(() => setShowConfetti(false), 5000);
    } catch (error) {
      toast.error("Failed to complete stage");
    }
  };

  const handleUnitStart = (unit: 'project' | 'collaboration') => {
    if (!stage3Completed && !adminBypass) {
      setShowLockModal(true);
      return;
    }
    
    setActiveUnit(unit);
    setShowMLUModal(true);
  };

  // Get current MLU data
  const getCurrentMLUData = () => {
    if (activeUnit === 'project') {
      return {
        title: "Project Management Mastery",
        description: "Learn to plan, organize, and deliver successful projects while leading teams effectively.",
        estimatedTime: "25-30 min",
        xpReward: 25,
        learningObjective: "Master project planning, team coordination, and delivery management.",
        backgroundInfo: "Project management is essential for any professional role. You'll learn frameworks like Agile, stakeholder management, and risk assessment.",
        videoUrl: "https://www.youtube.com/embed/3qQn3zWBo8s",
        tasks: [
          {
            type: 'multiple-choice' as const,
            question: "What are the key phases of project management?",
            options: ["Initiation, Planning, Execution, Monitoring, Closure", "Planning, Development, Testing", "Research, Design, Implementation", "Analysis, Design, Coding, Testing"],
            correctAnswer: 0
          },
          {
            type: 'open-question' as const,
            question: "Describe how you would handle a project that's falling behind schedule. Include at least 3 specific strategies."
          }
        ],
        didYouKnow: "Did you know? 89% of high-performing organizations use standardized project management practices, leading to 28% better success rates!",
        onSubmit: handleProjectSubmit,
        isSubmitted: projectSubmitted
      };
    }

    if (activeUnit === 'collaboration') {
      return {
        title: "Advanced Team Collaboration",
        description: "Develop skills for effective teamwork, communication, and conflict resolution in diverse teams.",
        estimatedTime: "20-25 min",
        xpReward: 25,
        learningObjective: "Excel at team dynamics, communication protocols, and collaborative problem-solving.",
        backgroundInfo: "Modern work requires seamless collaboration across departments, time zones, and skill sets. Master the tools and techniques for high-performing teams.",
        videoUrl: "https://www.youtube.com/embed/HAnw168huqA",
        tasks: [
          {
            type: 'multiple-choice' as const,
            question: "What's the most effective way to resolve team conflicts?",
            options: ["Ignore the conflict", "Address issues directly with all parties", "Let the manager handle it", "Vote on the solution"],
            correctAnswer: 1
          },
          {
            type: 'open-question' as const,
            question: "Describe a time when you had to collaborate with someone with a very different working style. How did you adapt and what was the outcome?"
          }
        ],
        didYouKnow: "Research shows that teams with strong collaboration practices are 5x more likely to be high-performing and 2x more likely to exceed their goals!",
        onSubmit: handleCollaborationSubmit,
        isSubmitted: collaborationSubmitted
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
            🔍 Preview Mode - Complete Stage 3 to unlock this content
          </p>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Stage Intro */}
        <StageIntro
          title="Application Skills — Project Management & Collaboration"
          description="Put your learning into practice! Master project management and advanced collaboration skills that you'll use in real work scenarios."
          estimatedTime="45-55 minutes total"
          xpTarget={50}
          icon={<BookOpen className="h-8 w-8" />}
        />

        {/* Did You Know Box */}
        {(!projectSubmitted || !collaborationSubmitted) && (
          <DidYouKnowBox 
            title="Professional Tip"
            content="These application skills directly translate to workplace success. 73% of employers prioritize project management and collaboration abilities when hiring!"
            className="mb-8"
          />
        )}

        {/* Info Badge Tip */}
        <div className="mb-8">
          <InfoBadgeTip
            label="💡 Learning Focus"
            title="Real-World Application"
            content="Each unit includes hands-on scenarios and real-world case studies to prepare you for actual workplace challenges."
          />
        </div>

        {/* Tool Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Project Management Unit */}
          <ToolCard
            id="project"
            title="Project Management Mastery"
            description="Learn to plan, organize, and deliver successful projects while leading teams effectively."
            estimatedTime="25-30 min"
            icon={<Zap className="h-6 w-6" />}
            isCompleted={projectSubmitted}
            onStart={() => handleUnitStart('project')}
            isDisabled={!stage3Completed && !adminBypass}
          />

          {/* Team Collaboration Unit */}
          <ToolCard
            id="collaboration"
            title="Advanced Team Collaboration"
            description="Develop skills for effective teamwork, communication, and conflict resolution in diverse teams."
            estimatedTime="20-25 min"
            icon={<Users className="h-6 w-6" />}
            isCompleted={collaborationSubmitted}
            onStart={() => handleUnitStart('collaboration')}
            isDisabled={!stage3Completed && !adminBypass}
          />
        </div>

        {/* Mini Quiz (shown after both units completed) */}
        {canComplete && (
          <MiniQuiz
            title="Application Skills Check"
            questions={[
              {
                question: "What's the most important factor for successful project delivery?",
                options: [
                  "Perfect planning from the start",
                  "Continuous communication and adaptation", 
                  "The most expensive tools",
                  "Working overtime when needed"
                ],
                correctIndex: 1
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
                  id: 'project',
                  title: 'Project Management Mastery',
                  isCompleted: projectSubmitted,
                  xpEarned: 25
                },
                {
                  id: 'collaboration',
                  title: 'Advanced Team Collaboration',
                  isCompleted: collaborationSubmitted,
                  xpEarned: 25
                }
              ]}
              earnedXP={50}
              totalXP={50}
              canComplete={canComplete}
              onComplete={handleStageComplete}
              nextStageName="Midway Survey"
            />

            <XPSkillsRecap
              earnedXP={50}
              stageXP={50}
              className="mt-8"
            />

            <StageFeedback
              onSubmit={(feedback) => {
                console.log('Stage 4 Feedback:', feedback);
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
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
            </motion.div>
            <h3 className="text-xl font-semibold mb-2">Ready to Apply Your Skills?</h3>
            <p className="text-muted-foreground mb-6">
              Complete both application units to master practical skills for the workplace.
            </p>
            <div className="text-sm text-muted-foreground">
              Progress: {[projectSubmitted, collaborationSubmitted].filter(Boolean).length}/2 units completed
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
              Complete Stage 4 → Midway Survey
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
            quiz: { questions: [], xpReward: 25 },
            didYouKnow: { title: 'Did You Know?', content: getCurrentMLUData()?.didYouKnow || 'Interesting fact', xpReward: 5 },
            baseXP: 25,
            totalXP: 30
          }}
          stageXP={{ earned: 50, total: 50 }}
          onComplete={(earnedXP) => {
            if (activeUnit === 'project') handleProjectSubmit();
            if (activeUnit === 'collaboration') handleCollaborationSubmit();
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
              <Zap className="h-8 w-8 text-orange-500" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Complete Previous Stage</h3>
            <p className="text-muted-foreground mb-6">
              Finish Stage 3 (Technical Orientation) to unlock these application skills.
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