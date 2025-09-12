import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Lightbulb, X } from 'lucide-react';
import { useState } from 'react';

interface DidYouKnowBoxProps {
  title: string;
  content: string;
  xpReward?: number;
  onClose?: () => void;
  onRewardClaim?: () => void;
  className?: string;
  disabled?: boolean;
}

export function DidYouKnowBox({
  title,
  content,
  xpReward = 5,
  onClose,
  onRewardClaim,
  className = "",
  disabled = false
}: DidYouKnowBoxProps) {
  const [isRewardClaimed, setIsRewardClaimed] = useState(false);

  const handleClaimReward = () => {
    setIsRewardClaimed(true);
    onRewardClaim?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`
        relative overflow-hidden rounded-xl border-2 border-blue-200 dark:border-blue-800 
        bg-gradient-to-br from-blue-50 via-blue-50/80 to-cyan-50 
        dark:from-blue-950/50 dark:via-blue-950/30 dark:to-cyan-950/30 
        p-4 ${className}
      `}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(59,130,246,0.1),transparent_50%)]" />
      
      <div className="relative space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
              <Lightbulb className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <h4 className="font-semibold text-blue-900 dark:text-blue-100">
              {title}
            </h4>
          </div>
          
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0 text-blue-600 hover:text-blue-800 dark:text-blue-400"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Content */}
        <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
          {content}
        </p>

        {/* XP Reward */}
        {xpReward > 0 && !isRewardClaimed && !disabled && (
          <div className="pt-2">
            <Button
              onClick={handleClaimReward}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
            >
              💡 Claim +{xpReward} XP
            </Button>
          </div>
        )}

        {(isRewardClaimed || disabled) && (
          <div className="flex items-center gap-2 text-xs text-blue-700 dark:text-blue-300">
            <span className="text-sm">✅</span>
            <span>+{xpReward} XP earned!</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}