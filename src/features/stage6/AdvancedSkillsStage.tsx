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
import { DrawIOUnit } from '../stage3/units/DrawIOUnit';
import { VLCUnit } from '../stage3/units/VLCUnit';
import { Button } from '@/components/ui/button';
import { useLearningStore } from '@/lib/store';
import { useJourneyMachine } from '@/features/journey/journeyMachine';
import { useToast } from '@/hooks/use-toast';
import { stage3Content } from '../stage3/stage3.content';
import { isAdmin } from '@/lib/admin';
import { Wrench, PenTool, Play, Lightbulb, Trophy, Award, Zap, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';

export function AdvancedSkillsStage() {
  const {
    addXP,
    awardTrophy
  } = useLearningStore();
  const journeyState = useJourneyMachine();
  const {
    completeCurrentStage,
    goToStage,
    viewMode,
    isStageCompleted
  } = journeyState;
  const {
    toast
  } = useToast();

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
  const [showConfetti, setShowConfetti] = useState(false);
  const isPreviewMode = viewMode === 'preview-back';
  const canComplete = drawioSubmitted && vlcSubmitted;
  const adminBypass = isAdmin();
  const stage5Completed = isStageCompleted(5);
  const canAccessStage6 = stage5Completed || adminBypass;

  // Calculate total earned XP
  const earnedXP = (drawioSubmitted ? stage3Content.units.drawio.xpOnSubmit : 0) + (vlcSubmitted ? stage3Content.units.vlc.xpOnSubmit : 0) + earnedBonusXP;
  const handleDrawioSubmit = (earnedXP: number) => {
    setDrawioSubmitted(true);
    setShowMLUModal(false);
    setCurrentMLUData(null);
    toast({
      title: "Draw.io Unit Complete! 🎉",
      description: `+${earnedXP} XP earned!`
    });
  };
  const handleVlcSubmit = (earnedXP: number) => {
    setVlcSubmitted(true);
    setShowMLUModal(false);
    setCurrentMLUData(null);
    toast({
      title: "VLC Unit Complete! 🎉",
      description: `+${earnedXP} XP earned!`
    });
  };
  const handleBonusXPClaim = (amount: number) => {
    setEarnedBonusXP(prev => prev + amount);
    addXP(amount);
    toast({
      title: "Bonus XP! 💡",
      description: `+${amount} XP for your curiosity!`
    });
  };
  const handleStageComplete = () => {
    if (!canComplete && !adminBypass) return;

    // Show confetti celebration
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);

    // Award trophy for stage completion
    awardTrophy(6);

    // Complete stage and advance
    completeCurrentStage();
    goToStage(7);

    // Show completion toast
    toast({
      title: `🏆 Stage Complete! ${stage3Content.trophyOnComplete}`,
      description: "Ready for hands-on practice!"
    });
  };

  // Prepare units data for summary
  const units = [{
    id: 'drawio',
    title: stage3Content.units.drawio.title,
    isCompleted: drawioSubmitted,
    xpEarned: drawioSubmitted ? stage3Content.units.drawio.xpOnSubmit : undefined
  }, {
    id: 'vlc',
    title: stage3Content.units.vlc.title,
    isCompleted: vlcSubmitted,
    xpEarned: vlcSubmitted ? stage3Content.units.vlc.xpOnSubmit : undefined
  }];
  const handleUnitStart = (unitId: string) => {
    // Check if user can access Stage 6
    if (!canAccessStage6) {
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
        learningContent: [{
          type: 'text',
          content: 'Draw.io (now called diagrams.net) is a free, web-based diagramming tool that runs entirely in your browser. Unlike heavy desktop applications, it\'s instant, collaborative, and supports all the diagram types you\'ll need as an engineer.'
        }, {
          type: 'text',
          content: 'The core power of Draw.io lies in its extensive shape libraries. You have access to network diagrams, flowcharts, UML diagrams, electrical schematics, and custom shape sets. For RF and communication systems, you can easily create signal flow diagrams, block diagrams, and system architectures that clearly show how data moves through your designs.'
        }, {
          type: 'text',
          content: 'Key features that make Draw.io perfect for engineering work include: automatic connector routing (arrows that stay connected when you move shapes), layers for complex diagrams, collaborative real-time editing, and direct integration with cloud storage. You can embed diagrams in documentation, export to multiple formats, and even include mathematical notation.'
        }, {
          type: 'text',
          content: 'In real engineering projects, you\'ll use Draw.io for system architecture reviews, documenting signal processing chains, creating troubleshooting flowcharts, and explaining complex RF configurations to non-technical stakeholders. The ability to quickly sketch and share ideas visually is invaluable in fast-paced development environments.'
        }],
        tasks: [{
          type: 'text',
          content: 'Your mission: Create a professional RF communication system diagram that clearly shows how data flows from input to output. This practical exercise mirrors real-world documentation tasks you\'ll encounter in engineering roles.'
        }, {
          type: 'numbered-list',
          content: ['Open Draw.io (app.diagrams.net) and choose "Blank Diagram" - no account needed!', 'Create 5 system blocks using rectangles: Antenna, RF Front-End, ADC, DSP Processor, and Output', 'Connect them with directional arrows showing signal flow from left to right', 'Add descriptive labels to each arrow (e.g., "Analog RF Signal", "Digital Samples", "Processed Data")', 'Include a clear title at the top: "RF Communication System Architecture"', 'Use color coding: blue for analog signals, green for digital signals', 'Add a legend in the bottom corner explaining your color scheme', 'Export as PNG format ensuring the file size is under 10MB', 'Upload your completed diagram using the file upload field below']
        }],
        quiz: {
          questions: [{
            type: 'multiple-choice',
            question: 'Which Draw.io feature is most effective for showing signal direction and data flow in system diagrams?',
            options: ['Using different colored shapes only', 'Arrows with descriptive labels', 'Larger text fonts', 'Avoiding connectors entirely'],
            correctIndex: 1
          }, {
            type: 'multiple-choice',
            question: 'When sharing diagrams with your engineering team via Slack or email, which export format provides the best balance of quality and file size?',
            options: ['PNG (recommended)', 'RAW binary format', 'Executable (.EXE)', 'Raw binary (.BIN)'],
            correctIndex: 0
          }, {
            type: 'multiple-choice',
            question: 'What\'s the main advantage of using Draw.io templates over starting with a blank canvas?',
            options: ['Templates always look more professional', 'They provide standardized layouts and save time', 'Blank canvases don\'t support arrows', 'Templates are required for complex diagrams'],
            correctIndex: 1
          }, {
            type: 'file-upload',
            question: 'Upload your RF system diagram (PNG format, max 10MB). Make sure it includes all 5 components with clear signal flow arrows, labels, and a legend!'
          }],
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
        learningContent: [{
          type: 'text',
          content: 'VLC Media Player is built on a modular architecture that supports virtually every media format and streaming protocol. What makes it invaluable for engineers is its ability to display detailed codec information, stream statistics, and real-time analysis data that other players hide from users.'
        }, {
          type: 'text',
          content: 'The power of VLC for engineering work lies in its diagnostic capabilities. You can inspect H.264/H.265 encoding parameters, analyze bitrate fluctuations, examine streaming protocol headers, and even capture network streams for detailed analysis. The codec information panel reveals frame rates, resolution changes, audio sample rates, and compression artifacts that help identify communication issues.'
        }, {
          type: 'text',
          content: 'Key engineering features include: real-time stream statistics, network protocol analysis (RTSP, HTTP, UDP), codec parameter inspection, audio spectrum analysis, and the ability to play corrupted or incomplete files for forensic analysis. VLC can also capture screenshots at precise timestamps and log detailed playback information for troubleshooting reports.'
        }, {
          type: 'text',
          content: 'In communication systems projects, engineers use VLC to verify streaming implementations, debug codec configurations, analyze quality degradation in transmitted media, and test protocol compatibility. It\'s particularly valuable for validating video conferencing systems, broadcast equipment, and streaming media infrastructure before deployment.'
        }],
        tasks: [{
          type: 'text',
          content: 'Your mission: Explore VLC\'s advanced analysis features by examining a media file\'s technical properties and stream characteristics. This hands-on exercise will prepare you for real-world media debugging scenarios.'
        }, {
          type: 'numbered-list',
          content: ['Download and install VLC Media Player (if not already installed)', 'Open any video file in VLC (or use a sample file from your computer)', 'Access Tools → Codec Information to view detailed stream data', 'Navigate to Tools → Messages to see the debug console output', 'Open View → Audio Effects → Spectrometer to see real-time frequency analysis', 'Try Media → Open Network Stream and test with a live stream URL', 'Examine the bitrate and codec details in the information panel', 'Take a screenshot of the codec information window', 'Document your findings and upload the screenshot below']
        }],
        quiz: {
          questions: [{
            type: 'multiple-choice',
            question: 'Where in VLC can you find detailed codec information and stream statistics for engineering analysis?',
            options: ['View → Playlist menu only', 'Tools → Codec Information panel', 'Audio → Effects menu', 'Help → About section'],
            correctIndex: 1
          }, {
            type: 'multiple-choice',
            question: 'Which VLC feature is most valuable for engineers analyzing audio stream quality and frequency response?',
            options: ['Volume control', 'Audio Effects → Spectrometer', 'Subtitle settings', 'Playback speed adjustment'],
            correctIndex: 1
          }, {
            type: 'multiple-choice',
            question: 'What makes VLC particularly useful for debugging streaming protocols in communication systems?',
            options: ['It only plays local files', 'It can analyze network streams and show protocol details', 'It converts all files to MP4', 'It requires special codecs for each format'],
            correctIndex: 1
          }, {
            type: 'file-upload',
            question: 'Upload your screenshot of VLC\'s codec information panel (PNG format, max 10MB). Include the stream details and technical parameters visible!'
          }],
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
  return <div className="min-h-screen bg-background relative">
      {/* Confetti Effect */}
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} numberOfPieces={200} gravity={0.3} />}
      {/* Preview Banner */}
      {isPreviewMode && <CompletionBanner stageName="Advanced Skills" />}
      
      <div className="container mx-auto px-4 py-8 max-w-5xl" dir="ltr">
        {/* Stage Intro */}
        <StageIntro title="Advanced Skills — Expert-Level Mastery" description="Master advanced engineering techniques and specialized tools for complex system analysis." estimatedTime="~40–60 minutes total." xpTarget={30} icon={<Wrench className="h-8 w-8" />} />

        {/* Did You Know Box */}
        <AnimatePresence>
          {showDidYouKnow && <motion.div initial={{
          opacity: 0,
          y: -20
        }} animate={{
          opacity: 1,
          y: 0
        }} exit={{
          opacity: 0,
          y: -20
        }} className="mb-8">
              <DidYouKnowBox title="💡 Did You Know?" content="Draw.io was originally called 'Diagrams.net' and is completely free! Many engineers use it for system architecture because it runs entirely in your browser - no installation needed!" xpReward={5} onClose={() => setShowDidYouKnow(false)} onRewardClaim={() => handleBonusXPClaim(5)} />
            </motion.div>}
        </AnimatePresence>

        {/* Tool Cards Grid */}
        <div className="space-y-8 mb-8">
          {/* Helpful Tips Section */}
          <div className="flex flex-wrap gap-4 items-center justify-center">
            <InfoBadgeTip label="💡 Pro Tip" title="Learning Strategy" content="Complete units in order for the best learning experience. Each unit builds on knowledge from the previous one!" />
            <InfoBadgeTip label="⚡ XP Boost" title="Bonus Points" content="Look out for 'Did You Know?' boxes and mini-quizzes - they give bonus XP for curious learners!" />
          </div>

          {/* Draw.io Card */}
          <ToolCard id="drawio" icon={<PenTool className="h-8 w-8" />} title={stage3Content.units.drawio.title} objective={stage3Content.units.drawio.objective} estimatedTime={stage3Content.units.drawio.estimatedTime} xpReward={stage3Content.units.drawio.xpOnSubmit} isCompleted={drawioSubmitted} onStart={() => handleUnitStart('drawio')} toolLink="https://app.diagrams.net/" videoUrl="https://www.youtube.com/watch?v=Z0D96ZikMkc" />

          {/* VLC Card */}
          <ToolCard id="vlc" icon={<Play className="h-8 w-8" />} title={stage3Content.units.vlc.title} objective={stage3Content.units.vlc.objective} estimatedTime={stage3Content.units.vlc.estimatedTime} xpReward={stage3Content.units.vlc.xpOnSubmit} isCompleted={vlcSubmitted} onStart={() => handleUnitStart('vlc')} toolLink="https://www.videolan.org/vlc/" videoUrl="https://www.youtube.com/watch?v=example-vlc" />
        </div>

        {/* Mini Quiz - Appears after both units completed */}
        {canComplete && <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} className="mb-8">
            <MiniQuiz title="🧠 Quick Knowledge Check" questions={[{
            question: "What's the biggest advantage of using browser-based tools like Draw.io?",
            options: ["Better performance than desktop apps", "No installation required, instant collaboration", "They only work on mobile devices", "They cost less than desktop software"],
            correctIndex: 1,
            explanation: "Browser-based tools eliminate installation barriers and enable instant team collaboration!"
          }, {
            question: "Why is VLC valuable for engineering work beyond just playing videos?",
            options: ["It converts all video formats", "It provides detailed codec analysis and stream diagnostics", "It only works with engineering files", "It's faster than other media players"],
            correctIndex: 1,
            explanation: "VLC's diagnostic capabilities make it an essential tool for analyzing media streams and debugging communication protocols!"
          }]} onComplete={() => handleBonusXPClaim(8)} />
          </motion.div>}

        {/* Stage Summary - Shows when both units are completed */}
        {canComplete && <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} className="mb-8">
            <StageSummary title="🎯 Stage 6 Summary" completedUnits={units.filter(u => u.isCompleted)} totalXP={earnedXP} keyLearnings={["Professional diagram creation with Draw.io", "Advanced media analysis using VLC", "Browser-based tool collaboration", "Engineering diagnostic methodologies"]} nextSteps={["Apply these tools in real engineering scenarios", "Collaborate on team diagrams", "Use VLC for media troubleshooting"]} />
          </motion.div>}

        {/* Stage Feedback */}
        {canComplete && <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} className="mb-8">
            <StageFeedback stageNumber={6} onSubmit={setStageFeedback} />
          </motion.div>}

        {/* XP & Skills Recap */}
        {canComplete && <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} className="mb-8">
            <XPSkillsRecap currentXP={earnedXP} gainedSkills={["Advanced Tool Mastery", "Technical Communication", "System Visualization"]} />
          </motion.div>}

        {/* Final CTA */}
        {canComplete && <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} className="text-center mb-8">
            <Button onClick={handleStageComplete} size="lg" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 group">
              <span className="flex items-center space-x-2">
                <Trophy className="h-6 w-6" />
                <span>Continue to Next Stage →</span>
                <Zap className="h-5 w-5 group-hover:scale-110 transition-transform" />
              </span>
            </Button>
          </motion.div>}

        {/* Progress Indicator - Shows when units aren't completed yet */}
        {!canComplete && <div className="text-center text-muted-foreground">
            <p>Complete both units above to unlock the stage summary and advance to the next stage! 🚀</p>
          </div>}

        {/* MLU Modal */}
        <MLUModal isOpen={showMLUModal} onClose={() => {
        setShowMLUModal(false);
        setCurrentMLUData(null);
      }} data={currentMLUData} onSubmit={currentMLUData?.id === 'drawio' ? handleDrawioSubmit : handleVlcSubmit}>
          {currentMLUData?.id === 'drawio' && <DrawIOUnit isSubmitted={drawioSubmitted} onSubmit={() => handleDrawioSubmit(stage3Content.units.drawio.xpOnSubmit)} />}
          {currentMLUData?.id === 'vlc' && <VLCUnit isSubmitted={vlcSubmitted} onSubmit={() => handleVlcSubmit(stage3Content.units.vlc.xpOnSubmit)} />}
        </MLUModal>
      </div>
    </div>;
}