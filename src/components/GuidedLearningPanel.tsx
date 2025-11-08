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

// תוכן דוגמה מורחב עם prerequisites וזמנים משוערים
const learningMap: LearningNode[] = [
  {
    id: '1',
    title: 'Introduction to Systems',
    subtitle: 'Getting Started - Foundations',
    type: 'youtube',
    url: 'https://youtube.com/watch?v=example1',
    estimatedTime: 45,
    difficultyLevel: 'beginner',
    tags: ['foundations', 'intro'],
    description: 'Learn the basic concepts of communication systems and network architecture.',
    children: [
      {
        id: '1.1',
        title: 'System Architecture Basics',
        type: 'article',
        url: 'https://example.com/architecture',
        prerequisites: ['1'],
        estimatedTime: 30,
        difficultyLevel: 'beginner',
        tags: ['architecture'],
      },
      {
        id: '1.2',
        title: 'Communication Protocols',
        type: 'resource',
        url: 'https://example.com/protocols',
        prerequisites: ['1'],
        estimatedTime: 40,
        difficultyLevel: 'beginner',
        tags: ['protocols', 'networking'],
      },
      {
        id: '1.3',
        title: 'Network Fundamentals',
        type: 'youtube',
        url: 'https://youtube.com/watch?v=network',
        prerequisites: ['1.1'],
        estimatedTime: 35,
        difficultyLevel: 'beginner',
        tags: ['networking'],
      },
      {
        id: '1.4',
        title: 'OSI Model Explained',
        type: 'article',
        url: 'https://example.com/osi-model',
        prerequisites: ['1.2', '1.3'],
        estimatedTime: 25,
        difficultyLevel: 'intermediate',
        tags: ['osi', 'protocols'],
      },
    ],
  },
  {
    id: '2',
    title: 'Technical Tools & Software',
    subtitle: 'Essential Skills & Workflows',
    type: 'youtube',
    url: 'https://youtube.com/watch?v=tools',
    prerequisites: ['1'],
    estimatedTime: 50,
    difficultyLevel: 'beginner',
    tags: ['tools', 'software'],
    description: 'Master the essential tools and software used in communication systems engineering.',
    children: [
      {
        id: '2.1',
        title: 'Draw.io Complete Guide',
        type: 'youtube',
        url: 'https://youtube.com/watch?v=drawio',
        prerequisites: ['2'],
        estimatedTime: 40,
        difficultyLevel: 'beginner',
        tags: ['diagrams', 'visualization'],
      },
      {
        id: '2.2',
        title: 'VLC Advanced Features',
        type: 'article',
        url: 'https://example.com/vlc',
        prerequisites: ['2'],
        estimatedTime: 20,
        difficultyLevel: 'beginner',
        tags: ['media', 'tools'],
      },
      {
        id: '2.3',
        title: 'Git & Version Control',
        type: 'resource',
        url: 'https://example.com/git',
        prerequisites: ['2'],
        estimatedTime: 60,
        difficultyLevel: 'intermediate',
        tags: ['git', 'version-control'],
      },
      {
        id: '2.4',
        title: 'Documentation Best Practices',
        type: 'article',
        url: 'https://example.com/docs',
        prerequisites: ['2.1'],
        estimatedTime: 30,
        difficultyLevel: 'beginner',
        tags: ['documentation'],
      },
      {
        id: '2.5',
        title: 'Command Line Mastery',
        type: 'youtube',
        url: 'https://youtube.com/watch?v=cli',
        prerequisites: ['2.3'],
        estimatedTime: 45,
        difficultyLevel: 'intermediate',
        tags: ['cli', 'terminal'],
      },
    ],
  },
  {
    id: '3',
    title: 'Communication Systems',
    subtitle: 'Core Engineering Concepts',
    type: 'article',
    url: 'https://example.com/comm-systems',
    prerequisites: ['1.4', '2'],
    estimatedTime: 90,
    difficultyLevel: 'intermediate',
    tags: ['engineering', 'systems'],
    description: 'Deep dive into communication systems theory and practical applications.',
    children: [
      {
        id: '3.1',
        title: 'Signal Processing Intro',
        type: 'youtube',
        url: 'https://youtube.com/watch?v=signals',
        prerequisites: ['3'],
        estimatedTime: 55,
        difficultyLevel: 'intermediate',
        tags: ['signals', 'dsp'],
      },
      {
        id: '3.2',
        title: 'Digital vs Analog Systems',
        type: 'article',
        url: 'https://example.com/digital-analog',
        prerequisites: ['3'],
        estimatedTime: 40,
        difficultyLevel: 'intermediate',
        tags: ['digital', 'analog'],
      },
      {
        id: '3.3',
        title: 'Modulation Techniques',
        type: 'resource',
        url: 'https://example.com/modulation',
        prerequisites: ['3.1', '3.2'],
        estimatedTime: 70,
        difficultyLevel: 'advanced',
        tags: ['modulation', 'advanced'],
      },
      {
        id: '3.4',
        title: 'Wireless Communication',
        type: 'youtube',
        url: 'https://youtube.com/watch?v=wireless',
        prerequisites: ['3.3'],
        estimatedTime: 60,
        difficultyLevel: 'advanced',
        tags: ['wireless', '5g'],
      },
    ],
  },
  {
    id: '4',
    title: 'System Integration',
    subtitle: 'Connecting Components',
    type: 'resource',
    url: 'https://example.com/integration',
    prerequisites: ['2.5', '3'],
    estimatedTime: 80,
    difficultyLevel: 'intermediate',
    tags: ['integration', 'apis'],
    description: 'Learn how to integrate different systems and components effectively.',
    children: [
      {
        id: '4.1',
        title: 'API Design Principles',
        type: 'article',
        url: 'https://example.com/api-design',
        prerequisites: ['4'],
        estimatedTime: 50,
        difficultyLevel: 'intermediate',
        tags: ['api', 'design'],
      },
      {
        id: '4.2',
        title: 'Microservices Architecture',
        type: 'youtube',
        url: 'https://youtube.com/watch?v=microservices',
        prerequisites: ['4.1'],
        estimatedTime: 65,
        difficultyLevel: 'advanced',
        tags: ['microservices', 'architecture'],
      },
      {
        id: '4.3',
        title: 'Integration Patterns',
        type: 'resource',
        url: 'https://example.com/patterns',
        prerequisites: ['4.1'],
        estimatedTime: 45,
        difficultyLevel: 'intermediate',
        tags: ['patterns', 'integration'],
      },
    ],
  },
  {
    id: '5',
    title: 'Testing & Quality Assurance',
    subtitle: 'Ensuring Reliability',
    type: 'youtube',
    url: 'https://youtube.com/watch?v=testing',
    prerequisites: ['4'],
    estimatedTime: 70,
    difficultyLevel: 'intermediate',
    tags: ['testing', 'qa'],
    description: 'Master testing methodologies and quality assurance practices.',
    children: [
      {
        id: '5.1',
        title: 'Unit Testing Fundamentals',
        type: 'article',
        url: 'https://example.com/unit-testing',
        prerequisites: ['5'],
        estimatedTime: 40,
        difficultyLevel: 'intermediate',
        tags: ['testing', 'unit-tests'],
      },
      {
        id: '5.2',
        title: 'Integration Testing',
        type: 'youtube',
        url: 'https://youtube.com/watch?v=integration-test',
        prerequisites: ['5.1'],
        estimatedTime: 50,
        difficultyLevel: 'intermediate',
        tags: ['testing', 'integration'],
      },
      {
        id: '5.3',
        title: 'Performance Testing',
        type: 'resource',
        url: 'https://example.com/performance',
        prerequisites: ['5.2'],
        estimatedTime: 60,
        difficultyLevel: 'advanced',
        tags: ['performance', 'testing'],
      },
      {
        id: '5.4',
        title: 'Debugging Techniques',
        type: 'article',
        url: 'https://example.com/debugging',
        prerequisites: ['5.1'],
        estimatedTime: 35,
        difficultyLevel: 'intermediate',
        tags: ['debugging'],
      },
    ],
  },
  {
    id: '6',
    title: 'Advanced Topics',
    subtitle: 'Mastery Level',
    type: 'article',
    url: 'https://example.com/advanced',
    prerequisites: ['3.4', '5'],
    estimatedTime: 120,
    difficultyLevel: 'advanced',
    tags: ['advanced', 'mastery'],
    description: 'Advanced concepts for mastering communication systems engineering.',
    children: [
      {
        id: '6.1',
        title: 'System Optimization',
        type: 'youtube',
        url: 'https://youtube.com/watch?v=optimization',
        prerequisites: ['6'],
        estimatedTime: 75,
        difficultyLevel: 'advanced',
        tags: ['optimization', 'performance'],
      },
      {
        id: '6.2',
        title: 'Security Best Practices',
        type: 'article',
        url: 'https://example.com/security',
        prerequisites: ['6'],
        estimatedTime: 80,
        difficultyLevel: 'advanced',
        tags: ['security', 'best-practices'],
      },
      {
        id: '6.3',
        title: 'Scalability Patterns',
        type: 'resource',
        url: 'https://example.com/scalability',
        prerequisites: ['6.1'],
        estimatedTime: 90,
        difficultyLevel: 'advanced',
        tags: ['scalability', 'architecture'],
      },
      {
        id: '6.4',
        title: 'Cloud Architecture',
        type: 'youtube',
        url: 'https://youtube.com/watch?v=cloud',
        prerequisites: ['6.2', '6.3'],
        estimatedTime: 100,
        difficultyLevel: 'advanced',
        tags: ['cloud', 'aws', 'azure'],
      },
      {
        id: '6.5',
        title: 'DevOps Practices',
        type: 'article',
        url: 'https://example.com/devops',
        prerequisites: ['6.4'],
        estimatedTime: 85,
        difficultyLevel: 'advanced',
        tags: ['devops', 'ci-cd'],
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
