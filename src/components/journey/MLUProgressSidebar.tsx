import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, Lock, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface MLUProgressSidebarProps {
  currentMLUIndex: number;
  totalMLUs: number;
  completedMLUs: number[];
  currentStage: number;
  totalStages: number;
  mluTitles?: string[];
}

export function MLUProgressSidebar({
  currentMLUIndex,
  totalMLUs,
  completedMLUs,
  currentStage,
  totalStages,
  mluTitles = []
}: MLUProgressSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isMobile = useIsMobile();

  // Auto-collapse on mobile
  const shouldCollapse = isMobile || isCollapsed;

  const getMLUStatus = (index: number) => {
    if (completedMLUs.includes(index)) return 'completed';
    if (index === currentMLUIndex) return 'current';
    return 'upcoming';
  };

  const getStatusIcon = (index: number) => {
    const status = getMLUStatus(index);
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-journey-complete" />;
      case 'current':
        return <Circle className="w-5 h-5 text-journey-current fill-journey-current animate-glow-pulse" />;
      default:
        return <Lock className="w-5 h-5 text-journey-upcoming" />;
    }
  };

  return (
    <>
      {/* Toggle Button (Always visible) */}
      <motion.div
        className="fixed left-4 top-24 z-50"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Button
          size="sm"
          variant="outline"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="bg-card/95 backdrop-blur-sm border-border shadow-lg hover:shadow-xl transition-all"
        >
          {shouldCollapse ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </motion.div>

      {/* Sidebar */}
      <AnimatePresence>
        {!shouldCollapse && (
          <motion.aside
            initial={{ opacity: 0, x: -280 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -280 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-20 h-[calc(100vh-5rem)] w-64 z-40 pointer-events-none"
          >
            <div className="ml-4 mt-16 h-full pointer-events-auto">
              <div className="bg-card/95 backdrop-blur-md border border-border rounded-xl shadow-2xl h-full flex flex-col overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b border-border bg-gradient-to-br from-primary/5 to-secondary/5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-foreground">Your Progress</h3>
                    <Badge variant="secondary" className="text-xs">
                      Stage {currentStage}/{totalStages}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-2xl font-bold text-primary">
                      {currentMLUIndex + 1}/{totalMLUs}
                    </div>
                    <div className="text-xs text-muted-foreground">MLUs</div>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="mt-3 w-full bg-muted rounded-full h-2 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${((completedMLUs.length) / totalMLUs) * 100}%` }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {completedMLUs.length} completed
                  </div>
                </div>

                {/* MLU List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                  {Array.from({ length: totalMLUs }).map((_, index) => {
                    const status = getMLUStatus(index);
                    const isCurrent = index === currentMLUIndex;
                    const title = mluTitles[index] || `MLU ${index + 1}`;

                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`
                          flex items-start gap-3 p-3 rounded-lg border transition-all
                          ${isCurrent 
                            ? 'bg-primary/10 border-primary shadow-md' 
                            : status === 'completed'
                            ? 'bg-journey-complete/5 border-journey-complete/20'
                            : 'bg-muted/30 border-border'
                          }
                        `}
                      >
                        <div className="flex-shrink-0 mt-0.5">
                          {getStatusIcon(index)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium text-foreground truncate">
                            {title}
                          </div>
                          {isCurrent && (
                            <div className="text-xs text-primary font-medium mt-0.5">
                              In Progress
                            </div>
                          )}
                          {status === 'completed' && (
                            <div className="text-xs text-journey-complete mt-0.5">
                              ✓ Done
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-border bg-muted/30">
                  <div className="text-xs text-center text-muted-foreground">
                    {completedMLUs.length === totalMLUs ? (
                      <span className="text-journey-complete font-medium">
                        🎉 All MLUs Complete!
                      </span>
                    ) : (
                      <span>
                        {totalMLUs - completedMLUs.length} more to go
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
