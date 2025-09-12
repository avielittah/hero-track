import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, X, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAdminStore } from '@/lib/admin';
import { useJourneyMachine } from '@/features/journey/journeyMachine';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AdminGate } from './AdminGate';
import type { StageId } from '@/types/journey';

export const AdminBar: React.FC = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { adminMode, disableAdmin } = useAdminStore();
  const { currentStage, viewingStage, goToStage, isStageCompleted, completeCurrentStage } = useJourneyMachine();
  const [showGate, setShowGate] = useState(false);

  const handleDisableAdmin = () => {
    disableAdmin();
    toast({
      title: t('ui.admin.disabled'),
      duration: 2000,
    });
  };

  const handleStageJump = (stageId: string) => {
    goToStage(parseInt(stageId) as StageId);
  };

  const handleCompleteStage2 = () => {
    // Navigate to stage 2 first if not there
    if (currentStage !== 2) {
      goToStage(2);
    }
    
    // Force complete stage 2
    if (!isStageCompleted(2)) {
      completeCurrentStage();
      toast({
        title: "Admin: Stage 2 Completed",
        description: "Stage 2 marked complete. Stage 3 now accessible.",
      });
    } else {
      toast({
        title: "Stage 2 Already Complete",
        description: "Stage 2 is already completed.",
      });
    }
  };

  const showJumpControls = adminMode && (process.env.NODE_ENV === 'development' || adminMode);

  return (
    <>
      <div className="fixed bottom-4 right-4 md:right-4 md:bottom-4 z-50 flex items-center gap-2">
        {adminMode ? (
          <div className="flex items-center gap-2 bg-background/95 backdrop-blur-sm border rounded-lg px-3 py-2 shadow-lg">
            <div className="flex items-center gap-2 text-xs bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-2 py-1 rounded">
              <span>{t('ui.admin.on')}</span>
              <Button
                size="sm"
                variant="ghost"
                className="h-4 w-4 p-0 hover:bg-amber-200 dark:hover:bg-amber-800"
                onClick={handleDisableAdmin}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            
            {showJumpControls && (
              <>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground">{t('ui.admin.stage')}:</span>
                  <Select value={viewingStage.toString()} onValueChange={handleStageJump}>
                    <SelectTrigger className="w-16 h-7 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 8 }, (_, i) => i + 1).map((stage) => (
                        <SelectItem key={stage} value={stage.toString()}>
                          {stage}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button
                  onClick={handleCompleteStage2}
                  size="sm"
                  variant="outline"
                  className="text-xs h-7 bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-700"
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Complete S2
                </Button>
              </>
            )}
          </div>
        ) : (
          <Button
            size="sm"
            variant="ghost"
            className="w-8 h-8 p-0 text-slate-400 hover:text-slate-600 dark:text-slate-600 dark:hover:text-slate-400 bg-background/50 backdrop-blur-sm border shadow-sm"
            onClick={() => setShowGate(true)}
            aria-label={t('ui.admin.open')}
          >
            <Shield className="h-4 w-4" />
          </Button>
        )}
      </div>

      <AdminGate open={showGate} onOpenChange={setShowGate} />
    </>
  );
};