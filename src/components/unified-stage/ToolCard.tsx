import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle2, PlayCircle, ExternalLink, Video } from 'lucide-react';

interface ToolCardProps {
  id: string;
  title: string;
  description: string;
  estimatedTime: string;
  icon: React.ReactNode;
  isCompleted: boolean;
  videoUrl?: string;
  toolLink?: string;
  onStart: () => void;
  isDisabled?: boolean;
  className?: string;
}

export function ToolCard({
  id,
  title,
  description,
  estimatedTime,
  icon,
  isCompleted,
  videoUrl,
  toolLink,
  onStart,
  isDisabled = false,
  className = ""
}: ToolCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      whileHover={{ 
        y: -2,
        transition: { type: "spring", stiffness: 300, damping: 20 }
      }}
      className={className}
    >
      <Card className={`
        relative overflow-hidden rounded-2xl border-2 transition-all duration-300
        ${isCompleted 
          ? 'border-journey-complete bg-gradient-to-br from-journey-complete/5 to-journey-complete/10' 
          : 'border-border hover:border-primary/50 bg-card hover:shadow-lg'
        }
        ${isDisabled ? 'opacity-60' : ''}
      `}>
        {/* Glow Effect for Completed */}
        {isCompleted && (
          <div className="absolute inset-0 bg-gradient-to-r from-journey-complete/20 via-transparent to-journey-complete/20 opacity-50" />
        )}
        
        <CardHeader className="relative pb-4">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className={`
              flex-shrink-0 p-3 rounded-xl transition-all duration-300
              ${isCompleted 
                ? 'bg-journey-complete text-white' 
                : 'bg-gradient-to-br from-primary to-primary-700 text-white'
              }
            `}>
              {icon}
            </div>
            
            {/* Content */}
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <CardTitle className="text-xl font-semibold">{title}</CardTitle>
                {isCompleted && (
                  <Badge variant="outline" className="text-journey-complete border-journey-complete/30">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Completed
                  </Badge>
                )}
              </div>
              
              <CardDescription className="text-base leading-relaxed">
                {description}
              </CardDescription>
              
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {estimatedTime}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative space-y-4">
          {/* Quick Links */}
          {(videoUrl || toolLink) && (
            <div className="flex flex-wrap gap-2">
              {videoUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="h-8 text-xs"
                >
                  <a href={videoUrl} target="_blank" rel="noopener noreferrer">
                    <Video className="h-3 w-3 mr-1" />
                    Tutorial
                  </a>
                </Button>
              )}
              {toolLink && (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="h-8 text-xs"
                >
                  <a href={toolLink} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Open Tool
                  </a>
                </Button>
              )}
            </div>
          )}

          {/* Main CTA */}
          <Button
            onClick={onStart}
            aria-disabled={isDisabled}
            className={`
              w-full relative overflow-hidden transition-all duration-300
              ${isCompleted 
                ? 'bg-journey-complete hover:bg-journey-complete/90' 
                : 'bg-gradient-to-r from-primary to-primary-700 hover:from-primary-700 hover:to-primary shadow-lg hover:shadow-xl'
              }
              ${isDisabled ? 'opacity-60 cursor-not-allowed' : ''}
            `}
          >
            <PlayCircle className="h-4 w-4 mr-2" />
            {isCompleted ? "Review Unit" : "Start Learning →"}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}