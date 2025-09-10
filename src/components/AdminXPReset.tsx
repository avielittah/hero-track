import { useState } from 'react';
import { Trash2, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useLearningStore } from '@/lib/store';
import { isAdmin } from '@/lib/admin';

export const AdminXPReset = () => {
  const { resetXP, currentXP, level } = useLearningStore();
  const { toast } = useToast();
  const [isResetting, setIsResetting] = useState(false);

  // Only show for admin users
  if (!isAdmin()) return null;

  const handleReset = async () => {
    setIsResetting(true);
    
    try {
      resetXP();
      
      toast({
        title: "XP Reset Complete",
        description: "User XP has been reset to 0 and level reset to New Explorer",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Reset Failed",
        description: "Failed to reset XP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-destructive/10 backdrop-blur-sm p-3 rounded-lg border border-destructive/20">
      <div className="flex items-center gap-3 mb-2">
        <div className="flex items-center gap-1">
          <Trash2 className="h-4 w-4 text-destructive" />
          <span className="text-xs font-medium text-destructive">Admin Controls</span>
        </div>
      </div>
      
      <div className="text-xs text-muted-foreground mb-3">
        Current: {currentXP} XP | {level}
      </div>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="destructive"
            size="sm"
            disabled={isResetting}
            className="w-full text-xs"
          >
            {isResetting ? (
              <>
                <RotateCcw className="h-3 w-3 mr-1 animate-spin" />
                Resetting...
              </>
            ) : (
              <>
                <Trash2 className="h-3 w-3 mr-1" />
                Reset XP
              </>
            )}
          </Button>
        </AlertDialogTrigger>
        
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset User XP?</AlertDialogTitle>
            <AlertDialogDescription>
              This will reset the user's XP to 0 and level to "New Explorer". 
              This action cannot be undone and is for administrative purposes only.
              <br /><br />
              <strong>Current:</strong> {currentXP} XP | {level}
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReset}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Reset XP
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};