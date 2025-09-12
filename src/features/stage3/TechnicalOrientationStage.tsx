import { motion } from 'framer-motion';
import { CompletionBanner } from '@/components/CompletionBanner';
import { StageIntro } from '@/components/unified-stage/StageIntro';
import { ToolCard } from '@/components/unified-stage/ToolCard';
import { StageSummary } from '@/components/unified-stage/StageSummary';
import { DidYouKnowBox } from '@/components/unified-stage/DidYouKnowBox';
import { MiniQuiz } from '@/components/unified-stage/MiniQuiz';
import { TooltipTip, HelpTip, InfoBadgeTip } from '@/components/unified-stage/TooltipTip';
import { MLUModal } from '@/components/unified-stage/MLUModal';
import { DrawIOUnit } from './units/DrawIOUnit';
import { VLCUnit } from './units/VLCUnit';
import { Button } from '@/components/ui/button';
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
  const { completeCurrentStage, goToStage, viewMode, isStageCompleted } = journeyState;
  const { toast } = useToast();

  // Unit completion state
  const [drawioSubmitted, setDrawioSubmitted] = useState(false);
  const [vlcSubmitted, setVlcSubmitted] = useState(false);
  const [activeUnit, setActiveUnit] = useState<string | null>(null);
  const [showDidYouKnow, setShowDidYouKnow] = useState(true);
  const [earnedBonusXP, setEarnedBonusXP] = useState(0);
  const [showMLUModal, setShowMLUModal] = useState(false);
  const [currentMLUData, setCurrentMLUData] = useState<any>(null);
  const [showLockModal, setShowLockModal] = useState(false);

  const isPreviewMode = viewMode === 'preview-back';
  const canComplete = drawioSubmitted && vlcSubmitted;
  const adminBypass = isAdmin();
  const stage2Completed = isStageCompleted(2);
  const canAccessStage3 = stage2Completed || adminBypass;
  
  // Calculate total earned XP
  const earnedXP = 
    (drawioSubmitted ? stage3Content.units.drawio.xpOnSubmit : 0) +
    (vlcSubmitted ? stage3Content.units.vlc.xpOnSubmit : 0) +
    earnedBonusXP;

  const handleDrawioSubmit = (earnedXP: number) => {
    setDrawioSubmitted(true);
    setShowMLUModal(false);
    setCurrentMLUData(null);
    toast({
      title: "Draw.io Unit Complete! 🎉",
      description: `+${earnedXP} XP earned!`,
    });
  };

  const handleVlcSubmit = (earnedXP: number) => {
    setVlcSubmitted(true);
    setShowMLUModal(false);
    setCurrentMLUData(null);
    toast({
      title: "VLC Unit Complete! 🎉",
      description: `+${earnedXP} XP earned!`,
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

  const handleUnitStart = (unitId: string) => {
    // Check if user can access Stage 3
    if (!canAccessStage3) {
      setShowLockModal(true);
      return;
    }
    if (unitId === 'drawio') {
      setCurrentMLUData({
        id: 'drawio',
        title: 'Draw.io Diagrams',
        subtitle: 'Master visual communication for engineering systems',
        estimatedTime: '~15 min',
        objective: stage3Content.units.drawio.objective,
        background: stage3Content.units.drawio.background,
        icon: <PenTool className="h-6 w-6" />,
        visual: {
          type: 'diagram',
          alt: 'System architecture flow diagram',
          caption: 'Sample Draw.io Diagram'
        },
        video: {
          type: 'placeholder',
          title: 'Draw.io Tutorial Video',
          url: stage3Content.units.drawio.videoUrl
        },
        tasks: [
          {
            type: 'bullet-list',
            content: stage3Content.units.drawio.tasks || [
              'Open Draw.io in your browser',
              'Create a simple system diagram',
              'Export your diagram as PNG',
              'Submit your work below'
            ]
          }
        ],
        quiz: {
          questions: [
            {
              type: 'multiple-choice',
              question: 'What is Draw.io primarily used for?',
              options: ['Creating diagrams', 'Video editing', 'Text processing', 'File compression'],
              correctIndex: 0
            },
            {
              type: 'open-question',
              question: 'Describe one advantage of using Draw.io for engineering documentation.'
            },
            {
              type: 'file-upload',
              question: 'Upload your Draw.io diagram (PNG format)'
            }
          ],
          xpReward: 15
        },
        didYouKnow: {
          title: '💡 Pro Tip',
          content: 'Draw.io can automatically save your diagrams to Google Drive, OneDrive, or GitHub! This makes collaboration with your team super easy.',
          xpReward: 5
        },
        baseXP: stage3Content.units.drawio.xpOnSubmit,
        totalXP: stage3Content.units.drawio.xpOnSubmit + 15 + 5
      });
    } else if (unitId === 'vlc') {
      setCurrentMLUData({
        id: 'vlc',
        title: 'VLC Media Player',
        subtitle: 'Analyze communication streams like a pro',
        estimatedTime: '~12 min',
        objective: stage3Content.units.vlc.objective,
        background: stage3Content.units.vlc.background,
        icon: <Play className="h-6 w-6" />,
        visual: {
          type: 'placeholder',
          alt: 'VLC interface showing stream analysis',
          caption: 'VLC Stream Analysis Interface'
        },
        video: {
          type: 'placeholder',
          title: 'VLC Advanced Features',
          url: stage3Content.units.vlc.videoUrl
        },
        tasks: [
          {
            type: 'numbered-list',
            content: stage3Content.units.vlc.tasks || [
              'Download and install VLC Media Player',
              'Open a sample audio/video file',
              'Explore the codec information panel',
              'Try the spectrum analyzer feature'
            ]
          }
        ],
        quiz: {
          questions: [
            {
              type: 'multiple-choice',
              question: 'What makes VLC special for engineers?',
              options: ['Only plays videos', 'Shows detailed codec info', 'Edits videos', 'Compresses files'],
              correctIndex: 1
            },
            {
              type: 'open-question',
              question: 'What information can you learn about a media file using VLC?'
            }
          ],
          xpReward: 12
        },
        didYouKnow: {
          title: '🎵 Fun Fact',
          content: 'VLC can play almost any media format without additional codec downloads! It even works with damaged or incomplete files.',
          xpReward: 3
        },
        baseXP: stage3Content.units.vlc.xpOnSubmit,
        totalXP: stage3Content.units.vlc.xpOnSubmit + 12 + 3
      });
    }
    setShowMLUModal(true);
  };

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
            onStart={() => handleUnitStart('drawio')}
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
            onStart={() => handleUnitStart('vlc')}
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

        {/* Stage Lock Modal */}
        <AnimatePresence>
          {showLockModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              onClick={() => setShowLockModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-card rounded-2xl border-2 p-8 max-w-md w-full text-center space-y-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="mx-auto w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold">Stage Locked 🔒</h3>
                  <p className="text-muted-foreground">
                    Please complete <strong>Stage 2 (Orientation Checklist)</strong> before starting Stage 3.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    This ensures you have the foundation needed for technical training!
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowLockModal(false)}
                    className="flex-1"
                  >
                    Stay Here
                  </Button>
                  <Button
                    onClick={() => {
                      setShowLockModal(false);
                      goToStage(2);
                    }}
                    className="flex-1 bg-gradient-to-r from-primary to-primary-700"
                  >
                    Go to Stage 2 →
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MLU Modal */}
        {showMLUModal && currentMLUData && (
          <MLUModal
            isOpen={showMLUModal}
            onClose={() => {
              setShowMLUModal(false);
              setCurrentMLUData(null);
            }}
            unitData={currentMLUData}
            stageXP={{
              earned: earnedXP,
              total: stage3Content.xpTotalTarget
            }}
            onComplete={currentMLUData.id === 'drawio' ? handleDrawioSubmit : handleVlcSubmit}
            isCompleted={currentMLUData.id === 'drawio' ? drawioSubmitted : vlcSubmitted}
          />
        )}

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