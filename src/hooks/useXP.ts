import { useCallback } from 'react';
import { useLearningStore } from '@/lib/store';

export const useXP = () => {
  const { awardTaskXP, awardStageXP, addXP } = useLearningStore();

  // Helper functions for awarding XP
  const awardTaskCompletion = useCallback(async () => {
    return await awardTaskXP('task');
  }, [awardTaskXP]);

  const awardQuizCompletion = useCallback(async () => {
    return await awardTaskXP('quiz');
  }, [awardTaskXP]);

  const awardProjectSubmission = useCallback(async () => {
    return await awardTaskXP('project');
  }, [awardTaskXP]);

  const awardInteraction = useCallback(async () => {
    return await awardTaskXP('interaction');
  }, [awardTaskXP]);

  const awardStageCompletion = useCallback(async (stage: number) => {
    return await awardStageXP(stage as any);
  }, [awardStageXP]);

  const awardCustomXP = useCallback(async (amount: number, source?: string) => {
    return await addXP(amount, source);
  }, [addXP]);

  return {
    awardTaskCompletion,
    awardQuizCompletion,
    awardProjectSubmission,
    awardInteraction,
    awardStageCompletion,
    awardCustomXP,
  };
};

// Example usage in components:
/*
  import { useXP } from '@/hooks/useXP';
  
  const MyComponent = () => {
    const { awardTaskCompletion } = useXP();
    
    const handleTaskComplete = async () => {
      const result = await awardTaskCompletion();
      if (result.leveledUp) {
        console.log(`Level up! New level: ${result.newLevel}`);
      }
    };
    
    return (
      <button onClick={handleTaskComplete}>
        Complete Task
      </button>
    );
  };
*/