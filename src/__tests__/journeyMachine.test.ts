import { describe, it, expect, beforeEach } from 'vitest';
import { useJourneyMachine } from '@/features/journey/journeyMachine';
import { act, renderHook } from '@testing-library/react';
import type { JourneyMachine } from '@/features/journey/journeyMachine';

describe('Journey Machine Guards', () => {
  let result: { current: any };

  beforeEach(() => {
    const hookResult = renderHook(() => useJourneyMachine());
    result = hookResult.result;
    
    // Reset to initial state
    act(() => {
      result.current.resetJourney();
    });
  });

  describe('canAdvance', () => {
    it('should allow advancing when on current stage and stage is editable', () => {
      expect(result.current.canAdvance()).toBe(true);
      expect(result.current.currentStage).toBe(1);
      expect(result.current.viewMode).toBe('current');
    });

    it('should not allow advancing when in preview mode', () => {
      // Complete stage 1 to enable preview
      act(() => {
        result.current.completeCurrentStage();
      });
      
      // Go to preview mode
      act(() => {
        result.current.previewStage(1);
      });
      
      expect(result.current.canAdvance()).toBe(false);
      expect(result.current.viewMode).toBe('preview-back');
    });

    it('should not allow advancing beyond stage 8', () => {
      // Manually set to stage 8 and beyond would not be possible in real scenario
      // but testing edge case
      act(() => {
        result.current.resetJourney();
        // Simulate being at the last stage
        for (let i = 1; i < 8; i++) {
          result.current.completeCurrentStage();
        }
      });
      
      expect(result.current.currentStage).toBe(8);
      expect(result.current.canAdvance()).toBe(true); // Can still complete stage 8
    });
  });

  describe('canPreviewBack', () => {
    it('should allow previewing completed stages that are before current', () => {
      // Complete stage 1
      act(() => {
        result.current.completeCurrentStage();
      });
      
      expect(result.current.canPreviewBack(1)).toBe(true);
      expect(result.current.currentStage).toBe(2);
    });

    it('should not allow previewing uncompleted stages', () => {
      expect(result.current.canPreviewBack(2)).toBe(false);
      expect(result.current.canPreviewBack(3)).toBe(false);
    });

    it('should not allow previewing current or future stages', () => {
      expect(result.current.canPreviewBack(1)).toBe(false); // current
      expect(result.current.canPreviewBack(2)).toBe(false); // future
    });
  });

  describe('canPeekNext', () => {
    it('should not allow peeking next when current stage is not completed', () => {
      expect(result.current.canPeekNext()).toBe(false);
    });

    it('should allow peeking next after completing current stage', () => {
      // Complete stage 1
      act(() => {
        result.current.completeCurrentStage();
      });
      
      // Go back to current mode (stage 2)
      act(() => {
        result.current.returnToCurrent();
      });
      
      // Complete stage 2 to test peek
      act(() => {
        result.current.completeCurrentStage();
      });
      
      act(() => {
        result.current.returnToCurrent();
      });

      expect(result.current.canPeekNext()).toBe(true);
    });

    it('should not allow peeking beyond stage 8', () => {
      // Complete all stages up to 8
      act(() => {
        for (let i = 1; i <= 8; i++) {
          if (result.current.currentStage <= 8) {
            result.current.completeCurrentStage();
          }
        }
      });
      
      expect(result.current.canPeekNext()).toBe(false);
    });

    it('should not allow peeking when not in current mode', () => {
      // Complete stage 1
      act(() => {
        result.current.completeCurrentStage();
      });
      
      // Complete stage 2  
      act(() => {
        result.current.completeCurrentStage();
      });
      
      // Go to preview mode
      act(() => {
        result.current.previewStage(1);
      });
      
      expect(result.current.canPeekNext()).toBe(false);
    });
  });

  describe('Stage Navigation', () => {
    it('should only allow navigation to current or completed stages', () => {
      const initialStage = result.current.viewingStage;
      
      // Try to go to future stage (should not work)
      act(() => {
        result.current.goToStage(3);
      });
      
      expect(result.current.viewingStage).toBe(initialStage);
      
      // Complete stage 1
      act(() => {
        result.current.completeCurrentStage();
      });
      
      // Now should be able to go back to stage 1
      act(() => {
        result.current.goToStage(1);
      });
      
      expect(result.current.viewingStage).toBe(1);
      expect(result.current.viewMode).toBe('preview-back');
    });

    it('should not allow skipping more than one stage ahead', () => {
      // Try to skip to stage 3
      act(() => {
        result.current.goToStage(3);
      });
      
      expect(result.current.viewingStage).toBe(1); // Should stay at current
      
      // Complete stage 1
      act(() => {
        result.current.completeCurrentStage();
      });
      
      // Try to skip to stage 4
      act(() => {
        result.current.goToStage(4);
      });
      
      expect(result.current.viewingStage).toBe(2); // Should be at new current
    });
  });

  describe('Stage Completion', () => {
    it('should advance to next stage on completion', () => {
      expect(result.current.currentStage).toBe(1);
      
      act(() => {
        result.current.completeCurrentStage();
      });
      
      expect(result.current.currentStage).toBe(2);
      expect(result.current.viewingStage).toBe(2);
      expect(result.current.viewMode).toBe('current');
      expect(result.current.isStageCompleted(1)).toBe(true);
    });

    it('should mark completed stage as non-editable', () => {
      expect(result.current.isStageEditable(1)).toBe(true);
      
      act(() => {
        result.current.completeCurrentStage();
      });
      
      expect(result.current.isStageEditable(1)).toBe(false);
      expect(result.current.isStageEditable(2)).toBe(true);
    });

    it('should handle final stage completion gracefully', () => {
      // Complete all stages
      act(() => {
        for (let i = 1; i <= 8; i++) {
          if (result.current.currentStage <= 8) {
            result.current.completeCurrentStage();
          }
        }
      });
      
      expect(result.current.currentStage).toBe(8);
      expect(result.current.isStageCompleted(8)).toBe(true);
    });
  });
});