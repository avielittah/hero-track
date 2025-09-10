import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

interface CompletionBannerProps {
  stageName?: string;
  className?: string;
}

export const CompletionBanner = ({ stageName, className = "" }: CompletionBannerProps) => {
  return (
    <motion.div
      className={`w-full bg-muted border-b border-border py-3 ${className}`}
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="font-medium">
            Submitted • Preview Mode
          </Badge>
          {stageName && (
            <Badge variant="outline" className="text-xs">
              {stageName} Complete
            </Badge>
          )}
        </div>
      </div>
    </motion.div>
  );
};