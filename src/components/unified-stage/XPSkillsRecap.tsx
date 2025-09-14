import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Zap, TrendingUp, Award } from 'lucide-react';
import { skillProgress } from '@/lib/skillProgress';
import { useLearningStore } from '@/lib/store';

interface XPSkillsRecapProps {
  earnedXP: number;
  stageXP: number;
  className?: string;
}

export function XPSkillsRecap({ earnedXP, stageXP, className = "" }: XPSkillsRecapProps) {
  const { getCurrentLevelIndex, getXPProgressInCurrentLevel } = useLearningStore();
  
  const levelIndex = getCurrentLevelIndex();
  const { current, max, percentage } = getXPProgressInCurrentLevel();
  const skills = skillProgress(levelIndex);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className={`${className}`}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            XP & Skills Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* XP Summary */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Stage XP Earned</span>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                +{earnedXP} / {stageXP} XP
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Level Progress</span>
                <span className="text-muted-foreground">
                  {current} / {max} XP
                </span>
              </div>
              <Progress value={percentage} className="h-2" />
            </div>
          </div>

          {/* Skills Progress */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Skill Development</span>
            </div>
            
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Training Familiarity</span>
                  <span className="text-muted-foreground">{skills.trainingFamiliarity}%</span>
                </div>
                <Progress value={skills.trainingFamiliarity} className="h-1.5" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Content Mastery</span>
                  <span className="text-muted-foreground">{skills.contentMastery}%</span>
                </div>
                <Progress value={skills.contentMastery} className="h-1.5" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Applied Proficiency</span>
                  <span className="text-muted-foreground">{skills.appliedProficiency}%</span>
                </div>
                <Progress value={skills.appliedProficiency} className="h-1.5" />
              </div>
            </div>
          </div>

          {/* Achievements Hint */}
          <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
            <Award className="h-4 w-4 text-primary" />
            <div className="text-sm">
              <span className="font-medium">Keep going!</span> Your skills are developing with each completed stage.
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}