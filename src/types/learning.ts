export type NodeType = 'youtube' | 'article' | 'resource' | 'interactive';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export type ProgressStatus = 
  | 'locked'        // נעול - דורש prerequisites
  | 'available'     // זמין להתחלה
  | 'in-progress'   // בתהליך למידה
  | 'completed'     // הושלם
  | 'bookmarked'    // סומן לשמירה
  | 'review';       // לחזרה

export interface LearningNode {
  id: string;
  title: string;
  subtitle?: string;
  type: NodeType;
  url: string;
  
  // Progressive Unlock Properties
  prerequisites?: string[];  // IDs של נודים שצריך להשלים לפני
  estimatedTime?: number;    // זמן במינוטים
  difficultyLevel?: DifficultyLevel;
  tags?: string[];          // תגיות לסינון וחיפוש
  
  // Metadata
  description?: string;
  author?: string;
  language?: 'en' | 'he';
  
  // Hierarchy
  children?: LearningNode[];
}

export interface NodeProgress {
  nodeId: string;
  status: ProgressStatus;
  
  // Time tracking
  startedAt?: Date;
  completedAt?: Date;
  timeSpent?: number;  // במינוטים
  
  // User feedback
  rating?: number;     // 1-5
  notes?: string;
  
  // Analytics
  visitCount?: number;
  lastVisited?: Date;
}

export interface LearningProgress {
  nodes: Record<string, NodeProgress>;
  totalTimeSpent: number;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate?: Date;
}

export interface UnlockState {
  unlockedNodes: Set<string>;
  recommendedNode?: string;
  nextAvailableNodes: string[];
}
