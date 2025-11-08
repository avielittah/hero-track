import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, ExternalLink, Youtube, FileText, Link2, Compass, CheckCircle2, Circle, X, ArrowRight, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import Confetti from 'react-confetti';

interface LearningNode {
  id: string;
  title: string;
  subtitle?: string;
  type: 'youtube' | 'article' | 'resource';
  url: string;
  completed?: boolean;
  children?: LearningNode[];
}

const learningMap: LearningNode[] = [
  {
    id: '1',
    title: 'Welcome & Orientation',
    subtitle: 'Foundation',
    type: 'youtube',
    url: 'https://youtube.com',
    children: [
      { id: '1.1', title: 'Company Overview', type: 'article', url: 'https://example.com/overview' },
      { id: '1.2', title: 'Team Structure', type: 'resource', url: 'https://example.com/team' },
      { id: '1.3', title: 'Core Values', type: 'article', url: 'https://example.com/values' },
      { id: '1.4', title: 'Success Criteria', type: 'resource', url: 'https://example.com/success' },
    ],
  },
  {
    id: '2',
    title: 'System Architecture',
    subtitle: 'Technical Foundation',
    type: 'youtube',
    url: 'https://youtube.com',
    children: [
      { id: '2.1', title: 'System Overview', type: 'youtube', url: 'https://youtube.com' },
      { id: '2.2', title: 'Architecture Patterns', type: 'article', url: 'https://example.com/patterns' },
      { id: '2.3', title: 'Data Flow', type: 'resource', url: 'https://example.com/dataflow' },
      { id: '2.4', title: 'API Design', type: 'article', url: 'https://example.com/api' },
      { id: '2.5', title: 'Microservices', type: 'youtube', url: 'https://youtube.com' },
    ],
  },
  {
    id: '3',
    title: 'Essential Tools',
    subtitle: 'Technical Skills',
    type: 'youtube',
    url: 'https://youtube.com',
    children: [
      { id: '3.1', title: 'Draw.io Fundamentals', type: 'youtube', url: 'https://youtube.com' },
      { id: '3.2', title: 'VLC Media Player', type: 'article', url: 'https://example.com/vlc' },
      { id: '3.3', title: 'Git & Version Control', type: 'resource', url: 'https://example.com/git' },
      { id: '3.4', title: 'Debugging Tools', type: 'article', url: 'https://example.com/debug' },
    ],
  },
  {
    id: '4',
    title: 'Communication Protocols',
    subtitle: 'Integration',
    type: 'article',
    url: 'https://example.com',
    children: [
      { id: '4.1', title: 'HTTP/HTTPS Basics', type: 'article', url: 'https://example.com/http' },
      { id: '4.2', title: 'WebSockets', type: 'youtube', url: 'https://youtube.com' },
      { id: '4.3', title: 'REST API Best Practices', type: 'resource', url: 'https://example.com/rest' },
      { id: '4.4', title: 'GraphQL Introduction', type: 'article', url: 'https://example.com/graphql' },
    ],
  },
  {
    id: '5',
    title: 'Advanced Development',
    subtitle: 'Professional Skills',
    type: 'youtube',
    url: 'https://youtube.com',
    children: [
      { id: '5.1', title: 'Design Patterns', type: 'article', url: 'https://example.com/patterns' },
      { id: '5.2', title: 'Testing Strategies', type: 'youtube', url: 'https://youtube.com' },
      { id: '5.3', title: 'CI/CD Pipelines', type: 'resource', url: 'https://example.com/cicd' },
      { id: '5.4', title: 'Performance Optimization', type: 'article', url: 'https://example.com/perf' },
      { id: '5.5', title: 'Security Best Practices', type: 'resource', url: 'https://example.com/security' },
    ],
  },
  {
    id: '6',
    title: 'System Integration',
    subtitle: 'Advanced',
    type: 'resource',
    url: 'https://example.com',
    children: [
      { id: '6.1', title: 'Third-Party APIs', type: 'article', url: 'https://example.com/apis' },
      { id: '6.2', title: 'Database Integration', type: 'youtube', url: 'https://youtube.com' },
      { id: '6.3', title: 'Cloud Services', type: 'resource', url: 'https://example.com/cloud' },
      { id: '6.4', title: 'Monitoring & Logging', type: 'article', url: 'https://example.com/monitoring' },
    ],
  },
  {
    id: '7',
    title: 'Team Collaboration',
    subtitle: 'Soft Skills',
    type: 'article',
    url: 'https://example.com',
    children: [
      { id: '7.1', title: 'Code Review Process', type: 'article', url: 'https://example.com/review' },
      { id: '7.2', title: 'Agile Methodology', type: 'youtube', url: 'https://youtube.com' },
      { id: '7.3', title: 'Documentation Standards', type: 'resource', url: 'https://example.com/docs' },
      { id: '7.4', title: 'Effective Communication', type: 'article', url: 'https://example.com/comm' },
    ],
  },
  {
    id: '8',
    title: 'Best Practices & Mastery',
    subtitle: 'Expert Level',
    type: 'youtube',
    url: 'https://youtube.com',
    children: [
      { id: '8.1', title: 'Code Quality', type: 'article', url: 'https://example.com/quality' },
      { id: '8.2', title: 'Scalability Patterns', type: 'youtube', url: 'https://youtube.com' },
      { id: '8.3', title: 'Leadership Skills', type: 'resource', url: 'https://example.com/leadership' },
      { id: '8.4', title: 'Continuous Learning', type: 'article', url: 'https://example.com/learning' },
    ],
  },
];

const NodeCard = ({ 
  node, 
  index, 
  depth = 0,
  completedNodes,
  onToggleComplete 
}: { 
  node: LearningNode; 
  index: number; 
  depth?: number;
  completedNodes: Set<string>;
  onToggleComplete: (id: string) => void;
}) => {
  const [expanded, setExpanded] = useState(false);
  const isCompleted = completedNodes.has(node.id);
  
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
      transition={{ delay: index * 0.05 }}
      className={cn('relative', depth > 0 && 'ml-8 mt-3')}
    >
      {/* Connection Line */}
      {depth > 0 && (
        <div className="absolute -left-8 top-7 w-8 h-0.5 bg-gradient-to-r from-primary/30 to-primary/10" />
      )}
      
      {/* Vertical Flow Line */}
      {depth === 0 && index > 0 && (
        <div className="absolute left-6 -top-3 w-0.5 h-3 bg-gradient-to-b from-primary/30 to-transparent" />
      )}
      
      {/* Main Card */}
      <motion.div
        id={`node-${node.id}`}
        whileHover={{ scale: 1.01 }}
        className={cn(
          'p-4 rounded-lg border-2 transition-all',
          'bg-card hover:shadow-lg hover:border-primary/50',
          isCompleted && 'border-primary/50 bg-primary/5'
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div 
            className="flex-1 cursor-pointer"
            onClick={() => {
              if (node.children && node.children.length > 0) {
                setExpanded(!expanded);
              } else {
                window.open(node.url, '_blank');
              }
            }}
          >
            <div className="flex items-center gap-3">
              <div className={cn('p-2 rounded-full', getTypeColor())}>
                {getIcon()}
              </div>
              <div className="flex-1">
                <h3 className={cn('font-semibold text-foreground', isCompleted && 'line-through opacity-70')}>
                  {node.title}
                </h3>
                {node.subtitle && (
                  <p className="text-sm text-muted-foreground">{node.subtitle}</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onToggleComplete(node.id);
              }}
              className="h-8 w-8 p-0"
            >
              {isCompleted ? (
                <CheckCircle2 className="w-5 h-5 text-primary" />
              ) : (
                <Circle className="w-5 h-5 text-muted-foreground" />
              )}
            </Button>
            {(!node.children || node.children.length === 0) && (
              <ExternalLink className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
        </div>
      </motion.div>

      {/* Children Nodes */}
      <AnimatePresence>
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
                completedNodes={completedNodes}
                onToggleComplete={onToggleComplete}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const OnboardingSection = ({ onDismiss }: { onDismiss: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    className="mb-8 p-6 rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-2 border-primary/20"
  >
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-full bg-primary/20">
            <Compass className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-foreground">Welcome to the Guided Learning Map</h3>
        </div>
        <div className="space-y-2 text-muted-foreground">
          <p>
            The Guided Learning Map accompanies you throughout your entire training process and provides access to external knowledge sources and references.
          </p>
          <p className="font-semibold text-foreground">
            How to use the map:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Follow the path from top to bottom - each topic leads to the next</li>
            <li>Click on any topic to see its subtopics</li>
            <li>Mark topics as completed by clicking the icon next to the title</li>
            <li>Track your progress with the progress bar at the top of the page</li>
          </ul>
        </div>
      </div>
      <Button variant="ghost" size="icon" onClick={onDismiss}>
        <X className="w-4 h-4" />
      </Button>
    </div>
  </motion.div>
);

export const GuidedLearningPanel = () => {
  const [open, setOpen] = useState(false);
  const [completedNodes, setCompletedNodes] = useState<Set<string>>(new Set());
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);
  const { toast } = useToast();

  // Load completed nodes from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('guided-learning-completed');
    if (saved) {
      setCompletedNodes(new Set(JSON.parse(saved)));
    }
    const onboardingDismissed = localStorage.getItem('guided-learning-onboarding-dismissed');
    if (onboardingDismissed) {
      setShowOnboarding(false);
    }
  }, []);

  // Save completed nodes to localStorage
  useEffect(() => {
    localStorage.setItem('guided-learning-completed', JSON.stringify([...completedNodes]));
  }, [completedNodes]);

  const handleToggleComplete = (id: string) => {
    setCompletedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
        toast({ title: "Topic marked as incomplete" });
      } else {
        newSet.add(id);
        toast({ title: "Topic completed! 🎉" });
        
        // Check if this completion means 100%
        const newTotal = newSet.size;
        const totalNodes = learningMap.reduce((acc, node) => {
          return acc + 1 + (node.children?.length || 0);
        }, 0);
        
        if (newTotal === totalNodes) {
          setShowCelebration(true);
          toast({ 
            title: "🎉 Congratulations!", 
            description: "You've completed the entire learning path!"
          });
          setTimeout(() => setShowCelebration(false), 5000);
        }
      }
      return newSet;
    });
  };

  const handleDismissOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem('guided-learning-onboarding-dismissed', 'true');
  };

  // Find next incomplete topic
  const findNextIncomplete = (): { node: LearningNode; parent?: LearningNode } | null => {
    for (const mainNode of learningMap) {
      if (!completedNodes.has(mainNode.id)) {
        return { node: mainNode };
      }
      if (mainNode.children) {
        for (const childNode of mainNode.children) {
          if (!completedNodes.has(childNode.id)) {
            return { node: childNode, parent: mainNode };
          }
        }
      }
    }
    return null;
  };

  const nextIncomplete = findNextIncomplete();

  // Calculate progress
  const totalNodes = learningMap.reduce((acc, node) => {
    return acc + 1 + (node.children?.length || 0);
  }, 0);
  const completedCount = completedNodes.size;
  const progressPercentage = (completedCount / totalNodes) * 100;
  const isFullyCompleted = completedCount === totalNodes;

  // Show celebration on mount if already completed
  useEffect(() => {
    if (open && isFullyCompleted && completedCount > 0) {
      setShowCelebration(true);
      const timer = setTimeout(() => setShowCelebration(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [open, isFullyCompleted, completedCount]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          size="lg"
          className="fixed right-0 top-1/2 -translate-y-1/2 rounded-r-none rounded-l-lg shadow-lg z-40 px-3 py-6 writing-mode-vertical bg-gradient-to-b from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
          style={{ writingMode: 'vertical-rl' }}
        >
          <Compass className="w-5 h-5 mb-2 rotate-90" />
          <span className="font-bold text-sm tracking-wider">GUIDED LEARNING</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-full w-screen h-screen max-h-screen p-0 gap-0 overflow-hidden flex flex-col">
        {/* Celebration Confetti */}
        {showCelebration && (
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={500}
            gravity={0.3}
          />
        )}

        {/* Header with Progress */}
        <div className="flex-shrink-0 bg-background border-b">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-gradient-to-br from-primary to-primary/60">
                  <Compass className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Guided Learning Map</h2>
                  <p className="text-sm text-muted-foreground">
                    Complete syllabus with external knowledge sources
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
                className="rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-foreground">Overall Progress</span>
                <span className="text-muted-foreground">
                  {completedCount} / {totalNodes} topics completed
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-6 py-8">
              {/* Onboarding Section */}
              {showOnboarding && <OnboardingSection onDismiss={handleDismissOnboarding} />}

              {/* Continue Learning or Completion Card */}
              {isFullyCompleted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-8"
                >
                  <Card className="border-2 border-primary bg-gradient-to-br from-primary/10 via-primary/5 to-background shadow-lg">
                    <CardContent className="p-8 text-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.2 }}
                        className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 mb-4"
                      >
                        <Trophy className="w-10 h-10 text-primary" />
                      </motion.div>
                      <h3 className="text-2xl font-bold text-foreground mb-2">
                        🎉 Congratulations!
                      </h3>
                      <p className="text-muted-foreground text-lg">
                        You've completed the entire learning path!
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : nextIncomplete ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8"
                >
                  <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 via-background to-background shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                              Continue Where You Left Off
                            </Badge>
                          </div>
                          <h3 className="text-xl font-bold text-foreground mb-1">
                            {nextIncomplete.node.title}
                          </h3>
                          {nextIncomplete.parent && (
                            <p className="text-sm text-muted-foreground mb-3">
                              Part of: {nextIncomplete.parent.title}
                            </p>
                          )}
                          {nextIncomplete.node.subtitle && (
                            <p className="text-sm text-muted-foreground">
                              {nextIncomplete.node.subtitle}
                            </p>
                          )}
                        </div>
                        <Button
                          onClick={() => {
                            if (nextIncomplete.node.children && nextIncomplete.node.children.length > 0) {
                              // Scroll to the node in the list
                              const element = document.getElementById(`node-${nextIncomplete.node.id}`);
                              element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            } else {
                              window.open(nextIncomplete.node.url, '_blank');
                            }
                          }}
                          className="gap-2"
                        >
                          Start
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : null}

              {/* Learning Path */}
              <div className="relative">
                <div className="absolute right-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-primary/20" />
                
                <div className="space-y-4">
                  {learningMap.map((node, index) => (
                    <NodeCard 
                      key={node.id} 
                      node={node} 
                      index={index}
                      completedNodes={completedNodes}
                      onToggleComplete={handleToggleComplete}
                    />
                  ))}
                </div>
              </div>

              {/* Footer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-12 p-6 rounded-xl bg-muted/50 border border-border text-center"
              >
                <p className="text-muted-foreground">
                  💡 Click on any topic to explore external resources and expand your knowledge
                </p>
              </motion.div>
            </div>
          </div>
      </DialogContent>
    </Dialog>
  );
};
