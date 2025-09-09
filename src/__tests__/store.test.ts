import { describe, it, expect, beforeEach } from 'vitest';
import { useLearningStore } from '@/lib/store';
import { act, renderHook } from '@testing-library/react';

describe('XP Level Calculation', () => {
  let result: { current: any };

  beforeEach(() => {
    const hookResult = renderHook(() => useLearningStore());
    result = hookResult.result;
    
    // Reset to initial state
    act(() => {
      result.current.resetProgress();
    });
  });

  describe('Level Progression', () => {
    it('should start at Team Rookie level with initial XP', () => {
      expect(result.current.level).toBe('Team Rookie'); // Initial state has 75 XP
      expect(result.current.currentXP).toBe(75);
    });

    it('should advance levels correctly based on XP thresholds', async () => {
      // Reset to 0 XP first
      act(() => {
        result.current.resetProgress();
      });
      
      // Manually set XP to 0 for testing
      result.current.currentXP = 0;
      result.current.level = 'New Explorer';
      
      // Test progression through each level
      const levelTests = [
        { xp: 25, expectedLevel: 'New Explorer' }, // Below threshold 50
        { xp: 50, expectedLevel: 'Team Rookie' }, // At threshold 50
        { xp: 75, expectedLevel: 'Team Rookie' }, // Above threshold 50
        { xp: 100, expectedLevel: 'Skilled Learner' }, // At threshold 100
        { xp: 125, expectedLevel: 'Skilled Learner' }, // Above threshold 100
        { xp: 150, expectedLevel: 'Problem Solver' }, // At threshold 150
        { xp: 200, expectedLevel: 'Problem Solver' }, // Above threshold 150
        { xp: 230, expectedLevel: 'Project Builder' }, // At threshold 230
        { xp: 260, expectedLevel: 'Project Builder' }, // Above threshold 230
        { xp: 280, expectedLevel: 'Pro Team Member' }, // At threshold 280
        { xp: 350, expectedLevel: 'Pro Team Member' }, // Above max threshold
      ];

      for (const test of levelTests) {
        const xpToAdd = test.xp - result.current.currentXP;
        
        if (xpToAdd > 0) {
          const levelUpResult = await act(async () => {
            return await result.current.addXP(xpToAdd);
          });
          
          expect(result.current.level).toBe(test.expectedLevel);
          expect(result.current.currentXP).toBe(test.xp);
          
          // Check if level up was detected correctly
          if (levelUpResult.leveledUp) {
            expect(levelUpResult.newLevel).toBe(test.expectedLevel);
            expect(levelUpResult.previousLevel).toBeDefined();
          }
        }
      }
    });

    it('should detect level ups correctly', async () => {
      // Reset to 0 XP
      act(() => {
        result.current.resetProgress();
      });
      result.current.currentXP = 0;
      result.current.level = 'New Explorer';

      // Add XP to trigger level up
      const levelUpResult = await act(async () => {
        return await result.current.addXP(75); // Should go from New Explorer to Team Rookie
      });

      expect(levelUpResult.leveledUp).toBe(true);
      expect(levelUpResult.newLevel).toBe('Team Rookie');
      expect(levelUpResult.previousLevel).toBe('New Explorer');
    });

    it('should not detect level up when staying in same level', async () => {
      // Start with 75 XP (Team Rookie)
      const levelUpResult = await act(async () => {
        return await result.current.addXP(10); // Still Team Rookie
      });

      expect(levelUpResult.leveledUp).toBe(false);
      expect(levelUpResult.newLevel).toBeUndefined();
      expect(levelUpResult.previousLevel).toBeUndefined();
    });
  });

  describe('Level Index and Progress', () => {
    it('should return correct level index', () => {
      const levelIndices = [
        { level: 'New Explorer', index: 0 },
        { level: 'Team Rookie', index: 1 },
        { level: 'Skilled Learner', index: 2 },
        { level: 'Problem Solver', index: 3 },
        { level: 'Project Builder', index: 4 },
        { level: 'Pro Team Member', index: 5 },
      ];

      levelIndices.forEach(({ level, index }) => {
        // Set level manually for testing
        result.current.level = level as any;
        expect(result.current.getCurrentLevelIndex()).toBe(index);
      });
    });

    it('should calculate XP progress in current level correctly', () => {
      // Test at Team Rookie level (50-100 XP range)
      result.current.currentXP = 75;
      result.current.level = 'Team Rookie';
      
      const progress = result.current.getXPProgressInCurrentLevel();
      
      expect(progress.current).toBe(25); // 75 - 50 (threshold)
      expect(progress.max).toBe(50); // 100 - 50 (next threshold - current threshold)
      expect(progress.percentage).toBe(50); // 25/50 * 100
    });

    it('should handle progress at max level', () => {
      result.current.currentXP = 350;
      result.current.level = 'Pro Team Member';
      
      const progress = result.current.getXPProgressInCurrentLevel();
      
      expect(progress.current).toBe(70); // 350 - 280 (threshold)
      expect(progress.max).toBe(0); // At max level, no next threshold
      expect(progress.percentage).toBe(100); // Capped at 100%
    });

    it('should handle progress at minimum level', () => {
      result.current.currentXP = 25;
      result.current.level = 'New Explorer';
      
      const progress = result.current.getXPProgressInCurrentLevel();
      
      expect(progress.current).toBe(25); // 25 - 0 (threshold)
      expect(progress.max).toBe(50); // 50 - 0 (next threshold - current threshold)
      expect(progress.percentage).toBe(50); // 25/50 * 100
    });
  });

  describe('Stage Management', () => {
    it('should set current stage and mark previous stages as completed', () => {
      act(() => {
        result.current.setCurrentStage(3);
      });

      expect(result.current.currentStage).toBe(3);
      expect(result.current.completedStages).toContain(1);
      expect(result.current.completedStages).toContain(2);
      expect(result.current.completedStages).not.toContain(3);
    });

    it('should not duplicate completed stages', () => {
      act(() => {
        result.current.setCurrentStage(2);
        result.current.setCurrentStage(2); // Set same stage again
      });

      const stage1Count = result.current.completedStages.filter(s => s === 1).length;
      expect(stage1Count).toBe(1); // Should only appear once
    });
  });

  describe('Trophy System', () => {
    it('should award trophies for major stages', () => {
      const majorStages = [1, 3, 4, 6, 8];
      
      majorStages.forEach(stage => {
        act(() => {
          result.current.awardTrophy(stage as any);
        });
        
        const trophy = result.current.trophies.find(t => t.stage === stage);
        expect(trophy).toBeDefined();
        expect(trophy?.stage).toBe(stage);
        expect(trophy?.name).toBeDefined();
        expect(trophy?.description).toBeDefined();
      });
    });

    it('should not award duplicate trophies', () => {
      act(() => {
        result.current.awardTrophy(1);
        result.current.awardTrophy(1); // Award same trophy again
      });

      const stage1Trophies = result.current.trophies.filter(t => t.stage === 1);
      expect(stage1Trophies).toHaveLength(1);
    });

    it('should not award trophies for non-major stages', () => {
      const nonMajorStages = [2, 5, 7];
      
      nonMajorStages.forEach(stage => {
        act(() => {
          result.current.awardTrophy(stage as any);
        });
        
        const trophy = result.current.trophies.find(t => t.stage === stage);
        expect(trophy).toBeUndefined();
      });
    });
  });

  describe('Authentication', () => {
    it('should handle login correctly', () => {
      act(() => {
        result.current.login('testuser');
      });

      expect(result.current.isLoggedIn).toBe(true);
      expect(result.current.username).toBe('testuser');
    });

    it('should handle logout correctly', () => {
      // First login
      act(() => {
        result.current.login('testuser');
      });

      // Then logout
      act(() => {
        result.current.logout();
      });

      expect(result.current.isLoggedIn).toBe(false);
      expect(result.current.username).toBeUndefined();
    });
  });

  describe('Progress Reset', () => {
    it('should reset all progress to initial state', () => {
      // Make some changes
      act(() => {
        result.current.addXP(100);
        result.current.setCurrentStage(3);
        result.current.awardTrophy(1);
        result.current.login('testuser');
      });

      // Reset
      act(() => {
        result.current.resetProgress();
      });

      expect(result.current.currentStage).toBe(1);
      expect(result.current.currentXP).toBe(75); // Initial XP
      expect(result.current.level).toBe('Team Rookie'); // Initial level
      expect(result.current.completedStages).toHaveLength(0);
      expect(result.current.trophies).toHaveLength(0);
      expect(result.current.isLoggedIn).toBe(false);
      expect(result.current.username).toBeUndefined();
    });
  });
});