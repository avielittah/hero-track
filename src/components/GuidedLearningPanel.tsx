import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, ExternalLink, Youtube, FileText, Link2, Compass, CheckCircle2, Circle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

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
          <h3 className="text-xl font-bold text-foreground">ברוכים הבאים למפת הלמידה המודרכת</h3>
        </div>
        <div className="space-y-2 text-muted-foreground">
          <p>
            מפת הלמידה המודרכת מלווה אותך לאורך כל תהליך ההכשרה ומספקת לך גישה למקורות מידע ורפרנסים חיצוניים.
          </p>
          <p className="font-semibold text-foreground">
            איך להשתמש במפה:
          </p>
          <ul className="list-disc list-inside space-y-1 mr-4">
            <li>עקוב אחר המסלול מלמעלה למטה - כל נושא מוביל לנושא הבא</li>
            <li>לחץ על כל נושא כדי לראות את תתי הנושאים שלו</li>
            <li>סמן נושאים שהשלמת על ידי לחיצה על הסמל ליד השם</li>
            <li>עקוב אחר ההתקדמות שלך בעזרת סרגל ההתקדמות בראש העמוד</li>
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
        toast({ title: "נושא סומן כלא הושלם" });
      } else {
        newSet.add(id);
        toast({ title: "נושא סומן כהושלם! 🎉" });
      }
      return newSet;
    });
  };

  const handleDismissOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem('guided-learning-onboarding-dismissed', 'true');
  };

  // Calculate progress
  const totalNodes = learningMap.reduce((acc, node) => {
    return acc + 1 + (node.children?.length || 0);
  }, 0);
  const completedCount = completedNodes.size;
  const progressPercentage = (completedCount / totalNodes) * 100;

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
      
      <DialogContent className="max-w-full w-screen h-screen max-h-screen p-0 gap-0">
        <div className="flex flex-col h-full">
          {/* Header with Progress */}
          <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
            <div className="container mx-auto px-6 py-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-gradient-to-br from-primary to-primary/60">
                    <Compass className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">מפת למידה מודרכת</h2>
                    <p className="text-sm text-muted-foreground">
                      סילבוס מלא עם מקורות מידע חיצוניים
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
                  <span className="font-semibold text-foreground">התקדמות כללית</span>
                  <span className="text-muted-foreground">
                    {completedCount} / {totalNodes} נושאים הושלמו
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
                  💡 לחץ על כל נושא לחקור מקורות מידע חיצוניים ולהרחיב את הידע שלך
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
