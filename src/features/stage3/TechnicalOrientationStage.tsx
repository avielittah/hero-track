import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CompletionBanner } from '@/components/CompletionBanner';
import { ToolUnitCard } from './ToolUnitCard';
import { DrawIOUnit } from './units/DrawIOUnit';
import { VLCUnit } from './units/VLCUnit';
import { useLearningStore } from '@/lib/store';
import { useJourneyMachine } from '@/features/journey/journeyMachine';
import { useToast } from '@/hooks/use-toast';
import { stage3Content } from './stage3.content';
import { isAdmin } from '@/lib/admin';
import { Clock, Lightbulb, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

export function TechnicalOrientationStage() {
  const { addXP, awardTrophy } = useLearningStore();
  const journeyState = useJourneyMachine();
  const { completeCurrentStage, goToStage, viewMode } = journeyState;
  const { toast } = useToast();

  // Unit completion state
  const [drawioSubmitted, setDrawioSubmitted] = useState(false);
  const [vlcSubmitted, setVlcSubmitted] = useState(false);

  const isPreviewMode = viewMode === 'preview-back';
  const canComplete = drawioSubmitted && vlcSubmitted;
  const adminBypass = isAdmin();

  const handleDrawioSubmit = () => {
    setDrawioSubmitted(true);
  };

  const handleVlcSubmit = () => {
    setVlcSubmitted(true);
  };

  const handleStageComplete = () => {
    if (!canComplete && !adminBypass) return;

    // Calculate total XP from submitted units
    let totalXP = 0;
    if (drawioSubmitted) totalXP += stage3Content.units.drawio.xpOnSubmit;
    if (vlcSubmitted) totalXP += stage3Content.units.vlc.xpOnSubmit;

    // Award XP and trophy
    addXP(totalXP);
    awardTrophy(3); // Stage 3 trophy

    // Complete stage and advance
    completeCurrentStage();
    goToStage(4);

    // Show completion toast
    toast({
      title: stage3Content.toastDone.replace('{{xp}}', totalXP.toString()),
      description: `🏆 Trophy earned: ${stage3Content.trophyOnComplete}`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Preview Banner */}
      {isPreviewMode && (
        <CompletionBanner stageName="Technical Orientation" />
      )}
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6 mb-8"
        >
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-foreground">
              {stage3Content.title}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {stage3Content.intro}
            </p>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {stage3Content.estTime}
              </div>
              <Badge variant="outline">
                Target: {stage3Content.xpTotalTarget} XP
              </Badge>
            </div>
          </div>
        </motion.div>

        <Separator className="mb-8" />

        {/* Tool Units */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="space-y-6 mb-8"
        >
          {/* Instructions */}
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              How to complete this stage:
            </h3>
            <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>1. Click "Start Learning" on each unit below</li>
              <li>2. Watch tutorials and complete the activities</li>
              <li>3. Submit your work to earn XP</li>
              <li>4. Complete both units to advance</li>
            </ol>
          </div>

          {/* Draw.io Unit */}
          <ToolUnitCard
            id="drawio"
            title={stage3Content.units.drawio.title}
            objective={stage3Content.units.drawio.objective}
            estimatedTime={stage3Content.units.drawio.estimatedTime}
            videoUrl={stage3Content.units.drawio.videoUrl}
            toolLink={stage3Content.units.drawio.toolLink}
            isSubmitted={drawioSubmitted}
            isDisabled={isPreviewMode && !drawioSubmitted}
          >
            <DrawIOUnit
              isSubmitted={drawioSubmitted}
              onSubmit={handleDrawioSubmit}
            />
          </ToolUnitCard>

          {/* VLC Unit */}
          <ToolUnitCard
            id="vlc"
            title={stage3Content.units.vlc.title}
            objective={stage3Content.units.vlc.objective}
            estimatedTime={stage3Content.units.vlc.estimatedTime}
            videoUrl={stage3Content.units.vlc.videoUrl}
            toolLink={stage3Content.units.vlc.toolLink}
            isSubmitted={vlcSubmitted}
            isDisabled={isPreviewMode && !vlcSubmitted}
          >
            <VLCUnit
              isSubmitted={vlcSubmitted}
              onSubmit={handleVlcSubmit}
            />
          </ToolUnitCard>
        </motion.div>

        {/* Buddy Nudge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8 p-4 bg-primary/5 rounded-lg border border-primary/20"
        >
          <div className="flex items-start gap-3">
            <Lightbulb className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {stage3Content.buddyNudge}
              </p>
              <Button
                variant="link"
                size="sm"
                asChild
                className="h-auto p-0 text-primary"
              >
                <a 
                  href={import.meta.env.VITE_BUDDY_URL || '#'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Ask Buddy →
                </a>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stage Completion */}
        {!isPreviewMode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="sticky bottom-8 pt-6"
          >
            <div className="bg-background/95 backdrop-blur-sm rounded-lg border shadow-lg p-6">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="font-semibold">Ready to continue?</h3>
                  <p className="text-sm text-muted-foreground">
                    Complete both units to advance to hands-on practice
                  </p>
                </div>
                
                <Button
                  onClick={handleStageComplete}
                  disabled={!canComplete && !adminBypass}
                  size="lg"
                  className="shrink-0"
                >
                  {stage3Content.ctaComplete}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
              
              {!canComplete && !adminBypass && (
                <div className="mt-4 text-xs text-muted-foreground">
                  Progress: {[drawioSubmitted, vlcSubmitted].filter(Boolean).length}/2 units completed
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}