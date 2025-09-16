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
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    delay: 0.2
  }} className={`${className}`}>
      <Card>
        
        
      </Card>
    </motion.div>;
}