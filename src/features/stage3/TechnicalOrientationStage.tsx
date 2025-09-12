import { motion } from 'framer-motion';
import { CompletionBanner } from '@/components/CompletionBanner';
import { StageIntro } from '@/components/unified-stage/StageIntro';
import { ToolCard } from '@/components/unified-stage/ToolCard';
import { StageSummary } from '@/components/unified-stage/StageSummary';
import { DidYouKnowBox } from '@/components/unified-stage/DidYouKnowBox';
import { MiniQuiz } from '@/components/unified-stage/MiniQuiz';
import { TooltipTip, HelpTip, InfoBadgeTip } from '@/components/unified-stage/TooltipTip';
import { DrawIOUnit } from './units/DrawIOUnit';
import { VLCUnit } from './units/VLCUnit';
import { useLearningStore } from '@/lib/store';
import { useJourneyMachine } from '@/features/journey/journeyMachine';
import { useToast } from '@/hooks/use-toast';
import { stage3Content } from './stage3.content';
import { isAdmin } from '@/lib/admin';
import { Wrench, PenTool, Play, Lightbulb } from 'lucide-react';
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';

export function TechnicalOrientationStage() {
  const { addXP, awardTrophy } = useLearningStore();
  const journeyState = useJourneyMachine();
  const { completeCurrentStage, goToStage, viewMode } = journeyState;
  const { toast } = useToast();

  // Unit completion state
  const [drawioSubmitted, setDrawioSubmitted] = useState(false);
  const [vlcSubmitted, setVlcSubmitted] = useState(false);
  const [activeUnit, setActiveUnit] = useState<string | null>(null);
  const [showDidYouKnow, setShowDidYouKnow] = useState(true);
  const [earnedBonusXP, setEarnedBonusXP] = useState(0);

  const isPreviewMode = viewMode === 'preview-back';
  const canComplete = drawioSubmitted && vlcSubmitted;
  const adminBypass = isAdmin();
  
  // Calculate total earned XP
  const earnedXP = 
    (drawioSubmitted ? stage3Content.units.drawio.xpOnSubmit : 0) +
    (vlcSubmitted ? stage3Content.units.vlc.xpOnSubmit : 0) +
    earnedBonusXP;

  const handleDrawioSubmit = () => {
    setDrawioSubmitted(true);
    setActiveUnit(null);
    // Award XP and show toast
    addXP(stage3Content.units.drawio.xpOnSubmit);
    toast({
      title: "Draw.io Unit Complete! 🎉",
      description: `+${stage3Content.units.drawio.xpOnSubmit} XP earned!`,
    });
  };

  const handleVlcSubmit = () => {
    setVlcSubmitted(true);
    setActiveUnit(null);
    // Award XP and show toast
    addXP(stage3Content.units.vlc.xpOnSubmit);
    toast({
      title: "VLC Unit Complete! 🎉",
      description: `+${stage3Content.units.vlc.xpOnSubmit} XP earned!`,
    });
  };

  const handleBonusXPClaim = (amount: number) => {
    setEarnedBonusXP(prev => prev + amount);
    addXP(amount);
    toast({
      title: "Bonus XP! 💡",
      description: `+${amount} XP for your curiosity!`,
    });
  };

  const handleStageComplete = () => {
    if (!canComplete && !adminBypass) return;

    // Award trophy for stage completion
    awardTrophy(3);

    // Complete stage and advance
    completeCurrentStage();
    goToStage(4);

    // Show completion toast
    toast({
      title: `🏆 Stage Complete! ${stage3Content.trophyOnComplete}`,
      description: "Ready for hands-on practice!",
    });
  };

  // Prepare units data for summary
  const units = [
    {
      id: 'drawio',
      title: stage3Content.units.drawio.title,
      isCompleted: drawioSubmitted,
      xpEarned: drawioSubmitted ? stage3Content.units.drawio.xpOnSubmit : undefined
    },
    {
      id: 'vlc', 
      title: stage3Content.units.vlc.title,
      isCompleted: vlcSubmitted,
      xpEarned: vlcSubmitted ? stage3Content.units.vlc.xpOnSubmit : undefined
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Preview Banner */}
      {isPreviewMode && (
        <CompletionBanner stageName="Technical Orientation" />
      )}
      
      <div className="container mx-auto px-4 py-8 max-w-5xl" dir="ltr">
        {/* Stage Intro */}
        <StageIntro
          title={stage3Content.title}
          description={stage3Content.intro}
          estimatedTime={stage3Content.estTime}
          xpTarget={stage3Content.xpTotalTarget}
          icon={<Wrench className="h-8 w-8" />}
        />

        {/* Did You Know Box */}
        <AnimatePresence>
          {showDidYouKnow && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8"
            >
              <DidYouKnowBox
                title="💡 Did You Know?"
                content="Draw.io was originally called 'Diagrams.net' and is completely free! Many engineers use it for system architecture because it runs entirely in your browser - no installation needed!"
                xpReward={5}
                onClose={() => setShowDidYouKnow(false)}
                onRewardClaim={() => handleBonusXPClaim(5)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tool Cards Grid */}
        <div className="space-y-8 mb-8">
          {/* Helpful Tips Section */}
          <div className="flex flex-wrap gap-4 items-center justify-center">
            <InfoBadgeTip
              label="💡 Pro Tip"
              title="Learning Strategy"
              content="Complete units in order for the best learning experience. Each unit builds on knowledge from the previous one!"
            />
            <InfoBadgeTip
              label="⚡ XP Boost"
              title="Bonus Points"
              content="Look out for 'Did You Know?' boxes and mini-quizzes - they give bonus XP for curious learners!"
            />
            <InfoBadgeTip
              label="🎯 Quick Access"
              title="Tool Links"
              content="Click the 'Open Tool' buttons to access Draw.io and VLC directly in new tabs while learning."
            />
          </div>

          <ToolCard
            id="drawio"
            title={stage3Content.units.drawio.title}
            description={stage3Content.units.drawio.objective}
            estimatedTime={stage3Content.units.drawio.estimatedTime}
            icon={<PenTool className="h-6 w-6" />}
            isCompleted={drawioSubmitted}
            videoUrl={stage3Content.units.drawio.videoUrl}
            toolLink={stage3Content.units.drawio.toolLink}
            onStart={() => setActiveUnit('drawio')}
            isDisabled={isPreviewMode && !drawioSubmitted}
          />

          <ToolCard
            id="vlc"
            title={stage3Content.units.vlc.title}
            description={stage3Content.units.vlc.objective}
            estimatedTime={stage3Content.units.vlc.estimatedTime}
            icon={<Play className="h-6 w-6" />}
            isCompleted={vlcSubmitted}
            videoUrl={stage3Content.units.vlc.videoUrl}
            toolLink={stage3Content.units.vlc.toolLink}
            onStart={() => setActiveUnit('vlc')}
            isDisabled={isPreviewMode && !vlcSubmitted}
          />
        </div>

        {/* Mini Quiz */}
        {(drawioSubmitted || vlcSubmitted) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <MiniQuiz
              title="🧠 Quick Knowledge Check"
              questions={[
                {
                  question: "Which tool is best for creating system diagrams?",
                  options: ["VLC Media Player", "Draw.io", "Microsoft Word", "Calculator"],
                  correctIndex: 1
                },
                {
                  question: "What is VLC primarily used for by engineers?",
                  options: ["Creating diagrams", "Stream analysis", "Text editing", "File compression"],
                  correctIndex: 1
                }
              ]}
              xpReward={10}
              onComplete={(score) => {
                const earnedXP = score > 0 ? 10 : 5; // Bonus for any correct answers
                handleBonusXPClaim(earnedXP);
              }}
            />
          </motion.div>
        )}

        {/* Active Unit Modal/Content */}
        <AnimatePresence>
          {activeUnit === 'drawio' && !isPreviewMode && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 overflow-y-auto"
            >
              <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="bg-card rounded-2xl border-2 p-6">
                  <DrawIOUnit
                    isSubmitted={drawioSubmitted}
                    onSubmit={handleDrawioSubmit}
                  />
                  <div className="mt-6 text-center">
                    <button
                      onClick={() => setActiveUnit(null)}
                      className="text-muted-foreground hover:text-foreground underline"
                    >
                      ← Back to Stage Overview
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeUnit === 'vlc' && !isPreviewMode && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 overflow-y-auto"
            >
              <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="bg-card rounded-2xl border-2 p-6">
                  <VLCUnit
                    isSubmitted={vlcSubmitted}
                    onSubmit={handleVlcSubmit}
                  />
                  <div className="mt-6 text-center">
                    <button
                      onClick={() => setActiveUnit(null)}
                      className="text-muted-foreground hover:text-foreground underline"
                    >
                      ← Back to Stage Overview
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stage Summary */}
        {!isPreviewMode && (
          <StageSummary
            units={units}
            earnedXP={earnedXP}
            totalXP={stage3Content.xpTotalTarget}
            canComplete={canComplete || adminBypass}
            onComplete={handleStageComplete}
            nextStageName="Hands-On Practice"
          />
        )}
      </div>
    </div>
  );
}