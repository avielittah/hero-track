import { Badge } from '@/components/ui/badge';
import { Lock, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PrerequisiteBadgeProps {
  prerequisites: string[];
  completedPrerequisites: string[];
  nodeMap: Map<string, { title: string }>;
}

export const PrerequisiteBadge = ({ 
  prerequisites, 
  completedPrerequisites,
  nodeMap 
}: PrerequisiteBadgeProps) => {
  const allCompleted = prerequisites.every(id => completedPrerequisites.includes(id));
  const completedCount = prerequisites.filter(id => completedPrerequisites.includes(id)).length;
  
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Lock className="w-3 h-3 text-muted-foreground" />
        <span className="text-xs font-medium text-muted-foreground">
          Prerequisites Required:
        </span>
        <Badge 
          variant={allCompleted ? "default" : "secondary"}
          className={cn(
            "text-xs",
            allCompleted && "bg-green-500/10 text-green-600 border-green-200"
          )}
        >
          {completedCount}/{prerequisites.length}
        </Badge>
      </div>
      
      <div className="space-y-1 pl-5">
        {prerequisites.map(prereqId => {
          const isCompleted = completedPrerequisites.includes(prereqId);
          const prereqNode = nodeMap.get(prereqId);
          
          return (
            <div 
              key={prereqId}
              className={cn(
                "flex items-center gap-2 text-xs",
                isCompleted ? "text-green-600" : "text-muted-foreground"
              )}
            >
              {isCompleted ? (
                <CheckCircle2 className="w-3 h-3" />
              ) : (
                <Lock className="w-3 h-3" />
              )}
              <span>{prereqNode?.title || prereqId}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
