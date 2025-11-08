import { useMemo, useCallback } from 'react';
import { LearningNode, NodeProgress, ProgressStatus, UnlockState } from '@/types/learning';

interface UseProgressiveUnlockProps {
  learningMap: LearningNode[];
  progress: Record<string, NodeProgress>;
}

/**
 * Hook לניהול לוגיקת Progressive Unlock
 * מחשב אילו נודים זמינים, נעולים, ומומלצים על בסיס prerequisites והתקדמות
 */
export const useProgressiveUnlock = ({ 
  learningMap, 
  progress 
}: UseProgressiveUnlockProps): UnlockState => {
  
  // יצירת מפה של כל הנודים (כולל ילדים) לפי ID
  const allNodes = useMemo(() => {
    const nodes = new Map<string, LearningNode>();
    
    const traverse = (node: LearningNode) => {
      nodes.set(node.id, node);
      if (node.children) {
        node.children.forEach(traverse);
      }
    };
    
    learningMap.forEach(traverse);
    return nodes;
  }, [learningMap]);

  // בדיקה האם נוד עומד בדרישות הקדם
  const meetsPrerequisites = useCallback((node: LearningNode): boolean => {
    if (!node.prerequisites || node.prerequisites.length === 0) {
      return true;
    }
    
    return node.prerequisites.every(prereqId => {
      const prereqProgress = progress[prereqId];
      return prereqProgress?.status === 'completed';
    });
  }, [progress]);

  // חישוב נודים פתוחים
  const unlockedNodes = useMemo(() => {
    const unlocked = new Set<string>();
    
    allNodes.forEach((node, nodeId) => {
      // אם אין prerequisites או שכולם הושלמו - הנוד פתוח
      if (meetsPrerequisites(node)) {
        unlocked.add(nodeId);
      }
    });
    
    return unlocked;
  }, [allNodes, meetsPrerequisites]);

  // מציאת נודים זמינים שעדיין לא הושלמו
  const nextAvailableNodes = useMemo(() => {
    return Array.from(unlockedNodes).filter(nodeId => {
      const nodeProgress = progress[nodeId];
      return !nodeProgress || 
             (nodeProgress.status !== 'completed' && 
              nodeProgress.status !== 'locked');
    });
  }, [unlockedNodes, progress]);

  // המלצה על הנוד הבא ללמידה
  const recommendedNode = useMemo(() => {
    if (nextAvailableNodes.length === 0) return undefined;

    // אלגוריתם המלצה: 
    // 1. העדפה לנודים שכבר התחילו (in-progress)
    // 2. העדפה לנודים ברמת קושי מתאימה
    // 3. העדפה לנודים עם זמן קצר יותר
    
    const inProgress = nextAvailableNodes.find(nodeId => 
      progress[nodeId]?.status === 'in-progress'
    );
    if (inProgress) return inProgress;

    const bookmarked = nextAvailableNodes.find(nodeId => 
      progress[nodeId]?.status === 'bookmarked'
    );
    if (bookmarked) return bookmarked;

    // חיפוש נוד עם הכי פחות prerequisites (נוד "שורש" זמין)
    const sortedByDifficulty = nextAvailableNodes
      .map(nodeId => ({
        nodeId,
        node: allNodes.get(nodeId)!,
        prereqCount: allNodes.get(nodeId)?.prerequisites?.length || 0
      }))
      .sort((a, b) => {
        // קודם כל לפי מספר prerequisites
        if (a.prereqCount !== b.prereqCount) {
          return a.prereqCount - b.prereqCount;
        }
        // אחר כך לפי זמן משוער
        const timeA = a.node.estimatedTime || 999;
        const timeB = b.node.estimatedTime || 999;
        return timeA - timeB;
      });

    return sortedByDifficulty[0]?.nodeId;
  }, [nextAvailableNodes, progress, allNodes]);

  return {
    unlockedNodes,
    recommendedNode,
    nextAvailableNodes
  };
};

/**
 * פונקציה עוזרת לקבלת סטטוס נוד
 */
export const getNodeStatus = (
  nodeId: string,
  progress: Record<string, NodeProgress>,
  unlockedNodes: Set<string>
): ProgressStatus => {
  const nodeProgress = progress[nodeId];
  
  // אם יש סטטוס מפורש - החזר אותו
  if (nodeProgress?.status) {
    return nodeProgress.status;
  }
  
  // אם הנוד לא פתוח - הוא נעול
  if (!unlockedNodes.has(nodeId)) {
    return 'locked';
  }
  
  // אחרת - זמין
  return 'available';
};
