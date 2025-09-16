import React from 'react';
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

export function XPSkillsRecap({
  earnedXP,
  stageXP,
  className = ""
}: XPSkillsRecapProps) {
  const {
    getCurrentLevelIndex,
    getXPProgressInCurrentLevel
  } = useLearningStore();

  const levelIndex = getCurrentLevelIndex();
  const {
    current,
    max,
    percentage
  } = getXPProgressInCurrentLevel();

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
            <Award className="h-5 w-5 text-primary" />
            Skills Progress & XP Recap
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* XP Progress */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 font-medium">
                <Zap className="h-4 w-4 text-yellow-500" />
                Current Level Progress
              </span>
              <span className="text-sm text-muted-foreground">
                {current} / {max} XP
              </span>
            </div>
            <Progress value={percentage} className="h-2" />
            <Badge variant="outline" className="bg-primary/10">
              +{earnedXP} XP earned this stage
            </Badge>
          </div>

          {/* Skills Progress */}
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              Skill Development
            </h4>
            
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Training Familiarity</span>
                  <span>{skills.trainingFamiliarity}%</span>
                </div>
                <Progress value={skills.trainingFamiliarity} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Content Mastery</span>
                  <span>{skills.contentMastery}%</span>
                </div>
                <Progress value={skills.contentMastery} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Applied Proficiency</span>
                  <span>{skills.appliedProficiency}%</span>
                </div>
                <Progress value={skills.appliedProficiency} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}