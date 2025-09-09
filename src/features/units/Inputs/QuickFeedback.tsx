import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';

interface FeedbackData {
  rating: number;
  comment: string;
}

interface QuickFeedbackProps {
  value?: FeedbackData;
  onChange: (feedback: FeedbackData) => void;
  disabled?: boolean;
}

export const QuickFeedback = ({ 
  value = { rating: 0, comment: '' }, 
  onChange, 
  disabled = false 
}: QuickFeedbackProps) => {
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleRatingClick = (rating: number) => {
    if (!disabled) {
      onChange({ ...value, rating });
    }
  };

  const handleCommentChange = (comment: string) => {
    if (comment.length <= 200) {
      onChange({ ...value, comment });
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
      <Label className="text-base font-semibold text-foreground mb-4 block">
        Quick Feedback
      </Label>
      
      {/* Rating Stars */}
      <div className="mb-4">
        <p className="text-sm text-muted-foreground mb-3">How would you rate this unit?</p>
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => {
            const isActive = star <= (hoveredRating || value.rating);
            
            return (
              <motion.button
                key={star}
                type="button"
                onClick={() => handleRatingClick(star)}
                onMouseEnter={() => !disabled && setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                disabled={disabled}
                className={`
                  p-1 rounded transition-colors duration-200
                  ${disabled ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-primary/10'}
                `}
                whileHover={!disabled ? { scale: 1.1 } : {}}
                whileTap={!disabled ? { scale: 0.9 } : {}}
              >
                <Star
                  className={`
                    h-8 w-8 transition-colors duration-200
                    ${isActive ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}
                    ${disabled ? 'opacity-50' : ''}
                  `}
                />
              </motion.button>
            );
          })}
        </div>
        {value.rating > 0 && (
          <p className="text-sm text-muted-foreground mt-2">
            {value.rating === 1 && 'Poor'}
            {value.rating === 2 && 'Fair'}
            {value.rating === 3 && 'Good'}
            {value.rating === 4 && 'Very Good'}
            {value.rating === 5 && 'Excellent'}
          </p>
        )}
      </div>

      {/* Comment */}
      <div>
        <Label htmlFor="feedback-comment" className="text-sm text-muted-foreground mb-2 block">
          Additional comments (optional)
        </Label>
        <Textarea
          id="feedback-comment"
          value={value.comment}
          onChange={(e) => handleCommentChange(e.target.value)}
          disabled={disabled}
          placeholder={disabled ? "Feedback submitted" : "Share your thoughts about this unit..."}
          className="min-h-[80px] resize-none"
          maxLength={200}
        />
        <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
          <span>Maximum 200 characters</span>
          <span className={value.comment.length >= 190 ? 'text-yellow-600' : ''}>
            {value.comment.length}/200
          </span>
        </div>
      </div>
    </Card>
  );
};