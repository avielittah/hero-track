import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HelpCircle, X } from 'lucide-react';
import { useState } from 'react';

interface TooltipTipProps {
  trigger: React.ReactNode;
  title: string;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export function TooltipTip({
  trigger,
  title,
  content,
  position = 'top',
  className = ""
}: TooltipTipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  };

  const arrowClasses = {
    top: 'top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-gray-800',
    bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-gray-800',
    left: 'left-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-gray-800',
    right: 'right-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-gray-800'
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="cursor-help"
      >
        {trigger}
      </div>

      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className={`
            absolute z-50 ${positionClasses[position]}
            w-64 p-4 bg-gray-900 text-white rounded-lg shadow-2xl
            border border-gray-700
          `}
        >
          {/* Arrow */}
          <div className={`absolute w-0 h-0 border-4 ${arrowClasses[position]}`} />
          
          {/* Content */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-yellow-500" />
              <h4 className="font-semibold text-sm">{title}</h4>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">{content}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Pre-made tooltip triggers
export function HelpTip({ title, content, position }: Omit<TooltipTipProps, 'trigger' | 'className'>) {
  return (
    <TooltipTip
      trigger={
        <Button variant="ghost" size="sm" className="h-5 w-5 p-0 text-muted-foreground hover:text-primary">
          <HelpCircle className="h-3 w-3" />
        </Button>
      }
      title={title}
      content={content}
      position={position}
    />
  );
}

export function InfoBadgeTip({ label, title, content }: { label: string; title: string; content: string }) {
  return (
    <TooltipTip
      trigger={
        <Badge variant="outline" className="cursor-help bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100">
          {label}
        </Badge>
      }
      title={title}
      content={content}
    />
  );
}