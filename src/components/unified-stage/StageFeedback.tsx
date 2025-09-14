import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Star, MessageSquare } from 'lucide-react';
import { useState } from 'react';

interface StageFeedbackProps {
  onSubmit: (feedback: {
    clarity: string;
    usefulness: number;
    comments?: string;
  }) => void;
  className?: string;
}

export function StageFeedback({ onSubmit, className = "" }: StageFeedbackProps) {
  const [clarity, setClarity] = useState<string>("");
  const [usefulness, setUsefulness] = useState<number>(0);
  const [comments, setComments] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!clarity || usefulness === 0) return;
    
    onSubmit({ clarity, usefulness, comments: comments || undefined });
    setIsSubmitted(true);
  };

  const isValid = clarity !== "" && usefulness > 0;

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`${className}`}
      >
        <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/50">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-green-600 dark:text-green-400 text-lg font-medium">
                ✅ Feedback submitted! Thank you for helping us improve.
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className={`${className}`}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Stage Feedback
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Clarity Question */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              How clear were the tools and instructions in this stage?
            </Label>
            <RadioGroup value={clarity} onValueChange={setClarity}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="very-clear" id="very-clear" />
                <Label htmlFor="very-clear" className="cursor-pointer">
                  Very clear
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="somewhat-clear" id="somewhat-clear" />
                <Label htmlFor="somewhat-clear" className="cursor-pointer">
                  Somewhat clear
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="not-clear" id="not-clear" />
                <Label htmlFor="not-clear" className="cursor-pointer">
                  Not clear
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Star Rating */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              How useful were these tools for your learning? (1-5 stars)
            </Label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setUsefulness(star)}
                  className={`p-1 transition-colors ${
                    star <= usefulness
                      ? 'text-yellow-500'
                      : 'text-gray-300 hover:text-yellow-400'
                  }`}
                >
                  <Star
                    className="h-6 w-6"
                    fill={star <= usefulness ? 'currentColor' : 'none'}
                  />
                </button>
              ))}
              {usefulness > 0 && (
                <span className="ml-2 text-sm text-muted-foreground">
                  {usefulness === 1 && "Poor"}
                  {usefulness === 2 && "Fair"}
                  {usefulness === 3 && "Good"}
                  {usefulness === 4 && "Very Good"}
                  {usefulness === 5 && "Excellent"}
                </span>
              )}
            </div>
          </div>

          {/* Comments */}
          <div className="space-y-3">
            <Label htmlFor="comments" className="text-sm font-medium">
              What would you improve? (Optional)
            </Label>
            <Textarea
              id="comments"
              placeholder="Share any suggestions for improving this stage..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          <Button 
            onClick={handleSubmit}
            disabled={!isValid}
            className="w-full"
          >
            Submit Feedback
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}