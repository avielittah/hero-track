import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LearnerProgress, Level, StageId, XPThresholds } from '@/types/journey';

interface LearningStore extends LearnerProgress {
  setCurrentStage: (stage: StageId) => void;
  addXP: (amount: number) => void;
  login: (username: string) => void;
  logout: () => void;
  resetProgress: () => void;
}

const getLevelFromXP = (xp: number): Level => {
  if (xp >= XPThresholds[5]) return 'Pro Team Member';
  if (xp >= XPThresholds[4]) return 'Project Builder';
  if (xp >= XPThresholds[3]) return 'Problem Solver';
  if (xp >= XPThresholds[2]) return 'Skilled Learner';
  if (xp >= XPThresholds[1]) return 'Team Rookie';
  return 'New Explorer';
};

const initialState: LearnerProgress = {
  currentStage: 1,
  currentXP: 75,
  level: 'Team Rookie',
  completedStages: [],
  isLoggedIn: false,
  username: undefined,
};

export const useLearningStore = create<LearningStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      setCurrentStage: (stage: StageId) => {
        const current = get();
        const completedStages = [...current.completedStages];
        
        // Mark previous stages as completed
        for (let i = 1; i < stage; i++) {
          if (!completedStages.includes(i as StageId)) {
            completedStages.push(i as StageId);
          }
        }
        
        set({
          currentStage: stage,
          completedStages,
        });
      },

      addXP: (amount: number) => {
        const current = get();
        const newXP = current.currentXP + amount;
        const newLevel = getLevelFromXP(newXP);
        
        set({
          currentXP: newXP,
          level: newLevel,
        });
      },

      login: (username: string) => {
        set({
          isLoggedIn: true,
          username,
        });
      },

      logout: () => {
        set({
          isLoggedIn: false,
          username: undefined,
        });
      },

      resetProgress: () => {
        set(initialState);
      },
    }),
    {
      name: 'learning-progress',
    }
  )
);