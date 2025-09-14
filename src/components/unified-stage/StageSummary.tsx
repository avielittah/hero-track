import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
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
  const progressPercentage = totalXP > 0 ? earnedXP / totalXP * 100 : 0;
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ delay: 0.4 }} 
      className={`sticky bottom-8 ${className}`}
    >
      <Card className="bg-card/95 backdrop-blur-sm border-2">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <h3 className="text-lg font-semibold">Stage Progress</h3>
              </div>
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                {completedUnits}/{units.length} Complete
              </Badge>
            </div>

            {/* Units Progress */}
            <div className="space-y-2">
              {units.map((unit) => (
                <div key={unit.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`h-4 w-4 ${unit.isCompleted ? 'text-green-500' : 'text-gray-300'}`} />
                    <span className={unit.isCompleted ? 'text-foreground' : 'text-muted-foreground'}>
                      {unit.title}
                    </span>
                  </div>
                  {unit.xpEarned && (
                    <Badge variant="outline" className="text-xs">
                      +{unit.xpEarned} XP
                    </Badge>
                  )}
                </div>
              ))}
            </div>

            {/* XP Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  XP Progress
                </span>
                <span>{earnedXP} / {totalXP}</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>

            {/* Action Button */}
            <Button
              onClick={onComplete}
              disabled={!canComplete}
              className="w-full"
              size="lg"
            >
              <ArrowRight className="h-4 w-4 mr-2" />
              {canComplete ? `Continue to ${nextStageName}` : `Complete remaining units`}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}