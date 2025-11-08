import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { CheckCircle2, Circle, Youtube, FileText, Link2, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RoadmapNodeData {
  id: string;
  title: string;
  subtitle?: string;
  type: 'youtube' | 'article' | 'resource';
  url: string;
  isCompleted: boolean;
  isMain: boolean;
  onToggleComplete: (id: string) => void;
  onNodeClick: (url: string) => void;
}

export const RoadmapNode = memo(({ data }: NodeProps<RoadmapNodeData>) => {
  const { title, subtitle, type, isCompleted, isMain, onToggleComplete, onNodeClick, id, url } = data;
  
  const getIcon = () => {
    switch (type) {
      case 'youtube': return <Youtube className="w-4 h-4" />;
      case 'article': return <FileText className="w-4 h-4" />;
      case 'resource': return <Link2 className="w-4 h-4" />;
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case 'youtube': return 'bg-red-500/10 text-red-600 border-red-200';
      case 'article': return 'bg-blue-500/10 text-blue-600 border-blue-200';
      case 'resource': return 'bg-green-500/10 text-green-600 border-green-200';
    }
  };

  return (
    <div className="relative">
      {/* Top Connection Handle */}
      <Handle type="target" position={Position.Top} className="!w-3 !h-3 !bg-primary" />
      
      {/* Card - שימוש בעיצוב הקיים */}
      <div
        className={cn(
          'p-4 rounded-lg border-2 transition-all cursor-pointer bg-card',
          isCompleted && 'border-primary/50 bg-primary/5',
          !isCompleted && 'hover:shadow-lg hover:border-primary/50',
          isMain ? 'min-w-[250px]' : 'min-w-[200px]'
        )}
        onClick={() => onNodeClick(url)}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 flex-1">
            {/* Icon */}
            <div className={cn('p-2 rounded-full flex-shrink-0', getTypeColor())}>
              {getIcon()}
            </div>
            
            {/* Text */}
            <div className="flex-1 min-w-0">
              <h3 className={cn(
                'font-semibold text-sm text-foreground',
                isCompleted && 'line-through opacity-70'
              )}>
                {title}
              </h3>
              {subtitle && (
                <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
              )}
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleComplete(id);
              }}
              className="hover:scale-110 transition-transform"
            >
              {isCompleted ? (
                <CheckCircle2 className="w-5 h-5 text-primary" />
              ) : (
                <Circle className="w-5 h-5 text-muted-foreground" />
              )}
            </button>
            <ExternalLink className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
      </div>
      
      {/* Bottom Connection Handle */}
      <Handle type="source" position={Position.Bottom} className="!w-3 !h-3 !bg-primary" />
    </div>
  );
});

RoadmapNode.displayName = 'RoadmapNode';
