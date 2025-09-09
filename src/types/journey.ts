export type StageId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type Level = 
  | 'New Explorer' 
  | 'Team Rookie' 
  | 'Skilled Learner' 
  | 'Problem Solver' 
  | 'Project Builder' 
  | 'Pro Team Member';

export const XPThresholds = [0, 50, 100, 150, 230, 280] as const;

export interface LearnerProgress {
  currentStage: StageId;
  currentXP: number;
  level: Level;
  completedStages: StageId[];
  isLoggedIn: boolean;
  username?: string;
}

export interface Stage {
  id: StageId;
  title: string;
  description: string;
  isCompleted: boolean;
  isCurrent: boolean;
  isLocked: boolean;
}

export type Language = 'en' | 'he';