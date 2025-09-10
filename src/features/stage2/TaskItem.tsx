import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Plus } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TaskItemProps {
  id: string;
  label: string;
  help?: string;
  required: boolean;
  xp: number;
  checked: boolean;
  disabled?: boolean;
  onToggle: (id: string, checked: boolean) => void;
}

export const TaskItem = ({ 
  id, 
  label, 
  help, 
  required, 
  xp, 
  checked, 
  disabled = false,
  onToggle 
}: TaskItemProps) => {
  const [showXPAnimation, setShowXPAnimation] = useState(false);

  const handleCheckedChange = (isChecked: boolean) => {
    onToggle(id, isChecked);
    
    if (isChecked && !checked) {
      // Show XP animation for newly checked items
      setShowXPAnimation(true);
      setTimeout(() => setShowXPAnimation(false), 2000);
    }
  };

  return (
    <motion.div
      className={`
        relative p-4 rounded-xl border transition-all duration-200
        ${checked ? 'bg-green-50 border-green-200' : 'bg-white border-border'}
        ${disabled ? 'opacity-60' : 'hover:shadow-md'}
      `}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start space-x-4">
        {/* Checkbox */}
        <Checkbox
          id={id}
          checked={checked}
          disabled={disabled}
          onCheckedChange={handleCheckedChange}
          className="mt-1"
        />

        {/* Content */}
        <div className="flex-1 min-w-0">
          <label
            htmlFor={id}
            className={`
              block text-sm leading-relaxed cursor-pointer
              ${checked ? 'text-green-700 line-through' : 'text-foreground'}
              ${disabled ? 'cursor-not-allowed' : ''}
            `}
          >
            {label}
          </label>

          {/* Badges */}
          <div className="flex items-center space-x-2 mt-2">
            {required && (
              <Badge variant="destructive" className="text-xs">
                Required
              </Badge>
            )}
            <Badge variant="outline" className="text-xs">
              {xp} XP
            </Badge>
          </div>
        </div>

        {/* Help Button */}
        {help && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1 h-auto text-muted-foreground hover:text-foreground"
                  aria-label="Help information"
                >
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-sm">{help}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      {/* XP Animation */}
      <AnimatePresence>
        {showXPAnimation && (
          <motion.div
            className="absolute -top-2 -right-2 z-10"
            initial={{ scale: 0, opacity: 0, y: 0 }}
            animate={{ scale: 1, opacity: 1, y: -10 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-secondary text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
              <Plus className="h-3 w-3" />
              <span>{xp} XP</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};