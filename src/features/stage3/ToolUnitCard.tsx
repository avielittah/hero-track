import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Video, Clock, CheckCircle2, PlayCircle } from 'lucide-react';

interface ToolUnitCardProps {
  id: string;
  title: string;
  objective: string;
  estimatedTime: string;
  videoUrl?: string;
  toolLink?: string;
  isSubmitted: boolean;
  isDisabled?: boolean;
  children: React.ReactNode;
}

export function ToolUnitCard({
  id,
  title,
  objective,
  estimatedTime,
  videoUrl,
  toolLink,
  isSubmitted,
  isDisabled = false,
  children
}: ToolUnitCardProps) {
  // Auto-expand first unit (drawio) to make it more accessible
  const [isExpanded, setIsExpanded] = useState(id === 'drawio');

  const handleToggle = () => {
    if (!isDisabled) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl">{title}</CardTitle>
              {isSubmitted && (
                <Badge variant="outline" className="text-emerald-600 border-emerald-200">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Completed
                </Badge>
              )}
            </div>
            <CardDescription className="text-base">{objective}</CardDescription>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {estimatedTime}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          {videoUrl && (
            <Button
              variant="outline"
              size="sm"
              asChild
              className="h-8"
            >
              <a href={videoUrl} target="_blank" rel="noopener noreferrer">
                <Video className="h-3 w-3 mr-1" />
                Watch Tutorial
              </a>
            </Button>
          )}
          {toolLink && (
            <Button
              variant="outline"
              size="sm"
              asChild
              className="h-8"
            >
              <a href={toolLink} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3 w-3 mr-1" />
                Open Tool
              </a>
            </Button>
          )}
        </div>

        <Button
          onClick={handleToggle}
          variant={isExpanded ? "secondary" : "default"}
          className="w-full mt-4"
          disabled={isDisabled}
        >
          <PlayCircle className="h-4 w-4 mr-2" />
          {isExpanded ? "Close Unit" : isSubmitted ? "View Unit" : "Start Learning"}
          {isDisabled && <span className="ml-2 text-xs">(Complete stage 2 first)</span>}
        </Button>
      </CardHeader>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <CardContent className="pt-0">
              {children}
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}