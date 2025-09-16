import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Trophy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { orientation1Content } from './orientation1.content';

interface CompletionSummaryProps {
  checkedTasks: Record<string, boolean>;
}

export const CompletionSummary = ({ checkedTasks }: CompletionSummaryProps) => {
  const requiredTasks = orientation1Content.tasks.filter(task => task.required);
  const optionalTasks = orientation1Content.tasks.filter(task => !task.required);
  
  const completedRequired = requiredTasks.filter(task => checkedTasks[task.id]).length;
  const completedOptional = optionalTasks.filter(task => checkedTasks[task.id]).length;
  
  const totalXP = orientation1Content.tasks
    .filter(task => checkedTasks[task.id])
    .reduce((sum, task) => sum + task.xp, 0);

  const allRequiredComplete = completedRequired === requiredTasks.length;

  return (
    <motion.div
      className="bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-sm rounded-2xl border-2 shadow-lg p-6 w-full max-w-md"
      initial={{ x: 30, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
        <Trophy className="h-5 w-5 mr-2 text-secondary" />
        Progress Summary
      </h3>

      <div className="space-y-4">
        {/* Required Tasks */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Required:</span>
          <div className="flex items-center space-x-2">
            {allRequiredComplete ? (
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            ) : (
              <Circle className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="text-sm font-medium">
              {completedRequired}/{requiredTasks.length}
            </span>
          </div>
        </div>

        {/* Optional Tasks */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Optional:</span>
          <div className="flex items-center space-x-2">
            <Circle className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              {completedOptional}/{optionalTasks.length}
            </span>
          </div>
        </div>

        {/* XP Progress */}
        <div className="pt-2 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">XP Earned:</span>
            <Badge variant="secondary" className="font-semibold">
              {totalXP} XP
            </Badge>
          </div>
        </div>

        {/* Status */}
        <div className="pt-2">
          {allRequiredComplete ? (
            <div className="text-center">
              <Badge variant="default" className="bg-green-600 text-white">
                ✅ Ready to Continue
              </Badge>
            </div>
          ) : (
            <div className="text-center">
              <Badge variant="outline">
                {requiredTasks.length - completedRequired} required remaining
              </Badge>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};