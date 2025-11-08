import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, ExternalLink, Youtube, FileText, Link2, Compass } from 'lucide-react';
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
    subtitle: 'Getting Started',
    type: 'youtube',
    url: 'https://youtube.com',
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
    ],
  },
  {
    id: '2',
    title: 'Technical Tools',
    subtitle: 'Essential Skills',
    type: 'youtube',
    url: 'https://youtube.com',
    children: [
      {
        id: '2.1',
        title: 'Draw.io Mastery',
        type: 'youtube',
        url: 'https://youtube.com',
      },
      {
        id: '2.2',
        title: 'VLC Advanced Features',
        type: 'article',
        url: 'https://example.com/vlc',
      },
    ],
  },
  {
    id: '3',
    title: 'Advanced Concepts',
    subtitle: 'Level Up',
    type: 'article',
    url: 'https://example.com',
    children: [
      {
        id: '3.1',
        title: 'System Integration',
        type: 'resource',
        url: 'https://example.com/integration',
      },
      {
        id: '3.2',
        title: 'Best Practices',
        type: 'article',
        url: 'https://example.com/best-practices',
      },
    ],
  },
];

const NodeCard = ({ node, index, depth = 0 }: { node: LearningNode; index: number; depth?: number }) => {
  const [expanded, setExpanded] = useState(false);
  
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
          node.completed && 'border-green-500/50 bg-green-500/5'
        )}
        onClick={() => {
          if (node.children && node.children.length > 0) {
            setExpanded(!expanded);
          } else {
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
            {node.completed && (
              <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200">
                ✓ Complete
              </Badge>
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
            <NodeCard key={child.id} node={child} index={idx} depth={depth + 1} />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export const GuidedLearningPanel = () => {
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
            <div>
              <h2 className="font-bold">Guided Learning Map</h2>
              <p className="text-sm text-muted-foreground font-normal">
                Explore the syllabus and external resources
              </p>
            </div>
          </SheetTitle>
        </SheetHeader>

        {/* Journey Path Visualization */}
        <div className="relative mb-8">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-transparent" />
          
          <div className="space-y-6">
            {learningMap.map((node, index) => (
              <NodeCard key={node.id} node={node} index={index} />
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
