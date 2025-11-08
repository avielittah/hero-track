import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Youtube, 
  FileText, 
  Link2, 
  BookOpen,
  ExternalLink,
  ChevronDown,
  Clock,
  Zap
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { LearningNode, NodeProgress, ProgressStatus, DifficultyLevel } from '@/types/learning';
import { ProgressIndicator } from './ProgressIndicator';
import { PrerequisiteBadge } from './PrerequisiteBadge';

interface NodeCardProps {
  node: LearningNode;
  index: number;
  depth?: number;
  status: ProgressStatus;
  isRecommended?: boolean;
  progress: Record<string, NodeProgress>;
  allNodes: Map<string, LearningNode>;
  onVisit: (nodeId: string) => void;
  onStatusChange?: (nodeId: string, status: ProgressStatus) => void;
}

export const NodeCard = ({ 
  node, 
  index, 
  depth = 0,
  status,
  isRecommended = false,
  progress,
  allNodes,
  onVisit,
  onStatusChange
}: NodeCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const isLocked = status === 'locked';
  const isCompleted = status === 'completed';
  
  // Auto-expand if recommended or has in-progress children
  useEffect(() => {
    if (isRecommended && node.children) {
      setExpanded(true);
    }
  }, [isRecommended, node.children]);
  
  const getIcon = () => {
    switch (node.type) {
      case 'youtube':
        return <Youtube className="w-4 h-4" />;
      case 'article':
        return <FileText className="w-4 h-4" />;
      case 'resource':
        return <Link2 className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  const getTypeColor = () => {
    switch (node.type) {
      case 'youtube':
        return 'bg-red-500/10 text-red-600 border-red-200 dark:border-red-900';
      case 'article':
        return 'bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-900';
      case 'resource':
        return 'bg-green-500/10 text-green-600 border-green-200 dark:border-green-900';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getDifficultyColor = (difficulty?: DifficultyLevel) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-500/10 text-green-600 border-green-200';
      case 'intermediate':
        return 'bg-yellow-500/10 text-yellow-600 border-yellow-200';
      case 'advanced':
        return 'bg-red-500/10 text-red-600 border-red-200';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const handleClick = () => {
    if (isLocked) {
      // Don't allow interaction with locked nodes
      return;
    }

    if (node.children && node.children.length > 0) {
      setExpanded(!expanded);
    } else {
      onVisit(node.id);
      if (status === 'available') {
        onStatusChange?.(node.id, 'in-progress');
      }
      window.open(node.url, '_blank');
    }
  };

  const completedPrerequisites = node.prerequisites?.filter(prereqId => 
    progress[prereqId]?.status === 'completed'
  ) || [];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={cn('relative', depth > 0 && 'ml-6 mt-3')}
    >
      {/* Connection Line for Children */}
      {depth > 0 && (
        <div className="absolute -left-6 top-6 w-6 h-0.5 bg-gradient-to-r from-primary/30 to-primary/10" />
      )}
      
      {/* Main Card */}
      <motion.div
        whileHover={!isLocked ? { scale: 1.01 } : {}}
        whileTap={!isLocked ? { scale: 0.99 } : {}}
        className={cn(
          'p-4 rounded-lg border-2 transition-all',
          'bg-card',
          !isLocked && 'cursor-pointer hover:shadow-md hover:border-primary/30',
          isLocked && 'opacity-60 cursor-not-allowed bg-muted/30',
          isRecommended && 'ring-2 ring-primary ring-offset-2 shadow-lg',
          isCompleted && 'border-green-500/30 bg-green-500/5'
        )}
        onClick={handleClick}
      >
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 flex items-start gap-3">
              <div className={cn('p-2 rounded-lg border', getTypeColor())}>
                {getIcon()}
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className={cn(
                  "font-semibold text-foreground mb-1",
                  isRecommended && "text-primary"
                )}>
                  {node.title}
                </h3>
                {node.subtitle && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {node.subtitle}
                  </p>
                )}
              </div>
            </div>
            
            <ProgressIndicator 
              status={status} 
              isRecommended={isRecommended}
            />
          </div>

          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center gap-2">
            {node.estimatedTime && (
              <Badge variant="outline" className="text-xs gap-1">
                <Clock className="w-3 h-3" />
                {node.estimatedTime} min
              </Badge>
            )}
            
            {node.difficultyLevel && (
              <Badge 
                variant="outline" 
                className={cn("text-xs gap-1", getDifficultyColor(node.difficultyLevel))}
              >
                <Zap className="w-3 h-3" />
                {node.difficultyLevel}
              </Badge>
            )}
            
            {node.tags?.map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}

            {!node.children && !isLocked && (
              <ExternalLink className="w-3 h-3 text-muted-foreground ml-auto" />
            )}

            {node.children && node.children.length > 0 && (
              <ChevronDown 
                className={cn(
                  "w-4 h-4 text-muted-foreground transition-transform ml-auto",
                  expanded && "rotate-180"
                )}
              />
            )}
          </div>

          {/* Prerequisites (if locked) */}
          {isLocked && node.prerequisites && node.prerequisites.length > 0 && (
            <PrerequisiteBadge 
              prerequisites={node.prerequisites}
              completedPrerequisites={completedPrerequisites}
              nodeMap={allNodes}
            />
          )}

          {/* Description (if available) */}
          {node.description && !isLocked && (
            <p className="text-xs text-muted-foreground pt-2 border-t">
              {node.description}
            </p>
          )}
        </div>
      </motion.div>

      {/* Children Nodes */}
      {node.children && node.children.length > 0 && expanded && !isLocked && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="mt-2 space-y-2"
        >
          {node.children.map((child, idx) => {
            const childStatus = progress[child.id]?.status || 
              (progress[child.id] ? 'available' : 'locked');
            
            return (
              <NodeCard 
                key={child.id} 
                node={child} 
                index={idx} 
                depth={depth + 1}
                status={childStatus as ProgressStatus}
                progress={progress}
                allNodes={allNodes}
                onVisit={onVisit}
                onStatusChange={onStatusChange}
              />
            );
          })}
        </motion.div>
      )}
    </motion.div>
  );
};
