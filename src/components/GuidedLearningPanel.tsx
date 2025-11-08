import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, ExternalLink, Youtube, FileText, Link2, Compass, CheckCircle2, Circle } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LearningNode {
  id: string;
  title: string;
  subtitle?: string;
  type: 'youtube' | 'article' | 'resource';
  url: string;
  completed?: boolean;
  children?: LearningNode[];
}

// תוכן דוגמה - ניתן להחליף בתוכן אמיתי
const learningMap: LearningNode[] = [
  {
    id: '1',
    title: 'Introduction to Systems',
    subtitle: 'Getting Started - Foundations',
    type: 'youtube',
    url: 'https://youtube.com/watch?v=example1',
    children: [
      {
        id: '1.1',
        title: 'System Architecture Basics',
        type: 'article',
        url: 'https://example.com/architecture',
      },
      {
        id: '1.2',
        title: 'Communication Protocols',
        type: 'resource',
        url: 'https://example.com/protocols',
      },
      {
        id: '1.3',
        title: 'Network Fundamentals',
        type: 'youtube',
        url: 'https://youtube.com/watch?v=network',
      },
      {
        id: '1.4',
        title: 'OSI Model Explained',
        type: 'article',
        url: 'https://example.com/osi-model',
      },
    ],
  },
  {
    id: '2',
    title: 'Technical Tools & Software',
    subtitle: 'Essential Skills & Workflows',
    type: 'youtube',
    url: 'https://youtube.com/watch?v=tools',
    children: [
      {
        id: '2.1',
        title: 'Draw.io Complete Guide',
        type: 'youtube',
        url: 'https://youtube.com/watch?v=drawio',
      },
      {
        id: '2.2',
        title: 'VLC Advanced Features',
        type: 'article',
        url: 'https://example.com/vlc',
      },
      {
        id: '2.3',
        title: 'Git & Version Control',
        type: 'resource',
        url: 'https://example.com/git',
      },
      {
        id: '2.4',
        title: 'Documentation Best Practices',
        type: 'article',
        url: 'https://example.com/docs',
      },
      {
        id: '2.5',
        title: 'Command Line Mastery',
        type: 'youtube',
        url: 'https://youtube.com/watch?v=cli',
      },
    ],
  },
  {
    id: '3',
    title: 'Communication Systems',
    subtitle: 'Core Engineering Concepts',
    type: 'article',
    url: 'https://example.com/comm-systems',
    children: [
      {
        id: '3.1',
        title: 'Signal Processing Intro',
        type: 'youtube',
        url: 'https://youtube.com/watch?v=signals',
      },
      {
        id: '3.2',
        title: 'Digital vs Analog Systems',
        type: 'article',
        url: 'https://example.com/digital-analog',
      },
      {
        id: '3.3',
        title: 'Modulation Techniques',
        type: 'resource',
        url: 'https://example.com/modulation',
      },
      {
        id: '3.4',
        title: 'Wireless Communication',
        type: 'youtube',
        url: 'https://youtube.com/watch?v=wireless',
      },
    ],
  },
  {
    id: '4',
    title: 'System Integration',
    subtitle: 'Connecting Components',
    type: 'resource',
    url: 'https://example.com/integration',
    children: [
      {
        id: '4.1',
        title: 'API Design Principles',
        type: 'article',
        url: 'https://example.com/api-design',
      },
      {
        id: '4.2',
        title: 'Microservices Architecture',
        type: 'youtube',
        url: 'https://youtube.com/watch?v=microservices',
      },
      {
        id: '4.3',
        title: 'Integration Patterns',
        type: 'resource',
        url: 'https://example.com/patterns',
      },
    ],
  },
  {
    id: '5',
    title: 'Testing & Quality Assurance',
    subtitle: 'Ensuring Reliability',
    type: 'youtube',
    url: 'https://youtube.com/watch?v=testing',
    children: [
      {
        id: '5.1',
        title: 'Unit Testing Fundamentals',
        type: 'article',
        url: 'https://example.com/unit-testing',
      },
      {
        id: '5.2',
        title: 'Integration Testing',
        type: 'youtube',
        url: 'https://youtube.com/watch?v=integration-test',
      },
      {
        id: '5.3',
        title: 'Performance Testing',
        type: 'resource',
        url: 'https://example.com/performance',
      },
      {
        id: '5.4',
        title: 'Debugging Techniques',
        type: 'article',
        url: 'https://example.com/debugging',
      },
    ],
  },
  {
    id: '6',
    title: 'Advanced Topics',
    subtitle: 'Mastery Level',
    type: 'article',
    url: 'https://example.com/advanced',
    children: [
      {
        id: '6.1',
        title: 'System Optimization',
        type: 'youtube',
        url: 'https://youtube.com/watch?v=optimization',
      },
      {
        id: '6.2',
        title: 'Security Best Practices',
        type: 'article',
        url: 'https://example.com/security',
      },
      {
        id: '6.3',
        title: 'Scalability Patterns',
        type: 'resource',
        url: 'https://example.com/scalability',
      },
      {
        id: '6.4',
        title: 'Cloud Architecture',
        type: 'youtube',
        url: 'https://youtube.com/watch?v=cloud',
      },
      {
        id: '6.5',
        title: 'DevOps Practices',
        type: 'article',
        url: 'https://example.com/devops',
      },
    ],
  },
];

const NodeCard = ({ 
  node, 
  index, 
  depth = 0,
  visitedNodes,
  onVisit
}: { 
  node: LearningNode; 
  index: number; 
  depth?: number;
  visitedNodes: Set<string>;
  onVisit: (nodeId: string) => void;
}) => {
  const [expanded, setExpanded] = useState(false);
  const isVisited = visitedNodes.has(node.id);
  
  // Auto-expand if any child is visited
  useEffect(() => {
    if (node.children) {
      const hasVisitedChild = node.children.some(child => visitedNodes.has(child.id));
      if (hasVisitedChild) {
        setExpanded(true);
      }
    }
  }, [visitedNodes, node.children]);
  
  const getIcon = () => {
    switch (node.type) {
      case 'youtube':
        return <Youtube className="w-4 h-4" />;
      case 'article':
        return <FileText className="w-4 h-4" />;
      case 'resource':
        return <Link2 className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  const getTypeColor = () => {
    switch (node.type) {
      case 'youtube':
        return 'bg-red-500/10 text-red-600 border-red-200';
      case 'article':
        return 'bg-blue-500/10 text-blue-600 border-blue-200';
      case 'resource':
        return 'bg-green-500/10 text-green-600 border-green-200';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={cn('relative', depth > 0 && 'ml-8 mt-4')}
    >
      {/* Connection Line for Children */}
      {depth > 0 && (
        <div className="absolute -left-8 top-6 w-8 h-0.5 bg-gradient-to-r from-primary/30 to-primary/10" />
      )}
      
      {/* Main Card */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          'p-4 rounded-lg border-2 transition-all cursor-pointer',
          'bg-card hover:shadow-lg hover:border-primary/50',
          isVisited && 'border-green-500/50 bg-green-500/5',
          node.completed && 'border-green-500/70 bg-green-500/10'
        )}
        onClick={() => {
          if (node.children && node.children.length > 0) {
            setExpanded(!expanded);
          } else {
            onVisit(node.id);
            window.open(node.url, '_blank');
          }
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <div className={cn('p-2 rounded-full', getTypeColor())}>
                {getIcon()}
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{node.title}</h3>
                {node.subtitle && (
                  <p className="text-sm text-muted-foreground">{node.subtitle}</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {isVisited ? (
              <div className="flex items-center gap-1 text-green-600">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-xs font-medium">Visited</span>
              </div>
            ) : (
              <Circle className="w-5 h-5 text-muted-foreground/30" />
            )}
            {(!node.children || node.children.length === 0) && (
              <ExternalLink className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
        </div>
      </motion.div>

      {/* Children Nodes */}
      {node.children && node.children.length > 0 && expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-2"
        >
          {node.children.map((child, idx) => (
            <NodeCard 
              key={child.id} 
              node={child} 
              index={idx} 
              depth={depth + 1}
              visitedNodes={visitedNodes}
              onVisit={onVisit}
            />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

// Helper function to get all node IDs (including children)
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

// Helper function to count visited nodes
const countVisitedNodes = (visitedNodes: Set<string>, totalNodes: string[]): number => {
  return totalNodes.filter(id => visitedNodes.has(id)).length;
};

export const GuidedLearningPanel = () => {
  // Load visited nodes from localStorage
  const [visitedNodes, setVisitedNodes] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('guidedLearning_visited');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  // Save to localStorage whenever visitedNodes changes
  useEffect(() => {
    localStorage.setItem('guidedLearning_visited', JSON.stringify([...visitedNodes]));
  }, [visitedNodes]);

  const handleVisit = (nodeId: string) => {
    setVisitedNodes(prev => new Set([...prev, nodeId]));
  };

  const allNodeIds = getAllNodeIds(learningMap);
  const visitedCount = countVisitedNodes(visitedNodes, allNodeIds);
  const progressPercentage = (visitedCount / allNodeIds.length) * 100;

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
      
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="flex items-center gap-3 text-2xl">
            <div className="p-3 rounded-full bg-gradient-to-br from-primary to-primary/60">
              <Compass className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h2 className="font-bold">Guided Learning Map</h2>
              <p className="text-sm text-muted-foreground font-normal">
                Explore the syllabus and external resources
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
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-foreground">Your Progress</span>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
              {visitedCount}/{allNodeIds.length} Topics
            </Badge>
          </div>
          <Progress value={progressPercentage} className="h-2 mb-2" />
          <p className="text-xs text-muted-foreground">
            {progressPercentage.toFixed(0)}% Complete • Keep exploring!
          </p>
        </motion.div>

        {/* Journey Path Visualization */}
        <div className="relative mb-8">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-transparent" />
          
          <div className="space-y-6">
            {learningMap.map((node, index) => (
              <NodeCard 
                key={node.id} 
                node={node} 
                index={index}
                visitedNodes={visitedNodes}
                onVisit={handleVisit}
              />
            ))}
          </div>
        </div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 p-4 rounded-lg bg-muted/50 border border-border"
        >
          <p className="text-sm text-muted-foreground text-center">
            💡 Click on any topic to explore external resources and expand your knowledge
          </p>
        </motion.div>
      </SheetContent>
    </Sheet>
  );
};
