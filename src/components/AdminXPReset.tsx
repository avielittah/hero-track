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
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={isResetting}
          className="text-xs border-red-200 hover:border-red-300 hover:bg-red-50 dark:border-red-800 dark:hover:border-red-700 dark:hover:bg-red-950/50 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          {isResetting ? (
            <RotateCcw className="h-3 w-3 animate-spin text-red-600" />
          ) : (
            <Trash2 className="h-3 w-3 text-red-600 hover:text-red-700" />
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
  );
};