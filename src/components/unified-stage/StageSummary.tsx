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
  const progressPercentage = totalXP > 0 ? earnedXP / totalXP * 100 : 0;
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    delay: 0.4
  }} className={`sticky bottom-8 ${className}`}>
      
    </motion.div>;
}