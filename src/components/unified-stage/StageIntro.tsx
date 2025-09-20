import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Clock, Lightbulb } from 'lucide-react';

interface StageIntroProps {
  title: string;
  description: string;
  estimatedTime: string;
  xpTarget: number;
  icon?: React.ReactNode;
  className?: string;
}

export function StageIntro({
  title,
  description,
  estimatedTime,
  xpTarget,
  icon,
  className = ""
}: StageIntroProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/5 border border-primary/20 p-8 mb-8 ${className}`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--primary)/0.1),transparent_50%),radial-gradient(circle_at_70%_50%,hsl(var(--secondary)/0.1),transparent_50%)]" />
      
      <div className="relative space-y-6">
        {/* Header with Icon */}
        <div className="flex items-start gap-6">
          {icon && (
            <div className="flex-shrink-0 p-4 rounded-2xl bg-gradient-to-br from-primary to-primary-700 text-white shadow-lg">
              {icon}
            </div>
          )}
          
          <div className="flex-1 space-y-4">
            <h1 className="text-5xl md:text-6xl font-black text-foreground leading-tight tracking-tight mb-6">
              {title}
            </h1>
            
            <p className="text-xl md:text-2xl font-light text-muted-foreground leading-relaxed max-w-4xl mx-auto">
              {description}
            </p>
            
            {/* Stage Metadata */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/80 border border-border">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{estimatedTime}</span>
              </div>
              
              <Badge variant="outline" className="bg-primary/10 border-primary/30 text-primary">
                <Lightbulb className="h-3 w-3 mr-1" />
                Target: {xpTarget} XP
              </Badge>
            </div>
          </div>
        </div>

        {/* Agent Encouragement */}
        <div className="bg-background/60 backdrop-blur-sm rounded-xl border border-border/50 p-4">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <span className="text-lg">🤖</span>
            <span className="font-medium text-foreground">TaleAI Agent:</span>
            Ready to level up your skills? Each unit you complete brings you closer to mastery!
          </p>
        </div>
      </div>
    </motion.div>
  );
}