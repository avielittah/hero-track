import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LearnerProgress, Level, StageId, XPThresholds } from '@/types/journey';
import { isAdmin } from '@/lib/admin';

export interface Trophy {
  id: string;
  stage: StageId;
  name: string;
  description: string;
  awardedAt: string;
}

interface LearningStore extends LearnerProgress {
  // XP and Level Management
  setCurrentStage: (stage: StageId) => void;
  addXP: (amount: number, source?: string) => Promise<{ leveledUp: boolean; newLevel?: Level; previousLevel?: Level }>;
  
  // Dynamic XP System
  awardStageXP: (stage: StageId) => Promise<{ leveledUp: boolean; newLevel?: Level; previousLevel?: Level }>;
  awardTaskXP: (taskType: 'task' | 'quiz' | 'project' | 'interaction') => Promise<{ leveledUp: boolean; newLevel?: Level; previousLevel?: Level }>;
  
  // Authentication
  login: (username: string) => void;
  logout: () => void;
  
  // Trophies
  trophies: Trophy[];
  awardTrophy: (stage: StageId) => void;
  
  // Utilities
  resetProgress: () => void;
  resetXP: () => void; // Admin only - reset XP to 0
  getCurrentLevelIndex: () => number;
  getXPProgressInCurrentLevel: () => { current: number; max: number; percentage: number };
  
  // Level Up Modal State
  showLevelUpModal: boolean;
  levelUpData: { newLevel: Level; previousLevel: Level; currentXP: number } | null;
  setLevelUpModal: (show: boolean) => void;
}

const getLevelFromXP = (xp: number): Level => {
  if (xp >= XPThresholds[5]) return 'Pro Team Member';
  if (xp >= XPThresholds[4]) return 'Project Builder';
  if (xp >= XPThresholds[3]) return 'Problem Solver';
  if (xp >= XPThresholds[2]) return 'Skilled Learner';
  if (xp >= XPThresholds[1]) return 'Team Rookie';
  return 'New Explorer';
};

const getLevelIndex = (level: Level): number => {
  const levels: Level[] = ['New Explorer', 'Team Rookie', 'Skilled Learner', 'Problem Solver', 'Project Builder', 'Pro Team Member'];
  return levels.indexOf(level);
};

const TROPHY_STAGES: StageId[] = [1, 3, 4, 6, 8];

const getTrophyForStage = (stage: StageId): Trophy | null => {
  const trophyData = {
    1: { name: "First Steps", description: "Completed your first learning stage!" },
    3: { name: "Building Momentum", description: "Mastered the fundamentals!" },
    4: { name: "Halfway Hero", description: "Reached the midpoint of your journey!" },
    6: { name: "Advanced Achiever", description: "Excelled in advanced concepts!" },
    8: { name: "Journey Master", description: "Completed the entire learning journey!" },
  };

  if (!TROPHY_STAGES.includes(stage)) return null;
  
  const data = trophyData[stage as keyof typeof trophyData];
  return {
    id: `trophy-stage-${stage}`,
    stage,
    name: data.name,
    description: data.description,
    awardedAt: new Date().toISOString(),
  };
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
      trophies: [],
      showLevelUpModal: false,
      levelUpData: null,
      
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

      addXP: async (amount: number, source?: string) => {
        const current = get();
        const previousLevel = current.level;
        const previousLevelIndex = getLevelIndex(previousLevel);
        const newXP = current.currentXP + amount;
        const newLevel = getLevelFromXP(newXP);
        const newLevelIndex = getLevelIndex(newLevel);
        
        const leveledUp = newLevelIndex > previousLevelIndex;
        
        set({
          currentXP: newXP,
          level: newLevel,
        });

        // Show level up modal if user leveled up
        if (leveledUp) {
          set({
            showLevelUpModal: true,
            levelUpData: {
              newLevel,
              previousLevel,
              currentXP: newXP,
            },
          });
        }

        return {
          leveledUp,
          newLevel: leveledUp ? newLevel : undefined,
          previousLevel: leveledUp ? previousLevel : undefined,
        };
      },

      // Dynamic XP System - Award XP based on stage completion
      awardStageXP: async (stage: StageId) => {
        const stageXPMap: Record<StageId, number> = {
          1: 50,   // Welcome & Onboarding
          2: 75,   // Orientation Checklist  
          3: 100,  // Technical Orientation
          4: 125,  // Advanced Skills
          5: 150,  // Project Work
          6: 175,  // Collaboration
          7: 200,  // Leadership
          8: 250,  // Mastery & Graduation
        };
        
        const xpAmount = stageXPMap[stage] || 50;
        return get().addXP(xpAmount, `Stage ${stage} Completion`);
      },

      // Award XP for different task types
      awardTaskXP: async (taskType: 'task' | 'quiz' | 'project' | 'interaction') => {
        const taskXPMap = {
          task: 15,        // Regular task completion
          quiz: 25,        // Quiz or assessment
          project: 50,     // Project submission
          interaction: 10, // Interactive elements
        };
        
        const xpAmount = taskXPMap[taskType] || 10;
        return get().addXP(xpAmount, `${taskType} completion`);
      },

      setLevelUpModal: (show: boolean) => {
        set({ 
          showLevelUpModal: show,
          levelUpData: show ? get().levelUpData : null,
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

      awardTrophy: (stage: StageId) => {
        const current = get();
        const trophy = getTrophyForStage(stage);
        
        if (trophy && !current.trophies.find(t => t.stage === stage)) {
          set({
            trophies: [...current.trophies, trophy],
          });
        }
      },

      resetProgress: () => {
        set({ 
          ...initialState, 
          trophies: [],
          showLevelUpModal: false,
          levelUpData: null,
        });
      },

      resetXP: () => {
        // Admin only function to reset XP and level
        if (!isAdmin()) return;
        
        set({
          currentXP: 0,
          level: 'New Explorer',
          showLevelUpModal: false,
          levelUpData: null,
        });
      },

      getCurrentLevelIndex: () => {
        const current = get();
        return getLevelIndex(current.level);
      },

      getXPProgressInCurrentLevel: () => {
        const current = get();
        const levelIndex = getLevelIndex(current.level);
        const currentThreshold = XPThresholds[levelIndex] || 0;
        const nextThreshold = XPThresholds[levelIndex + 1] || XPThresholds[XPThresholds.length - 1];
        const progressInLevel = current.currentXP - currentThreshold;
        const levelRange = nextThreshold - currentThreshold;
        const percentage = Math.min((progressInLevel / levelRange) * 100, 100);

        return {
          current: progressInLevel,
          max: levelRange,
          percentage,
        };
      },
    }),
    {
      name: 'learning-progress',
    }
  )
);