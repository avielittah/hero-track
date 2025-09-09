import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { StageId } from '@/types/journey';

export type ViewMode = 'current' | 'preview-back' | 'peek-forward';

export interface JourneyState {
  currentStage: StageId;
  viewingStage: StageId;
  viewMode: ViewMode;
  completedStages: Set<StageId>;
  stageData: Record<StageId, { completed: boolean; canEdit: boolean }>;
}

export interface JourneyActions {
  // Navigation
  goToStage: (stageId: StageId) => void;
  completeCurrentStage: () => void;
  previewStage: (stageId: StageId) => void;
  returnToCurrent: () => void;
  
  // Guards
  canAdvance: () => boolean;
  canPreviewBack: (stageId: StageId) => boolean;
  canPeekNext: () => boolean;
  
  // Utilities
  resetJourney: () => void;
  isStageCompleted: (stageId: StageId) => boolean;
  isStageEditable: (stageId: StageId) => boolean;
}

export interface JourneyMachine extends JourneyState, JourneyActions {}

const initialState: JourneyState = {
  currentStage: 1,
  viewingStage: 1,
  viewMode: 'current',
  completedStages: new Set(),
  stageData: {
    1: { completed: false, canEdit: true },
    2: { completed: false, canEdit: false },
    3: { completed: false, canEdit: false },
    4: { completed: false, canEdit: false },
    5: { completed: false, canEdit: false },
    6: { completed: false, canEdit: false },
    7: { completed: false, canEdit: false },
    8: { completed: false, canEdit: false },
  },
};

export const useJourneyMachine = create<JourneyMachine>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Navigation Actions
      goToStage: (stageId: StageId) => {
        const state = get();
        
        // Can only go to current stage or completed stages
        if (stageId === state.currentStage || state.completedStages.has(stageId)) {
          set({
            viewingStage: stageId,
            viewMode: stageId === state.currentStage ? 'current' : 'preview-back',
          });
        }
      },

      completeCurrentStage: () => {
        const state = get();
        const newCompletedStages = new Set(state.completedStages);
        newCompletedStages.add(state.currentStage);
        
        const newStageData = { ...state.stageData };
        newStageData[state.currentStage] = { completed: true, canEdit: false };
        
        // Enable next stage if not at the end
        const nextStage = (state.currentStage + 1) as StageId;
        if (nextStage <= 8) {
          newStageData[nextStage] = { completed: false, canEdit: true };
          
          set({
            currentStage: nextStage,
            viewingStage: nextStage,
            viewMode: 'current',
            completedStages: newCompletedStages,
            stageData: newStageData,
          });
        } else {
          // Journey completed
          set({
            completedStages: newCompletedStages,
            stageData: newStageData,
          });
        }
      },

      previewStage: (stageId: StageId) => {
        const state = get();
        
        if (state.canPreviewBack(stageId)) {
          set({
            viewingStage: stageId,
            viewMode: 'preview-back',
          });
        } else if (stageId === state.currentStage + 1 && state.canPeekNext()) {
          set({
            viewingStage: stageId,
            viewMode: 'peek-forward',
          });
        }
      },

      returnToCurrent: () => {
        const state = get();
        set({
          viewingStage: state.currentStage,
          viewMode: 'current',
        });
      },

      // Guards
      canAdvance: () => {
        const state = get();
        return (
          state.viewMode === 'current' &&
          state.stageData[state.currentStage]?.canEdit &&
          state.currentStage <= 8
        );
      },

      canPreviewBack: (stageId: StageId) => {
        const state = get();
        return state.completedStages.has(stageId) && stageId < state.currentStage;
      },

      canPeekNext: () => {
        const state = get();
        const nextStage = (state.currentStage + 1) as StageId;
        return (
          nextStage <= 8 &&
          state.completedStages.has(state.currentStage) &&
          state.viewMode === 'current'
        );
      },

      // Utilities
      resetJourney: () => {
        set(initialState);
      },

      isStageCompleted: (stageId: StageId) => {
        const state = get();
        return state.completedStages.has(stageId);
      },

      isStageEditable: (stageId: StageId) => {
        const state = get();
        return (
          state.viewMode === 'current' &&
          state.viewingStage === stageId &&
          state.stageData[stageId]?.canEdit
        );
      },
    }),
    {
      name: 'journey-machine',
      // Convert Set to Array for serialization
      partialize: (state) => ({
        ...state,
        completedStages: Array.from(state.completedStages),
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Convert Array back to Set on rehydration
          state.completedStages = new Set(state.completedStages as any);
        }
      },
    }
  )
);