import { ProgressStatus } from '@/types/learning';
import { 
  Lock, 
  Circle, 
  PlayCircle, 
  CheckCircle2, 
  Bookmark, 
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProgressIndicatorProps {
  status: ProgressStatus;
  isRecommended?: boolean;
  className?: string;
}

export const ProgressIndicator = ({ 
  status, 
  isRecommended = false,
  className 
}: ProgressIndicatorProps) => {
  
  const getStatusConfig = () => {
    switch (status) {
      case 'locked':
        return {
          icon: Lock,
          label: 'Locked',
          color: 'text-muted-foreground/40',
          bgColor: 'bg-muted/20',
        };
      case 'available':
        return {
          icon: Circle,
          label: 'Available',
          color: 'text-blue-500',
          bgColor: 'bg-blue-500/10',
        };
      case 'in-progress':
        return {
          icon: PlayCircle,
          label: 'In Progress',
          color: 'text-orange-500',
          bgColor: 'bg-orange-500/10',
        };
      case 'completed':
        return {
          icon: CheckCircle2,
          label: 'Completed',
          color: 'text-green-500',
          bgColor: 'bg-green-500/10',
        };
      case 'bookmarked':
        return {
          icon: Bookmark,
          label: 'Bookmarked',
          color: 'text-purple-500',
          bgColor: 'bg-purple-500/10',
        };
      case 'review':
        return {
          icon: RefreshCw,
          label: 'Review',
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-500/10',
        };
      default:
        return {
          icon: Circle,
          label: 'Unknown',
          color: 'text-muted-foreground',
          bgColor: 'bg-muted',
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn(
        "p-1.5 rounded-full transition-all",
        config.bgColor,
        isRecommended && "ring-2 ring-primary ring-offset-2 animate-pulse"
      )}>
        <Icon className={cn("w-4 h-4", config.color)} />
      </div>
      
      <div className="flex items-center gap-1">
        <span className={cn("text-xs font-medium", config.color)}>
          {config.label}
        </span>
        {isRecommended && (
          <Sparkles className="w-3 h-3 text-primary animate-pulse" />
        )}
      </div>
    </div>
  );
};
