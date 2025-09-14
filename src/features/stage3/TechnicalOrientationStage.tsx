import { motion } from 'framer-motion';
import { CompletionBanner } from '@/components/CompletionBanner';
import { StageIntro } from '@/components/unified-stage/StageIntro';
import { ToolCard } from '@/components/unified-stage/ToolCard';
import { StageSummary } from '@/components/unified-stage/StageSummary';
import { DidYouKnowBox } from '@/components/unified-stage/DidYouKnowBox';
import { MiniQuiz } from '@/components/unified-stage/MiniQuiz';
import { TooltipTip, HelpTip, InfoBadgeTip } from '@/components/unified-stage/TooltipTip';
import { MLUModal } from '@/components/unified-stage/MLUModal';
import { StageFeedback } from '@/components/unified-stage/StageFeedback';
import { XPSkillsRecap } from '@/components/unified-stage/XPSkillsRecap';
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
  const [stageFeedback, setStageFeedback] = useState<any>(null);

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
        title: 'Visualizing Systems with Draw.io',
        subtitle: 'Turn complex ideas into clear diagrams.',
        estimatedTime: '~15 minutes',
        objective: 'Master the fundamentals of creating clear, professional system diagrams that communicate complex technical concepts effectively to engineering teams.',
        background: 'As a Communication Systems Engineer, you\'ll constantly need to visualize signal flows, system architectures, and data paths. Draw.io is a powerful, intuitive tool that helps you create professional diagrams quickly - whether you\'re explaining RF signal processing chains, network topologies, or system interfaces. Clear visual communication is essential for collaboration, documentation, and troubleshooting in engineering environments. Think of it as your visual language for complex technical concepts.',
        icon: <PenTool className="h-6 w-6" />,
        visual: {
          type: 'diagram',
          alt: 'RF Communication System: Antenna → RF Front-End → ADC → DSP Processor → Output',
          caption: 'Example: Professional RF Communication System Diagram'
        },
        video: {
          type: 'placeholder',
          title: 'Draw.io Mastery: From Beginner to Pro in 10 Minutes'
        },
        learningContent: [
          {
            type: 'text',
            content: 'Draw.io (now called diagrams.net) is a free, web-based diagramming tool that runs entirely in your browser. Unlike heavy desktop applications, it\'s instant, collaborative, and supports all the diagram types you\'ll need as an engineer.'
          },
          {
            type: 'text', 
            content: 'The core power of Draw.io lies in its extensive shape libraries. You have access to network diagrams, flowcharts, UML diagrams, electrical schematics, and custom shape sets. For RF and communication systems, you can easily create signal flow diagrams, block diagrams, and system architectures that clearly show how data moves through your designs.'
          },
          {
            type: 'text',
            content: 'Key features that make Draw.io perfect for engineering work include: automatic connector routing (arrows that stay connected when you move shapes), layers for complex diagrams, collaborative real-time editing, and direct integration with cloud storage. You can embed diagrams in documentation, export to multiple formats, and even include mathematical notation.'
          },
          {
            type: 'text',
            content: 'In real engineering projects, you\'ll use Draw.io for system architecture reviews, documenting signal processing chains, creating troubleshooting flowcharts, and explaining complex RF configurations to non-technical stakeholders. The ability to quickly sketch and share ideas visually is invaluable in fast-paced development environments.'
          }
        ],
        tasks: [
          {
            type: 'text',
            content: 'Your mission: Create a professional RF communication system diagram that clearly shows how data flows from input to output. This practical exercise mirrors real-world documentation tasks you\'ll encounter in engineering roles.'
          },
          {
            type: 'numbered-list',
            content: [
              'Open Draw.io (app.diagrams.net) and choose "Blank Diagram" - no account needed!',
              'Create 5 system blocks using rectangles: Antenna, RF Front-End, ADC, DSP Processor, and Output',
              'Connect them with directional arrows showing signal flow from left to right',
              'Add descriptive labels to each arrow (e.g., "Analog RF Signal", "Digital Samples", "Processed Data")',
              'Include a clear title at the top: "RF Communication System Architecture"',
              'Use color coding: blue for analog signals, green for digital signals',
              'Add a legend in the bottom corner explaining your color scheme',
              'Export as PNG format ensuring the file size is under 10MB',
              'Upload your completed diagram using the file upload field below'
            ]
          }
        ],
        quiz: {
          questions: [
            {
              type: 'multiple-choice',
              question: 'Which Draw.io feature is most effective for showing signal direction and data flow in system diagrams?',
              options: [
                'Using different colored shapes only',
                'Arrows with descriptive labels', 
                'Larger text fonts',
                'Avoiding connectors entirely'
              ],
              correctIndex: 1
            },
            {
              type: 'multiple-choice',
              question: 'When sharing diagrams with your engineering team via Slack or email, which export format provides the best balance of quality and file size?',
              options: [
                'PNG (recommended)',
                'RAW binary format',
                'Executable (.EXE)',
                'Raw binary (.BIN)'
              ],
              correctIndex: 0
            },
            {
              type: 'multiple-choice',
              question: 'What\'s the main advantage of using Draw.io templates over starting with a blank canvas?',
              options: [
                'Templates always look more professional',
                'They provide standardized layouts and save time',
                'Blank canvases don\'t support arrows',
                'Templates are required for complex diagrams'
              ],
              correctIndex: 1
            },
            {
              type: 'file-upload',
              question: 'Upload your RF system diagram (PNG format, max 10MB). Make sure it includes all 5 components with clear signal flow arrows, labels, and a legend!'
            }
          ],
          xpReward: 15
        },
        didYouKnow: {
          title: 'Integration Power-Up! 🚀',
          content: 'Did you know? Draw.io integrates seamlessly with Google Docs, Confluence, GitHub, and Microsoft Teams! You can embed live diagrams that automatically update when you modify the source file. This means your documentation always stays current with your designs. Pro tip: Save your diagrams to Google Drive for instant team sharing and version control. Many engineering teams use this for real-time collaborative system design sessions!',
          xpReward: 2
        },
        baseXP: 10,
        totalXP: 27
      });
    } else if (unitId === 'vlc') {
      setCurrentMLUData({
        id: 'vlc',
        title: 'Media & Stream Basics with VLC',
        subtitle: 'Analyze communication streams like a pro.',
        estimatedTime: '~15 minutes',
        objective: 'Master VLC Media Player as a powerful diagnostic tool for analyzing media streams, codecs, and communication protocols in engineering environments.',
        background: 'VLC isn\'t just a media player - it\'s a sophisticated analysis tool that engineers use to inspect media streams, debug codec issues, and understand communication protocols. As a Communication Systems Engineer, you\'ll encounter various media formats, streaming protocols, and codec configurations. VLC provides deep insights into these technologies, helping you troubleshoot streaming issues, analyze signal quality, and verify protocol implementations in real-world communication systems.',
        icon: <Play className="h-6 w-6" />,
        visual: {
          type: 'diagram',
          alt: 'VLC Stream Analysis: Input Stream → Codec Analysis → Quality Metrics → Output Visualization',
          caption: 'Example: VLC Stream Analysis Interface'
        },
        video: {
          type: 'placeholder',
          title: 'VLC Advanced Features: Stream Analysis & Codec Investigation'
        },
        learningContent: [
          {
            type: 'text',
            content: 'VLC Media Player is built on a modular architecture that supports virtually every media format and streaming protocol. What makes it invaluable for engineers is its ability to display detailed codec information, stream statistics, and real-time analysis data that other players hide from users.'
          },
          {
            type: 'text', 
            content: 'The power of VLC for engineering work lies in its diagnostic capabilities. You can inspect H.264/H.265 encoding parameters, analyze bitrate fluctuations, examine streaming protocol headers, and even capture network streams for detailed analysis. The codec information panel reveals frame rates, resolution changes, audio sample rates, and compression artifacts that help identify communication issues.'
          },
          {
            type: 'text',
            content: 'Key engineering features include: real-time stream statistics, network protocol analysis (RTSP, HTTP, UDP), codec parameter inspection, audio spectrum analysis, and the ability to play corrupted or incomplete files for forensic analysis. VLC can also capture screenshots at precise timestamps and log detailed playback information for troubleshooting reports.'
          },
          {
            type: 'text',
            content: 'In communication systems projects, engineers use VLC to verify streaming implementations, debug codec configurations, analyze quality degradation in transmitted media, and test protocol compatibility. It\'s particularly valuable for validating video conferencing systems, broadcast equipment, and streaming media infrastructure before deployment.'
          }
        ],
        tasks: [
          {
            type: 'text',
            content: 'Your mission: Explore VLC\'s advanced analysis features by examining a media file\'s technical properties and stream characteristics. This hands-on exercise will prepare you for real-world media debugging scenarios.'
          },
          {
            type: 'numbered-list',
            content: [
              'Download and install VLC Media Player (if not already installed)',
              'Open any video file in VLC (or use a sample file from your computer)',
              'Access Tools → Codec Information to view detailed stream data',
              'Navigate to Tools → Messages to see the debug console output',
              'Open View → Audio Effects → Spectrometer to see real-time frequency analysis',
              'Try Media → Open Network Stream and test with a live stream URL',
              'Examine the bitrate and codec details in the information panel',
              'Take a screenshot of the codec information window',
              'Document your findings and upload the screenshot below'
            ]
          }
        ],
        quiz: {
          questions: [
            {
              type: 'multiple-choice',
              question: 'Where in VLC can you find detailed codec information and stream statistics for engineering analysis?',
              options: [
                'View → Playlist menu only',
                'Tools → Codec Information panel', 
                'Audio → Effects menu',
                'Help → About section'
              ],
              correctIndex: 1
            },
            {
              type: 'multiple-choice',
              question: 'Which VLC feature is most valuable for engineers analyzing audio stream quality and frequency response?',
              options: [
                'Volume control',
                'Audio Effects → Spectrometer',
                'Subtitle settings',
                'Playback speed adjustment'
              ],
              correctIndex: 1
            },
            {
              type: 'multiple-choice',
              question: 'What makes VLC particularly useful for debugging streaming protocols in communication systems?',
              options: [
                'It only plays local files',
                'It can analyze network streams and show protocol details',
                'It converts all files to MP4',
                'It requires special codecs for each format'
              ],
              correctIndex: 1
            },
            {
              type: 'file-upload',
              question: 'Upload your screenshot of VLC\'s codec information panel (PNG format, max 10MB). Include the stream details and technical parameters visible!'
            }
          ],
          xpReward: 15
        },
        didYouKnow: {
          title: 'Stream Forensics Power! 🕵️',
          content: 'Did you know? VLC can play damaged, incomplete, or corrupted media files that other players reject! This makes it invaluable for forensic analysis of communication failures. Engineers use this feature to recover partial transmissions, analyze corrupted streams, and debug protocol implementations. VLC can even stream live content to multiple clients simultaneously, making it perfect for testing multicast scenarios in network deployments!',
          xpReward: 2
        },
        baseXP: 10,
        totalXP: 27
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

        {/* Stage Summary Section - Shows when at least one MLU is completed */}
        {(drawioSubmitted || vlcSubmitted) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-8 mb-8"
          >
            {/* Stage Summary */}
            <div className="bg-card border rounded-2xl p-6 space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                What You've Achieved {canComplete ? "" : "(Progress)"}
              </h2>
              <p className="text-muted-foreground">
                {canComplete 
                  ? "Congratulations! You've mastered two essential engineering tools that will support you throughout your practical projects. Draw.io will help you visualize complex systems and communicate your ideas clearly, while VLC's analysis capabilities will be invaluable for debugging and understanding media streams in communication systems."
                  : "Great progress! You're learning essential engineering tools that will support you throughout your practical projects. Keep going to master both Draw.io for system diagrams and VLC for media analysis."
                }
              </p>
              <p className="text-sm text-muted-foreground">
                These tools will be particularly important in the upcoming hands-on project where you'll design and implement 
                real communication systems.
              </p>
            </div>

            {/* Did You Know Boxes */}
            <div className="grid md:grid-cols-2 gap-4">
              <DidYouKnowBox
                title="🎯 Professional Impact"
                content="Engineers who document their work with clear diagrams are 40% more effective in team collaborations. The visual communication skills you've learned here will set you apart!"
                xpReward={3}
                onRewardClaim={() => handleBonusXPClaim(3)}
                onClose={() => {}}
              />
              <DidYouKnowBox
                title="🔧 Advanced Applications"
                content="VLC's stream analysis features are used by broadcast engineers worldwide to debug live transmission issues. You now have the same tools the professionals use!"
                xpReward={3}
                onRewardClaim={() => handleBonusXPClaim(3)}
                onClose={() => {}}
              />
            </div>

            {/* XP & Skills Recap */}
            <XPSkillsRecap 
              earnedXP={earnedXP}
              stageXP={stage3Content.xpTotalTarget}
            />

            {/* Stage Feedback - Shows when both MLUs completed */}
            {canComplete && !stageFeedback && (
              <StageFeedback
                onSubmit={(feedback) => {
                  setStageFeedback(feedback);
                  toast({
                    title: "Thanks for your feedback! 💙",
                    description: "Your input helps us improve the learning experience.",
                  });
                }}
              />
            )}

            {/* Stage CTA - Shows when both MLUs completed */}
            {canComplete && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
                className="text-center"
              >
                <Button
                  onClick={handleStageComplete}
                  disabled={!canComplete && !adminBypass}
                  size="lg"
                  className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white px-8 py-3 text-lg font-medium"
                >
                  Continue to Stage 4 — Hands-On Practice →
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  Ready to apply your skills in real projects!
                </p>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Original Stage Summary for incomplete state */}
        {!canComplete && !isPreviewMode && (
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