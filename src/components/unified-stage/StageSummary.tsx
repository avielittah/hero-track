import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, ArrowRight, Trophy, Zap } from 'lucide-react';

interface Unit {
  id: string;
  title: string;
  isCompleted: boolean;
  xpEarned?: number;
}

interface StageSummaryProps {
  units: Unit[];
  earnedXP: number;
  totalXP: number;
  canComplete: boolean;
  onComplete: () => void;
  nextStageName?: string;
  className?: string;
}

export function StageSummary({
  units,
  earnedXP,
  totalXP,
  canComplete,
  onComplete,
  nextStageName = "Next Stage",
  className = ""
}: StageSummaryProps) {
  const completedUnits = units.filter(unit => unit.isCompleted).length;
  const progressPercentage = totalXP > 0 ? (earnedXP / totalXP) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className={`sticky bottom-8 ${className}`}
    >
      <div className="bg-background/95 backdrop-blur-sm rounded-2xl border-2 border-border shadow-2xl p-6">
        {/* Stage Progress Header */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-foreground">Stage Progress</h3>
            <Badge variant="outline" className="bg-primary/10 border-primary/30">
              <Trophy className="h-3 w-3 mr-1" />
              {earnedXP}/{totalXP} XP
            </Badge>
          </div>

          {/* XP Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Experience Points</span>
              <span className="font-medium">{Math.round(progressPercentage)}% Complete</span>
            </div>
            <Progress 
              value={progressPercentage} 
              className="h-3 bg-muted [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-secondary transition-all duration-500"
            />
          </div>
        </div>

        {/* Units Checklist */}
        <div className="space-y-3 mb-6">
          <h4 className="font-medium text-muted-foreground text-sm uppercase tracking-wide">
            Micro-Learning Units
          </h4>
          <div className="grid gap-2">
            {units.map((unit, index) => (
              <motion.div
                key={unit.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`
                  flex items-center gap-3 p-3 rounded-xl border transition-all duration-300
                  ${unit.isCompleted 
                    ? 'bg-journey-complete/10 border-journey-complete/30' 
                    : 'bg-muted/50 border-border'
                  }
                `}
              >
                <div className={`
                  flex items-center justify-center w-6 h-6 rounded-full transition-all duration-300
                  ${unit.isCompleted 
                    ? 'bg-journey-complete text-white' 
                    : 'bg-muted border-2 border-border'
                  }
                `}>
                  {unit.isCompleted ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <span className="text-xs font-medium">{index + 1}</span>
                  )}
                </div>
                
                <span className={`
                  flex-1 text-sm font-medium
                  ${unit.isCompleted ? 'text-foreground' : 'text-muted-foreground'}
                `}>
                  {unit.title}
                </span>
                
                {unit.isCompleted && unit.xpEarned && (
                  <Badge variant="outline" className="text-xs bg-primary/10 border-primary/30">
                    <Zap className="h-3 w-3 mr-1" />
                    +{unit.xpEarned} XP
                  </Badge>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Agent Encouragement */}
        <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🚀</span>
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">
                {canComplete 
                  ? "Amazing work! You've mastered all the tools in this stage." 
                  : `Great progress! ${completedUnits}/${units.length} units completed.`
                }
              </p>
              <p className="text-xs text-muted-foreground">
                {canComplete 
                  ? "Ready to put your new skills into practice?" 
                  : "Keep going to unlock the next stage!"
                }
              </p>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <Button
          onClick={onComplete}
          disabled={!canComplete}
          size="lg"
          className={`
            w-full relative overflow-hidden transition-all duration-300
            ${canComplete 
              ? 'bg-gradient-to-r from-primary to-secondary hover:from-primary-700 hover:to-secondary shadow-lg hover:shadow-xl' 
              : 'bg-muted text-muted-foreground cursor-not-allowed'
            }
          `}
        >
          {canComplete ? (
            <>
              Continue to {nextStageName}
              <ArrowRight className="h-4 w-4 ml-2" />
            </>
          ) : (
            <>
              Complete {units.length - completedUnits} more unit{units.length - completedUnits !== 1 ? 's' : ''}
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
}