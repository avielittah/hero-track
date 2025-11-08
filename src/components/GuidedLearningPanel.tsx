import { useState, useEffect, useMemo } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Compass, Sparkles, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { LearningNode, NodeProgress, ProgressStatus } from '@/types/learning';
import { useProgressiveUnlock, getNodeStatus } from '@/hooks/useProgressiveUnlock';
import { NodeCard } from '@/components/learning/NodeCard';

// 📚 LEAN MVP Syllabus - הסילבוס מסודר בהיררכיה ברורה ופשוטה
const learningMap: LearningNode[] = [
  // שלב 1: יסודות - Start Here (תמיד פתוח)
  {
    id: 'foundations',
    title: '1. יסודות והכרות',
    subtitle: 'Start Here - התחל כאן',
    type: 'youtube',
    url: 'https://youtube.com/watch?v=intro',
    estimatedTime: 30,
    difficultyLevel: 'beginner',
    description: 'הכרות ראשונית עם המערכת והמושגים הבסיסיים',
    children: [
      {
        id: 'foundations-basics',
        title: 'מושגי יסוד במערכות',
        type: 'article',
        url: 'https://example.com/basics',
        prerequisites: ['foundations'],
        estimatedTime: 20,
        difficultyLevel: 'beginner',
      },
      {
        id: 'foundations-protocols',
        title: 'פרוטוקולי תקשורת',
        type: 'youtube',
        url: 'https://youtube.com/protocols',
        prerequisites: ['foundations'],
        estimatedTime: 25,
        difficultyLevel: 'beginner',
      },
    ],
  },

  // שלב 2: כלים בסיסיים (נפתח אחרי שלב 1)
  {
    id: 'tools',
    title: '2. כלים וסביבת עבודה',
    subtitle: 'הכלים שתצטרך',
    type: 'youtube',
    url: 'https://youtube.com/tools-intro',
    prerequisites: ['foundations'],
    estimatedTime: 40,
    difficultyLevel: 'beginner',
    description: 'היכרות עם הכלים והתוכנות החיוניות',
    children: [
      {
        id: 'tools-drawio',
        title: 'Draw.io - תרשימים',
        type: 'youtube',
        url: 'https://youtube.com/drawio',
        prerequisites: ['tools'],
        estimatedTime: 30,
        difficultyLevel: 'beginner',
      },
      {
        id: 'tools-git',
        title: 'Git - ניהול גרסאות',
        type: 'article',
        url: 'https://example.com/git',
        prerequisites: ['tools'],
        estimatedTime: 45,
        difficultyLevel: 'beginner',
      },
      {
        id: 'tools-docs',
        title: 'תיעוד ודוקומנטציה',
        type: 'article',
        url: 'https://example.com/documentation',
        prerequisites: ['tools'],
        estimatedTime: 20,
        difficultyLevel: 'beginner',
      },
    ],
  },

  // שלב 3: מערכות תקשורת (נפתח אחרי שלב 1 ו-2)
  {
    id: 'communications',
    title: '3. מערכות תקשורת',
    subtitle: 'עקרונות ליבה',
    type: 'article',
    url: 'https://example.com/communications',
    prerequisites: ['foundations', 'tools'],
    estimatedTime: 60,
    difficultyLevel: 'intermediate',
    description: 'עקרונות מרכזיים במערכות תקשורת',
    children: [
      {
        id: 'communications-signals',
        title: 'עיבוד אותות',
        type: 'youtube',
        url: 'https://youtube.com/signals',
        prerequisites: ['communications'],
        estimatedTime: 45,
        difficultyLevel: 'intermediate',
      },
      {
        id: 'communications-networks',
        title: 'רשתות ותקשורת',
        type: 'article',
        url: 'https://example.com/networks',
        prerequisites: ['communications'],
        estimatedTime: 40,
        difficultyLevel: 'intermediate',
      },
      {
        id: 'communications-wireless',
        title: 'תקשורת אלחוטית',
        type: 'youtube',
        url: 'https://youtube.com/wireless',
        prerequisites: ['communications-signals'],
        estimatedTime: 50,
        difficultyLevel: 'intermediate',
      },
    ],
  },

  // שלב 4: אינטגרציה (נפתח אחרי שלב 3)
  {
    id: 'integration',
    title: '4. אינטגרציית מערכות',
    subtitle: 'חיבור וממשקים',
    type: 'youtube',
    url: 'https://youtube.com/integration',
    prerequisites: ['communications'],
    estimatedTime: 55,
    difficultyLevel: 'intermediate',
    description: 'למד כיצד לחבר מערכות שונות',
    children: [
      {
        id: 'integration-apis',
        title: 'ממשקי API',
        type: 'article',
        url: 'https://example.com/apis',
        prerequisites: ['integration'],
        estimatedTime: 35,
        difficultyLevel: 'intermediate',
      },
      {
        id: 'integration-patterns',
        title: 'תבניות אינטגרציה',
        type: 'resource',
        url: 'https://example.com/patterns',
        prerequisites: ['integration'],
        estimatedTime: 40,
        difficultyLevel: 'intermediate',
      },
    ],
  },

  // שלב 5: בדיקות ואיכות (נפתח אחרי שלב 4)
  {
    id: 'testing',
    title: '5. בדיקות והבטחת איכות',
    subtitle: 'וודא שהכל עובד',
    type: 'youtube',
    url: 'https://youtube.com/testing',
    prerequisites: ['integration'],
    estimatedTime: 50,
    difficultyLevel: 'intermediate',
    description: 'למד איך לבדוק ולוודא איכות',
    children: [
      {
        id: 'testing-unit',
        title: 'בדיקות יחידה',
        type: 'article',
        url: 'https://example.com/unit-tests',
        prerequisites: ['testing'],
        estimatedTime: 35,
        difficultyLevel: 'intermediate',
      },
      {
        id: 'testing-integration',
        title: 'בדיקות אינטגרציה',
        type: 'youtube',
        url: 'https://youtube.com/integration-tests',
        prerequisites: ['testing-unit'],
        estimatedTime: 40,
        difficultyLevel: 'intermediate',
      },
      {
        id: 'testing-debug',
        title: 'טכניקות Debug',
        type: 'article',
        url: 'https://example.com/debugging',
        prerequisites: ['testing'],
        estimatedTime: 30,
        difficultyLevel: 'intermediate',
      },
    ],
  },

  // שלב 6: נושאים מתקדמים (נפתח בסוף)
  {
    id: 'advanced',
    title: '6. נושאים מתקדמים',
    subtitle: 'רמת מומחיות',
    type: 'article',
    url: 'https://example.com/advanced',
    prerequisites: ['testing'],
    estimatedTime: 90,
    difficultyLevel: 'advanced',
    description: 'נושאים מתקדמים לרמת מומחיות',
    children: [
      {
        id: 'advanced-optimization',
        title: 'אופטימיזציה',
        type: 'youtube',
        url: 'https://youtube.com/optimization',
        prerequisites: ['advanced'],
        estimatedTime: 60,
        difficultyLevel: 'advanced',
      },
      {
        id: 'advanced-security',
        title: 'אבטחה ו-Best Practices',
        type: 'article',
        url: 'https://example.com/security',
        prerequisites: ['advanced'],
        estimatedTime: 55,
        difficultyLevel: 'advanced',
      },
      {
        id: 'advanced-cloud',
        title: 'ארכיטקטורת Cloud',
        type: 'youtube',
        url: 'https://youtube.com/cloud',
        prerequisites: ['advanced-optimization'],
        estimatedTime: 70,
        difficultyLevel: 'advanced',
      },
    ],
  },
];

// Helper to get all node IDs
const getAllNodeIds = (nodes: LearningNode[]): string[] => {
  const ids: string[] = [];
  const traverse = (node: LearningNode) => {
    ids.push(node.id);
    if (node.children) {
      node.children.forEach(traverse);
    }
  };
  nodes.forEach(traverse);
  return ids;
};

// Helper to create all nodes map
const createNodesMap = (nodes: LearningNode[]): Map<string, LearningNode> => {
  const map = new Map<string, LearningNode>();
  const traverse = (node: LearningNode) => {
    map.set(node.id, node);
    if (node.children) {
      node.children.forEach(traverse);
    }
  };
  nodes.forEach(traverse);
  return map;
};

export const GuidedLearningPanel = () => {
  // Load progress from localStorage
  const [progress, setProgress] = useState<Record<string, NodeProgress>>(() => {
    const saved = localStorage.getItem('guidedLearning_progress');
    return saved ? JSON.parse(saved) : {};
  });

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem('guidedLearning_progress', JSON.stringify(progress));
  }, [progress]);

  // Use progressive unlock hook
  const { unlockedNodes, recommendedNode, nextAvailableNodes } = useProgressiveUnlock({
    learningMap,
    progress
  });

  const allNodes = useMemo(() => createNodesMap(learningMap), []);
  const allNodeIds = useMemo(() => getAllNodeIds(learningMap), []);

  const handleVisit = (nodeId: string) => {
    setProgress(prev => ({
      ...prev,
      [nodeId]: {
        ...prev[nodeId],
        nodeId,
        status: prev[nodeId]?.status || 'in-progress',
        lastVisited: new Date(),
        visitCount: (prev[nodeId]?.visitCount || 0) + 1,
      }
    }));
  };

  const handleStatusChange = (nodeId: string, status: ProgressStatus) => {
    setProgress(prev => ({
      ...prev,
      [nodeId]: {
        ...prev[nodeId],
        nodeId,
        status,
        ...(status === 'completed' && !prev[nodeId]?.completedAt && {
          completedAt: new Date()
        }),
        ...(status === 'in-progress' && !prev[nodeId]?.startedAt && {
          startedAt: new Date()
        })
      }
    }));
  };

  // Calculate statistics
  const completedCount = Object.values(progress).filter(p => p.status === 'completed').length;
  const progressPercentage = (completedCount / allNodeIds.length) * 100;
  const availableCount = nextAvailableNodes.length;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="default"
          size="lg"
          className="fixed right-0 top-1/2 -translate-y-1/2 rounded-r-none rounded-l-lg shadow-lg z-40 px-3 py-6 writing-mode-vertical bg-gradient-to-b from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
          style={{ writingMode: 'vertical-rl' }}
        >
          <Compass className="w-5 h-5 mb-2 rotate-90" />
          <span className="font-bold text-sm tracking-wider">GUIDED LEARNING</span>
        </Button>
      </SheetTrigger>
      
      <SheetContent side="right" className="w-full sm:max-w-3xl overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="flex items-center gap-3 text-2xl">
            <div className="p-3 rounded-full bg-gradient-to-br from-primary to-primary/60">
              <Compass className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h2 className="font-bold">Guided Learning Map</h2>
              <p className="text-sm text-muted-foreground font-normal">
                Progressive learning path with unlockable content
              </p>
            </div>
          </SheetTitle>
        </SheetHeader>

        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-foreground">Your Progress</span>
            <div className="flex gap-2">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                {completedCount}/{allNodeIds.length} Completed
              </Badge>
              <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-200">
                {availableCount} Available
              </Badge>
            </div>
          </div>
          <Progress value={progressPercentage} className="h-2 mb-2" />
          <p className="text-xs text-muted-foreground">
            {progressPercentage.toFixed(0)}% Complete • Keep learning!
          </p>
        </motion.div>

        {/* Recommended Next Step */}
        {recommendedNode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-2 border-blue-500/30"
          >
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-blue-500" />
              <span className="font-semibold text-foreground">Recommended Next</span>
              <Badge variant="default" className="ml-auto">
                <TrendingUp className="w-3 h-3 mr-1" />
                Continue Here
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Based on your progress, we recommend: <strong>{allNodes.get(recommendedNode)?.title}</strong>
            </p>
          </motion.div>
        )}

        {/* Learning Path */}
        <div className="relative mb-8">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-transparent" />
          
          <div className="space-y-4">
            {learningMap.map((node, index) => {
              const status = getNodeStatus(node.id, progress, unlockedNodes);
              const isRecommended = node.id === recommendedNode;
              
              return (
                <NodeCard 
                  key={node.id} 
                  node={node} 
                  index={index}
                  status={status}
                  isRecommended={isRecommended}
                  progress={progress}
                  allNodes={allNodes}
                  onVisit={handleVisit}
                  onStatusChange={handleStatusChange}
                />
              );
            })}
          </div>
        </div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 p-4 rounded-lg bg-muted/50 border border-border"
        >
          <p className="text-sm text-muted-foreground text-center">
            💡 Complete topics to unlock new content • Topics with prerequisites are locked until requirements are met
          </p>
        </motion.div>
      </SheetContent>
    </Sheet>
  );
};
