import { motion } from 'framer-motion';
import { Bot, User } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface MentorChatMessageProps {
  type: 'mentor' | 'user';
  children: React.ReactNode;
  delay?: number;
  showAvatar?: boolean;
}

export function MentorChatMessage({ 
  type, 
  children, 
  delay = 0,
  showAvatar = true 
}: MentorChatMessageProps) {
  const isMentor = type === 'mentor';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className={cn(
        "flex gap-3 mb-4",
        !isMentor && "flex-row-reverse"
      )}
    >
      {showAvatar && (
        <Avatar className={cn(
          "w-8 h-8 flex-shrink-0",
          isMentor ? "bg-primary" : "bg-secondary"
        )}>
          <AvatarFallback>
            {isMentor ? (
              <Bot className="w-4 h-4 text-primary-foreground" />
            ) : (
              <User className="w-4 h-4 text-secondary-foreground" />
            )}
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={cn(
        "flex-1 max-w-[85%]",
        !isMentor && "flex justify-end"
      )}>
        <div className={cn(
          "rounded-2xl px-4 py-3 shadow-sm",
          isMentor 
            ? "bg-muted text-foreground rounded-tl-none" 
            : "bg-primary text-primary-foreground rounded-tr-none"
        )}>
          {children}
        </div>
      </div>
    </motion.div>
  );
}

interface TypingIndicatorProps {
  delay?: number;
}

export function TypingIndicator({ delay = 0 }: TypingIndicatorProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay }}
      className="flex gap-3 mb-4"
    >
      <Avatar className="w-8 h-8 flex-shrink-0 bg-primary">
        <AvatarFallback>
          <Bot className="w-4 h-4 text-primary-foreground" />
        </AvatarFallback>
      </Avatar>
      
      <div className="bg-muted rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
        <div className="flex gap-1">
          <motion.div
            className="w-2 h-2 bg-muted-foreground/40 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
          />
          <motion.div
            className="w-2 h-2 bg-muted-foreground/40 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
          />
          <motion.div
            className="w-2 h-2 bg-muted-foreground/40 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
          />
        </div>
      </div>
    </motion.div>
  );
}
